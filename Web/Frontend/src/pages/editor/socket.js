import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_EDITOR_BACKEND_URL || `http://${window.location.hostname}:8003`;

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ['websocket', 'polling'],
});
