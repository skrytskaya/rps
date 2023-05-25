import {
  type Dispatch,
  useCallback,
  useEffect,
  useState,
  type SetStateAction,
} from "react";
import { PlayerNameForm } from "./playernameform";

interface Option {
  id: number;
  name: string;
  icon: string;
}

interface Score {
  wins: number;
  draws: number;
  losses: number;
}
interface Player {
  name: string;
  score: Score;
  totalGames: number;
}

type WinnerOptions = "Computer" | "Player" | "Draw";

const options: Option[] = [
  { id: 0, name: "rock", icon: "🪨" },
  { id: 1, name: "paper", icon: "📄" },
  { id: 2, name: "scissors", icon: "✂️" },
];

type MainAreaProps = {
  players: Player[];
  setPlayers: Dispatch<SetStateAction<Player[]>>;
  updatePlayerScore: (name: string, result: string) => void;
};

export const MainArea = ({
  players,
  setPlayers,
  updatePlayerScore,
}: MainAreaProps) => {
  const [playerName, setPlayerName] = useState<Player["name"]>("");

  const [computerOption, setComputerOption] = useState<Option | null>(null);
  const [playerOption, setPlayerOption] = useState<Option | null>(null);
  const [winner, setWinner] = useState<WinnerOptions | null>(null);
  const [isGameOn, setIsGameOn] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const determineWinner = useCallback(
    (playerOption: Option | null) => {
      const randomIndex = Math.floor(Math.random() * options.length);
      const selectedOption = options[randomIndex] ?? null;
      setComputerOption(selectedOption);
      if (playerOption?.id === selectedOption?.id) {
        setWinner("Draw");
        updatePlayerScore(playerName, "draws");
      } else if (
        (playerOption?.name === "rock" &&
          selectedOption?.name === "scissors") ||
        (playerOption?.name === "scissors" &&
          selectedOption?.name === "paper") ||
        (playerOption?.name === "paper" && selectedOption?.name === "rock")
      ) {
        setWinner("Player");
        updatePlayerScore(playerName, "wins");
      } else {
        setWinner("Computer");
        updatePlayerScore(playerName, "losses");
      }
      setIsGameOn(false);
    },
    [playerName, updatePlayerScore]
  );

  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;

    if (countdown > 0 && isGameOn) {
      countdownTimer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0 && isGameOn) {
      setCountdown(0);
      const skippedOption = {
        id: options.length + 1,
        name: "none",
        icon: "🤷",
      };
      setPlayerOption(skippedOption);
      determineWinner(skippedOption);
    }

    return () => clearTimeout(countdownTimer);
  }, [countdown, determineWinner, isGameOn, playerName, playerOption, winner]);

  const handlePlayerOption = (optionId: number) => {
    setPlayerOption(options[optionId] ?? null);
    determineWinner(options[optionId] ?? null);
  };

  const handleStartGame = () => {
    setPlayerOption(null);
    setComputerOption(null);
    setWinner(null);
    setCountdown(3);
    setIsGameOn(true);
  };

  const handlePlayerSubmit = (name: string) => {
    if (name.trim() === "") {
      return;
    }
    setPlayerName(name);
    const existingPlayer = players.find((player) => player.name === name);
    if (!existingPlayer) {
      const newPlayer = {
        name,
        score: { wins: 0, draws: 0, losses: 0 },
        totalGames: 0,
      };
      const updatedPlayers = [...players, newPlayer];
      setPlayers(updatedPlayers);
      localStorage.setItem("players", JSON.stringify(updatedPlayers));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="p-2 text-2xl font-bold">
        Welcome, {playerName || "Player"}!
      </h2>
      {!playerName ? (
        <PlayerNameForm onPlayerSubmit={handlePlayerSubmit} />
      ) : (
        <>
          <button
            className="mb-4 mt-4 rounded-md bg-customSky px-4 py-2 hover:bg-customSkyHover focus:border-customSkyHover focus:outline-none focus:ring disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            disabled={isGameOn}
            onClick={handleStartGame}
          >
            START
          </button>
          <p className="mb-4 text-lg font-bold">Time Remaining: {countdown}</p>
          <div className="flex flex-col items-center justify-center">
            <p className="mb-2 text-lg font-bold">Choose your option:</p>
            <ul>
              {options.map((option) => (
                <button
                  onClick={() => handlePlayerOption(option.id)}
                  key={option.id}
                  disabled={!isGameOn}
                  className="mr-2 cursor-pointer rounded-md bg-customSky px-4 py-2 text-white hover:bg-customSkyHover focus:border-customSkyHover focus:outline-none focus:ring disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
                >
                  {option.icon}
                </button>
              ))}
            </ul>
            {computerOption && playerOption && (
              <div className="mt-4 flex flex-col items-center justify-center">
                <h2 className="text-lg font-bold">Results</h2>
                <p>Player: {playerOption.icon}</p>
                <p>Computer: {computerOption.icon}</p>
                <p>Winner: {winner}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
