import { createGame } from '@tripletriad/game';
import './App.css';
import { Board } from './components/Board';

function App() {
  const { board, playerOne, playerTwo } = createGame();

  return (
    <div className="flex items-center justify-center w-full h-full bg-black">
      <Board board={board} playerOne={playerOne} playerTwo={playerTwo} />
    </div>
  );
}

export default App;
