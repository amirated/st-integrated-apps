import express from 'express';
import { Server } from "socket.io";

// import speech from '@google-cloud/speech';

import { Request } from './types.d';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const environmentVars = require('dotenv').config();

// Google Cloud
const speech = require('@google-cloud/speech');
const speechClient = new speech.SpeechClient(); // Creates a client

const app = express();

const expressServer = app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

const io = new Server(expressServer, {
  cors: {
    origin: "http://localhost:4200"
  }
});

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

io.on('connection', (socket) => {
    let recognizeStream = null;
    socket.emit('messageFromServer', {data: 'welcome'});
    
    socket.on('messageFromClient', (data) => {
        console.log("Data: ", data)
    });

    socket.on('startGoogleCloudStream', (data) => {
      startRecognitionStream(socket, data);
    });

    socket.on('endGoogleCloudStream', () => {
      stopRecognitionStream();
    });

    socket.on('binaryData', function (data) {
      if (recognizeStream !== null) {
        recognizeStream.write(data);
      }
    });

    function startRecognitionStream(client, data) {
      recognizeStream = speechClient
        .streamingRecognize(request)
        .on('error', (err) => {
            console.error('Error when processing audio: ' + (err && err.code ? 'Code: ' + err.code + ' ' : '') + (err && err.details ? err.details : ''));
            socket.emit('googleCloudStreamError', err);
            stopRecognitionStream();
        })
        .on('data', (data) => {
          process.stdout.write(
            data.results[0] && data.results[0].alternatives[0]
              ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
              : '\n\nReached transcription time limit, press Ctrl+C\n'
          );
          socket.emit('speechData', data);
    
          // if end of utterance, let's restart stream
          // this is a small hack. After 65 seconds of silence, the stream will still throw an error for speech length limit
          if (data.results[0] && data.results[0].isFinal) {
            stopRecognitionStream();
            startRecognitionStream(client, data);
          }
        });
    }

    function stopRecognitionStream() {
      if (recognizeStream) {
        recognizeStream.end();
      }
      recognizeStream = null;
    }
})

// =========================== GOOGLE CLOUD SETTINGS ================================ //

// The encoding of the audio file, e.g. 'LINEAR16'
// The sample rate of the audio file in hertz, e.g. 16000
// The BCP-47 language code to use, e.g. 'en-US'
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US'; //en-US

const request: any = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    profanityFilter: false,
    enableWordTimeOffsets: true,
    // speechContexts: [{
    //     phrases: ["hoful","shwazil"]
    //    }] // add your own speech context for better recognition
  },
  interimResults: true, // If you want interim results, set this to true
};