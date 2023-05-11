import { io } from 'socket.io-client';

// const serverAddress = '52.221.242.84';
const serverAddress = 'localhost';
const serverPort = 3000;
const URL = `http://${serverAddress}:${serverPort}`;

export const socket = io(URL);

