import { useEffect, useState } from "react";
import {
    fetchAllMatches,
    fetchAllPlayers,
    scheduleMatch,
    writeMatchScore,
    deleteMatch // Import the new delete function
} from "../services/database";
import { checkIfMatchIsPossible, getPlayerById, getPlayerName } from "../services/utils";

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [players, setPlayers] = useState([]);
    const [showSchedulePopup, setShowSchedulePopup] = useState(false);
    const [showScorePopup, setShowScorePopup] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [formData, setFormData] = useState({
        challengee: "",
        challenger: "",
        scheduled_at: ""
    });
    const [scoreData, setScoreData] = useState([
        { challengee: "", challenger: "" },
        { challengee: "", challenger: "" },
        { challengee: "", challenger: "" }
    ]);
    const [error, setError] = useState("");

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = async () => {
        fetchAllPlayers().then((data) => setPlayers(data));
        fetchAllMatches().then((data) => setMatches(data));
    };

    const splitMatches = () => {
        const upcoming = matches.filter((match) => !match.played);
        const played = matches.filter((match) => match.played);
        return { upcoming, played };
    };

    const { upcoming, played } = splitMatches();

    const handleScheduleSubmit = async () => {
        const challengee = players.find((p) => p.id == formData.challengee);
        const challenger = players.find((p) => p.id == formData.challenger);
        const errorMessage = checkIfMatchIsPossible(challengee, challenger);
        if (errorMessage) {
            setError(errorMessage);
            return;
        }
        await scheduleMatch(challengee, challenger, formData.scheduled_at);
        setShowSchedulePopup(false);
        setError("");
        refreshData();
    };

    const handleDeleteMatch = async (match) => {
        try {
            await deleteMatch(match);
            refreshData();
        } catch (error) {
            console.error("Failed to delete match:", error);
        }
    };

    const handleScoreSubmit = async () => {
        await writeMatchScore(
            selectedMatch,
            { sets: scoreData },
            getPlayerById(selectedMatch.challengee, players),
            getPlayerById(selectedMatch.challenger, players),
            players
        );
        setShowScorePopup(false);
        refreshData();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleScoreChange = (index, player, value) => {
        const newScoreData = [...scoreData];
        newScoreData[index] = {
            ...newScoreData[index],
            [player]: parseInt(value) || 0 // Convert to integer or set to 0 if input is empty
        };
        setScoreData(newScoreData);
        setError("");
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center dark:text-white">Matchs</h1>
            <button
                onClick={() => setShowSchedulePopup(true)}
                className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
            >
                Programmer un match
            </button>

            {/* Upcoming Matches */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Matchs à venir</h2>
                <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left bg-gray-200 dark:bg-gray-700 dark:text-white">
                                Challengé
                            </th>
                            <th className="px-4 py-2 text-left bg-gray-200 dark:bg-gray-700 dark:text-white">
                                Challenger
                            </th>
                            <th className="px-4 py-2 text-left bg-gray-200 dark:bg-gray-700 dark:text-white">
                                Date
                            </th>
                            <th className="px-4 py-2 text-left bg-gray-200 dark:bg-gray-700 dark:text-white">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {upcoming.length > 0 ? (
                            upcoming.map((match, index) => (
                                <tr key={index} className="border-b dark:border-gray-700">
                                    <td className="px-4 py-2">
                                        {getPlayerName(getPlayerById(match.challengee, players))}
                                    </td>
                                    <td className="px-4 py-2">
                                        {getPlayerName(getPlayerById(match.challenger, players))}
                                    </td>
                                    <td className="px-4 py-2">
                                        {new Date(match.scheduled_at).toLocaleDateString("fr-CH", {
                                            timeZone: "Europe/Zurich",
                                            year: "2-digit",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </td>
                                    <td className="px-4 py-2 flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedMatch(match);
                                                setShowScorePopup(true);
                                            }}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Noter le score
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMatch(match)}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4 dark:text-white">
                                    Pas de matchs à venir
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>

            {/* Played Matches */}
            <section>
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Matchs joués</h2>
                {played.length > 0 ? (
                    played.map((match, index) => {
                        const score = match.score;
                        const winner = match.winner_id;

                        return (
                            <table
                                key={index}
                                className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-4 relative"
                            >
                                {/* Match Date */}
                                <span className="absolute top-2 left-4 text-gray-500 text-sm dark:text-gray-400">
                                    {new Date(match.scheduled_at).toLocaleDateString("fr-CH", {
                                        timeZone: "Europe/Zurich",
                                        year: "2-digit",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </span>
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2"></th>
                                        <th className="px-4 py-2 text-left bg-gray-200 dark:bg-gray-700 dark:text-white">
                                            Set 1
                                        </th>
                                        <th className="px-4 py-2 text-left bg-gray-200 dark:bg-gray-700 dark:text-white">
                                            Set 2
                                        </th>
                                        <th className="px-4 py-2 text-left bg-gray-200 dark:bg-gray-700 dark:text-white">
                                            Set 3
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        className={`player ${
                                            winner === match.challengee
                                                ? "bg-green-200 dark:bg-green-700"
                                                : ""
                                        }`}
                                    >
                                        <td className="name px-4 py-2">
                                            {getPlayerName(
                                                getPlayerById(match.challengee, players)
                                            )}
                                        </td>
                                        <td className="set set-1 px-4 py-2">
                                            {score?.sets?.[0]?.challengee ?? ""}
                                        </td>
                                        <td className="set set-2 px-4 py-2">
                                            {score?.sets?.[1]?.challengee ?? ""}
                                        </td>
                                        <td className="set set-3 px-4 py-2">
                                            {score?.sets?.[2]?.challengee ?? ""}
                                        </td>
                                    </tr>
                                    <tr
                                        className={`player ${
                                            winner === match.challenger
                                                ? "bg-green-200 dark:bg-green-700"
                                                : ""
                                        }`}
                                    >
                                        <td className="name px-4 py-2">
                                            {getPlayerName(
                                                getPlayerById(match.challenger, players)
                                            )}
                                        </td>
                                        <td className="set set-1 px-4 py-2">
                                            {score?.sets?.[0]?.challenger ?? ""}
                                        </td>
                                        <td className="set set-2 px-4 py-2">
                                            {score?.sets?.[1]?.challenger ?? ""}
                                        </td>
                                        <td className="set set-3 px-4 py-2">
                                            {score?.sets?.[2]?.challenger ?? ""}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        );
                    })
                ) : (
                    <p className="text-center dark:text-white">Aucun match joué pour le moment</p>
                )}
            </section>

            {/* Schedule Match Popup */}
            {showSchedulePopup && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-lg w-2/3 max-w-2xl">
                        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
                            Programmer un match
                        </h2>
                        <label className="block mb-2 dark:text-white">Challengé</label>
                        <select
                            name="challengee"
                            onChange={handleInputChange}
                            className="mb-4 p-2 border rounded w-full text-black"
                        >
                            <option value="">Sélectionnez un joueur</option>
                            {players
                                .filter((player) => player.next_opponent === null)
                                .map((player) => (
                                    <option
                                        key={player.id}
                                        value={player.id}
                                        className="text-black"
                                    >
                                        {getPlayerName(player)}
                                    </option>
                                ))}
                        </select>
                        <label className="block mb-2 dark:text-white">Challenger</label>
                        <select
                            name="challenger"
                            onChange={handleInputChange}
                            className="mb-4 p-2 border rounded w-full text-black"
                        >
                            <option value="">Sélectionnez un joueur</option>
                            {players
                                .filter((player) => player.next_opponent === null)
                                .map((player) => (
                                    <option
                                        key={player.id}
                                        value={player.id}
                                        className="text-black"
                                    >
                                        {getPlayerName(player)}
                                    </option>
                                ))}
                        </select>
                        <label className="block mb-2 dark:text-white">Date</label>
                        <input
                            type="datetime-local"
                            name="scheduled_at"
                            onChange={handleInputChange}
                            className="mb-4 p-2 border rounded w-full text-black"
                        />

                        {/* Error Message Display */}
                        {error && (
                            <div className="bg-red-500 bg-opacity-70 text-white p-4 rounded mb-4 flex items-center">
                                <span role="img" aria-label="warning" className="mr-2">
                                    ⚠️
                                </span>
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleScheduleSubmit}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                        >
                            Programmer
                        </button>
                        <button
                            onClick={() => setShowSchedulePopup(false)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            {/* Score Popup */}
            {showScorePopup && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-lg w-2/3 max-w-2xl">
                        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
                            Noter le score
                        </h2>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div></div>
                            <div className="text-center">
                                <h3 className="text-lg font-semibold dark:text-white">
                                    {getPlayerName(
                                        getPlayerById(selectedMatch.challengee, players)
                                    )}
                                </h3>
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-semibold dark:text-white">
                                    {getPlayerName(
                                        getPlayerById(selectedMatch.challenger, players)
                                    )}
                                </h3>
                            </div>
                        </div>
                        {["Set 1", "Set 2", "Set 3"].map((set, i) => (
                            <div key={i} className="grid grid-cols-3 gap-4 items-center mb-4">
                                {/* Set Label */}
                                <label className="text-center dark:text-white">{set}</label>
                                {/* Challengee Score Input */}
                                <input
                                    type="number"
                                    onChange={(e) =>
                                        handleScoreChange(
                                            i,
                                            "challengee",
                                            parseInt(e.target.value) || 0
                                        )
                                    }
                                    className="p-2 border rounded w-full text-center text-black"
                                    placeholder="Score"
                                />
                                {/* Challenger Score Input */}
                                <input
                                    type="number"
                                    onChange={(e) =>
                                        handleScoreChange(
                                            i,
                                            "challenger",
                                            parseInt(e.target.value) || 0
                                        )
                                    }
                                    className="p-2 border rounded w-full text-center text-black"
                                    placeholder="Score"
                                />
                            </div>
                        ))}
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleScoreSubmit}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                            >
                                Enregistrer
                            </button>
                            <button
                                onClick={() => setShowScorePopup(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
