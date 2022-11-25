import { createGame } from '@tripletriad/game';
import { serve } from 'https://deno.land/std@0.160.0/http/server.ts';

const game = createGame();

const sockets = new Set<WebSocket>();

const channel = new BroadcastChannel('chat');

channel.onmessage = (e) => {
  if (e.target != channel) {
    channel.postMessage(e.data);
  }

  for (const socket of sockets) {
    socket.send(
      JSON.stringify({
        payload: e.data,
        count: sockets.size,
      }),
    );
  }
};

serve((req) => {
  const upgrade = req.headers.get('upgrade') ?? '';

  // If this is not a websocket upgrade, return the initial HTML page.
  if (upgrade.toLowerCase() != 'websocket') {
    return new Response('Not Found', {
      status: 404,
      headers: {
        'content-type': 'text/plain',
      },
    });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  sockets.add(socket);

  socket.onopen = () => console.log('socket opened');
  socket.onerror = (e) => console.log('socket errored:', e);
  socket.onmessage = channel.onmessage as WebSocket['onmessage'];
  socket.onclose = () => sockets.delete(socket);

  return response;
});
