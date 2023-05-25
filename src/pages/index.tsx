import { type NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Layout } from "~/components/layout";
import { MainArea } from "~/components/mainarea";
import { ScoreArea } from "~/components/scorearea";

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
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const savedPlayers = JSON.parse(
      localStorage.getItem("players") ?? "[]"
    ) as Player[];
    setPlayers(savedPlayers);
  }, []);

  const updatePlayerScore = useCallback((name: string, result: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        if (player.name === name) {
          const updatedScore = {
            ...player.score,
            [result as keyof typeof player.score]:
              player.score[result as keyof typeof player.score] + 1,
          };

          const updatedPlayer = {
            ...player,
            score: updatedScore,
            totalGames: player.totalGames + 1,
          };

          localStorage.setItem(
            "players",
            JSON.stringify(
              prevPlayers.map((p) => (p.name === name ? updatedPlayer : p))
            )
          );

          return updatedPlayer;
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
