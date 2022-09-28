import { createGame } from '@tripletriad/game';
import './App.css';
import { Board } from './components/Board';

function App() {
  const { board, playerOne, playerTwo, whoGoesFirst } = createGame();

  console.log({ whoGoesFirst });

  return (
    <div className="flex items-center justify-center w-full h-full bg-black">
      <Board
        board={board}
        playerOne={playerOne}
        playerTwo={playerTwo}
        whoGoesFirst={whoGoesFirst}
      />
    </div>
  );
}

export default App;
