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

type ScoreAreaProps = {
  players: Player[];
};

// TODO: fix hydration
export const ScoreArea = ({ players }: ScoreAreaProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="p-2 text-2xl font-bold">All Players & Scores</h2>
      {players.length === 0 ? (
        <>No players</>
      ) : (
        <ul>
          {players.map((player, idx) => (
            <li key={idx}>
              <div className="flex flex-col items-center justify-center">
                <p>{player.name ?? "Player"}</p>
                <div>
                  Wins: {player.score.wins}, Draws:
                  {player.score.draws}, Losses: {player.score.losses}
                </div>
                Total Games:
                {player.totalGames}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
