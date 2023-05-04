import express from 'express';
import { Server } from "socket.io";

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

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
    console.log("socket.id: ", socket.id, " connected");
    socket.emit('messageFromServer', {data: 'welcome'});
    socket.on('messageFromClient', (data) => {
        console.log("Data: ", data)
    })
})

io.on('messageFromServer', (data) => {
  console.log(data);
});

io.emit('messageFromClient', {data: 'Hello from client'});