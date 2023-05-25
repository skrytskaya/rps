import { useState } from "react";
interface PlayerNameFormProps {
  onPlayerSubmit: (playerName: string) => void;
}
export const PlayerNameForm = ({ onPlayerSubmit }: PlayerNameFormProps) => {
  const [playerName, setPlayerName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePlayerNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPlayerName(event.target.value);
  };

  const handleSubmit = () => {
    if (playerName.trim() === "") {
      setErrorMessage("Invalid player name");
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
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-center focus:border-customSkyHover focus:outline-none focus:ring"
      />
      <button
        className="mt-4 rounded-md bg-customSky px-4 py-2 hover:bg-customSkyHover focus:border-customSkyHover focus:outline-none focus:ring"
        onClick={handleSubmit}
      >
        CONTINUE
      </button>
      <div className="h-10">
        {errorMessage && (
          <div className="h-full px-4 py-2 text-red-700">{errorMessage}</div>
        )}
      </div>
    </>
  );
};
