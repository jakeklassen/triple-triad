import * as TripleTriad from '@tripletriad/game';
import { serve } from 'https://deno.land/std@0.155.0/http/server.ts';
import shuffle from 'just-shuffle';

serve(() => {
  const body = JSON.stringify({
    version: TripleTriad.VERSION,
    cards: shuffle(TripleTriad.CARDS),
  });

  return new Response(body, {
    headers: {
      'content-type': 'application/json',
    },
  });
});
