import { type NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { PlayerNameForm } from "~/components/playernameform";
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

// TODO vik: fix issue with loosing score and count of the last game

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

  const updatePlayerScore = useCallback(
    (name: string, result: string) => {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => {
          if (player.name === name) {
            return {
              ...player,
              score: {
                ...player.score,
                [result as keyof typeof player.score]:
                  player.score[result as keyof typeof player.score] + 1,
              },
              totalGames: player.totalGames + 1,
            };
          }
          return player;
        })
      );
      localStorage.setItem("players", JSON.stringify(players));
    },
    [players]
  );

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
      updatePlayerScore(playerName, "losses");
      setIsGameOn(false);
    }

    return () => clearTimeout(countdownTimer);
  }, [countdown, isGameOn, playerName, updatePlayerScore]);

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
      updatePlayerScore(playerName, "draws");
    } else if (
      (playerOption?.name === "rock" && computerOption?.name === "scissors") ||
      (playerOption?.name === "scissors" && computerOption?.name === "paper") ||
      (playerOption?.name === "paper" && computerOption?.name === "rock")
    ) {
      setWinner("Player");
      updatePlayerScore(playerName, "wins");
    } else {
      setWinner("Computer");
      updatePlayerScore(playerName, "losses");
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
          <h2>All Players & Scores</h2>
          <ul>
            {players.map((player, index) => (
              <li key={index}>
                {player.name} - Wins: {player.score.wins}, Draws:{" "}
                {player.score.draws}, Losses: {player.score.losses} - Total
                Games: {player.totalGames}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Home;
