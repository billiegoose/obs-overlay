import { fireworks } from './fireworks.js';

const ws = new WebSocket('ws://localhost:3030');

ws.onmessage = ({ data }) => {
  console.log(data)
  if (data === 'fireworks') {
    fireworks();
  }
};
