import { fireworks } from './fireworks.js';
import { ReliableWebSocket } from './websocket';


const ws = new ReliableWebSocket('ws://localhost:3030');

ws.addEventListener('connected', () => console.log('connected!!'));
ws.addEventListener('disconnected', () => console.log('disconnected!!'));
ws.addEventListener('connecting', () => console.log('connecting!!'));
ws.addEventListener('fireworks', () => {
  console.log('fireworks baby');
  fireworks();
});

ws.connect();
