import { useEffect, useState } from "react";
import { socket } from "../socket";

export const SpeechToText = () => {
	const [isConnected, setIsConnected] = useState(socket.connected);

	let bufferSize = 2048,
	// AudioContext,
	// context,
	processor,
	input,
	globalStream;

	const AudioContext = window.AudioContext || window.webkitAudioContext;

	const [resultText, setResultText] = useState<string[]>([]);
	const [removeLastSentence, setRemoveLastSentence] = useState<boolean>(true);
	const [finalText, setFinalText] = useState<string>('');
	const [saveNotes, setSaveNotes] = useState<string[]>([]);
	const [recording, setRecording] = useState<boolean>(false);


	const constraints = {
		audio: true,
		video: false,
	};

	const onConnect = () => {
		setIsConnected(true);
		socket.emit('messageFromClient', {data: 'Hello from client'});
	}

	const onDisconnect = () => {
		setIsConnected(false);
	}
	
	const onMessageFromServer = (data: any) => {
		console.log(data);
	}

	const onSpeechData = (data: any) => {
		var dataFinal = undefined || data.results[0].isFinal;
		if (dataFinal === false) {
			if (removeLastSentence) {
			  setResultText(prevState => prevState.slice(0, prevState.length - 1));
			}
			setRemoveLastSentence(true);
		} else {
			var transcript : string;
            transcript = data.results[0].alternatives[0].transcript;
			setFinalText(prevState => prevState + ' ' + transcript);
		}
	};

	useEffect(() => {
		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('messageFromServer', onMessageFromServer);
		socket.on('speechData', onSpeechData);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('foo', onMessageFromServer);
		};
	}, []);

	function microphoneProcess(buffer: any) {
		socket.emit('binaryData', buffer);
	}

	const initRecording = async () => {
		socket.emit('startGoogleCloudStream', {data: 'start stream'}); //init socket Google Speech Connection
		
		const context = new AudioContext({
			// if Non-interactive, use 'playback' or 'balanced' // https://developer.mozilla.org/en-US/docs/Web/API/AudioContextLatencyCategory
			latencyHint: 'interactive',
		});
		try {
			await context.audioWorklet.addModule('./assets/js/recorderWorkletProcessor.js');
			context.resume();
		
			globalStream = await navigator.mediaDevices.getUserMedia(constraints)
			input = context.createMediaStreamSource(globalStream)
			processor = new window.AudioWorkletNode(
				context,
				'recorder.worklet'
			);
			processor.connect(context.destination);
			context.resume()
			input.connect(processor)
			processor.port.onmessage = (e) => {
				const audioData = e.data;
				microphoneProcess(audioData)
			}
			setRecording(true);
		} catch(err) {
			console.error(err);
			setRecording(false);
		}
	};

	const stopRecording = () => {
		socket.emit('endGoogleCloudStream', '');
		setRecording(false);
	// 	context.close().then(function () {
	// 	  input = null;
	// 	  processor = null;
	// 	  context = null;
	// 	  AudioContext = null;
	// 	});
		
	// 	// context.close();
	}


	const startRecording = () => {
		initRecording();
	}

	const handleSaveNote = () => {
        setSaveNotes([...saveNotes, finalText]);
        setFinalText('');
    }

	return (
		<div>
			<audio></audio>
			<button id="startRecButton" type="button" onClick={startRecording} disabled={recording}> Start recording</button>
			<button id="stopRecButton" type="button" onClick={stopRecording} disabled={!recording}> Stop recording</button>
			<div id="recordingStatus">&nbsp;</div>
			<div>
                {finalText.length > 0 ? 
					<span>{finalText}</span> : 
					<span className="greyText">...</span>
				}
            </div>
			<div className="box">
                <h2>Notes</h2>
				<button onClick={handleSaveNote} disabled={!finalText}>Save Note</button>
                {saveNotes.map((n: string) => {
                    return <p key={n}>{n}</p>
                })}
            </div>
		</div>
	);
};