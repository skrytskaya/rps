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

export const ScoreArea = ({ players }: ScoreAreaProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="p-2 text-2xl font-bold">All Players & Scores</h2>
      {/* TODO: replace overflow-y-auto solution w something better design-wise */}
      <div className="max-h-96 overflow-y-auto">
        {players.length === 0 ? (
          <>No players yet</>
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
    </div>
  );
};
