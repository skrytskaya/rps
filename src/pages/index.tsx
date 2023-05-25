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

const isBrowser = typeof window !== "undefined";
const Home: NextPage = () => {
  const [playerName, setPlayerName] = useState<Player["name"]>("");
  const [players, setPlayers] = useState<Player[]>(() => {
    if (isBrowser) {
      const savedPlayers = JSON.parse(
        localStorage.getItem("players") ?? "[]"
      ) as Player[];
      return savedPlayers ? savedPlayers : [];
    } else {
      return [];
    }
  });
  const [computerOption, setComputerOption] = useState<Option | null>(null);
  const [playerOption, setPlayerOption] = useState<Option | null>(null);
  const [winner, setWinner] = useState<WinnerOptions | null>(null);
  const [isGameOn, setIsGameOn] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const updatePlayerScore = useCallback((name: string, result: string) => {
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
    setIsGameOn(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

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

      setIsGameOn(false);
    }
    return () => clearTimeout(countdownTimer);
  }, [
    countdown,
    determineWinner,
    isGameOn,
    playerName,
    playerOption,
    updatePlayerScore,
    winner,
  ]);

  useEffect(() => {
    const savedPlayers = JSON.parse(
      localStorage.getItem("players") ?? "[]"
    ) as Player[];
    if (savedPlayers) {
      setPlayers(savedPlayers);
    }
  }, []);

  const handlePlayerOption = (optionId: number) => {
    setIsGameOn(false);
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
