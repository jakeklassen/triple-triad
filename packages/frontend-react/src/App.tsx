import { RealtimeChannel } from '@supabase/supabase-js';
import { createGame } from '@tripletriad/game';
import { useEffect, useState } from 'react';
import './App.css';
import { Lobby } from './components/Lobby';
import { supabase } from './lib/supabase';

function App() {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel('room_1')
      .on('broadcast', { event: 'INPUT_EVENT' }, ({ event, payload }) => {
        console.log({ event, payload });
      })
      .subscribe();

    setChannel(channel);

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const { board, playerOne, playerTwo, whoGoesFirst, boardSize } = createGame();

  if (channel == null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center w-full h-full bg-black">
      {/* <Board
        initialBoard={board}
        playerOne={playerOne}
        playerTwo={playerTwo}
        whoGoesFirst={whoGoesFirst}
        size={boardSize}
        channel={channel}
      /> */}

      <Lobby onGameReady={() => {}} />
    </div>
  );
}

export default App;
