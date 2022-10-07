import { createGame } from '@tripletriad/game';
import './App.css';
import { Board } from './components/Board';

function App() {
  const { board, playerOne, playerTwo, whoGoesFirst, boardSize } = createGame();

  console.log({ whoGoesFirst });

  return (
    <div className="flex items-center justify-center w-full h-full bg-black">
      <Board
        initialBoard={board}
        playerOne={playerOne}
        playerTwo={playerTwo}
        whoGoesFirst={whoGoesFirst}
        size={boardSize}
      />
    </div>
  );
}

export default App;
