import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { PlayerNameForm } from "~/components/playernameform";
interface Option {
  id: number;
  name: string;
  icon: string;
}

interface Player {
  name: string;
}

type WinnerOptions = "Computer" | "Player" | "Draw";

const options: Option[] = [
  { id: 0, name: "rock", icon: "🪨" },
  { id: 1, name: "paper", icon: "📄" },
  { id: 2, name: "scissors", icon: "✂️" },
];

const Home: NextPage = () => {
  const [playerName, setPlayerName] = useState<Player["name"]>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [computerOption, setComputerOption] = useState<Option | null>(null);
  const [playerOption, setPlayerOption] = useState<Option | null>(null);
  const [winner, setWinner] = useState<WinnerOptions | null>(null);
  const [isGameOn, setIsGameOn] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const savedPlayers = JSON.parse(
      localStorage.getItem("players") ?? "[]"
    ) as Player[];
    if (savedPlayers) {
      setPlayers(savedPlayers);
    }
  }, []);

  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;

    if (countdown > 0 && isGameOn) {
      countdownTimer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0 && isGameOn) {
      setCountdown(0);
      const randomIndex = Math.floor(Math.random() * options.length);
      const selectedOption = options[randomIndex] ?? null;
      setComputerOption(selectedOption);
      setWinner("Computer");
      setPlayerOption({ icon: "🤷", name: "none", id: options.length + 1 });
      setIsGameOn(false);
    }

    return () => clearTimeout(countdownTimer);
  }, [countdown, isGameOn]);

  const handlePlayerOption = (optionId: number) => {
    setPlayerOption(options[optionId] ?? null);
    const randomIndex = Math.floor(Math.random() * options.length);
    const selectedOption = options[randomIndex] ?? null;
    setComputerOption(selectedOption ?? null);
    determineWinner(options[optionId] ?? null, selectedOption);
  };

  const determineWinner = (
    playerOption: Option | null,
    computerOption: Option | null
  ) => {
    if (playerOption?.id === computerOption?.id) {
      setWinner("Draw");
    } else if (
      (playerOption?.name === "rock" && computerOption?.name === "scissors") ||
      (playerOption?.name === "scissors" && computerOption?.name === "paper") ||
      (playerOption?.name === "paper" && computerOption?.name === "rock")
    ) {
      setWinner("Player");
    } else {
      setWinner("Computer");
    }
    setIsGameOn(false);
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
      const newPlayer = { name };
      const updatedPlayers = [...players, newPlayer];
      setPlayers(updatedPlayers);
      localStorage.setItem("players", JSON.stringify(updatedPlayers));
    }
  };

  return (
    <div>
      <p>Welcome, {playerName || "Player"}!</p>
      {!playerName ? (
        <PlayerNameForm onPlayerSubmit={handlePlayerSubmit} />
      ) : (
        <>
          <button disabled={isGameOn} onClick={handleStartGame}>
            Start
          </button>
          <p>Time Remaining: {countdown}</p>
          <>
            <p>Choose your option:</p>
            <ul className="options">
              {options.map((option) => (
                <button
                  onClick={() => handlePlayerOption(option.id)}
                  key={option.id}
                  disabled={!isGameOn}
                >
                  {option.icon}
                </button>
              ))}
            </ul>
          </>
          {computerOption && playerOption && (
            <div>
              <h2>Results</h2>
              <p>Player: {playerOption.icon}</p>
              <p>Computer: {computerOption.icon}</p>
              <p>Winner: {winner}</p>
            </div>
          )}
          <h2>All Players</h2>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{player.name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Home;
