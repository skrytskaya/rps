import { useState } from "react";
interface PlayerNameFormProps {
  onPlayerSubmit: (playerName: string) => void;
}
export const PlayerNameForm = ({ onPlayerSubmit }: PlayerNameFormProps) => {
  const [playerName, setPlayerName] = useState("");

  const handlePlayerNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPlayerName(event.target.value);
  };

  const handleSubmit = () => {
    if (playerName.trim() === "") {
      return;
    }
    onPlayerSubmit(playerName);
  };
  return (
    <>
      <input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={handlePlayerNameChange}
      />
      <button onClick={handleSubmit}>CONTINUE</button>
    </>
  );
};
