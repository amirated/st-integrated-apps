import { io } from 'socket.io-client';

const serverPort = 3000;
const URL = `http://localhost:${serverPort}`;

export const socket = io(URL);

