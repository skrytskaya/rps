import { type NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Layout } from "~/components/layout";
import { MainArea } from "~/components/mainarea";
import { ScoreArea } from "~/components/scorearea";

const isBrowser = typeof window !== "undefined";
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
const Home: NextPage = () => {
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

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

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
  }, []);
  return (
    <Layout
      leftComponent={
        <MainArea
          players={players}
          setPlayers={setPlayers}
          updatePlayerScore={updatePlayerScore}
        />
      }
      rightComponent={<ScoreArea players={players} />}
    />
  );
};

export default Home;
