import { useEffect, useState } from "react";
import { socket } from "../socket";

export const SpeechToText = () => {
	const [isConnected, setIsConnected] = useState(socket.connected);

	const onConnect = () => {
		setIsConnected(true);
		console.log("connected ", socket);
		socket.emit('messageFromClient', {data: 'Hello from client'});
	}

	const onDisconnect = () => {
		setIsConnected(false);
	}
	
	const onMessageFromServer = (data: any) => {
		console.log(data);
	}

	useEffect(() => {
		console.log("here");
		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('messageFromServer', onMessageFromServer);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('foo', onMessageFromServer);
		};
	}, []);

	return (
		<div>
			connected: {isConnected ? 'true' : 'false'}
		</div>
	);
};