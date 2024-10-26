import { useEffect, useState } from "react";
import { fetchAllPlayers } from "../services/database";
import { getPlayerById, getPlayerName } from "../services/utils";

export default function Standings() {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetchAllPlayers().then((data) => setPlayers(data));
    }, []);

    const getRankChangeEmoji = (rank, lastRank) => {
        const displayLastRank = lastRank === null ? rank : lastRank;
        let emoji;

        if (lastRank === null) {
            emoji = "➡️"; // Grey horizontal arrow
        } else if (rank < lastRank) {
            emoji = "⬆️"; // Green up arrow
        } else if (rank > lastRank) {
            emoji = "⬇️"; // Red down arrow
        } else {
            emoji = "➡️"; // Grey horizontal arrow
        }

        return (
            <span className="relative group inline-flex items-center cursor-pointer">
                {emoji}
                <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Dernier classement: {displayLastRank}
                </span>
            </span>
        );
    };

    const getLastOpponent = (player) => {
        const lastOpponent = getPlayerById(player.last_player_played_id, players);
        return lastOpponent ? getPlayerName(lastOpponent) : "-";
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center dark:text-white">
                Classement des Joueurs
            </h1>
            <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left bg-gray-200 dark:bg-gray-700 dark:text-white">
                            Rang
                        </th>
                        <th className="px-16 py-2 text-left bg-gray-200 dark:bg-gray-700 dark:text-white">
                            {" "}
                            {/* Increased left padding */}
                            Joueur
                        </th>
                        <th className="px-4 py-2 text-left bg-gray-200 dark:bg-gray-700 dark:text-white">
                            Dernière confrontation
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {players.length > 0 ? (
                        players.map((player) => (
                            <tr key={player.id} className="border-b dark:border-gray-700">
                                <td className="px-4 py-2">
                                    {player.rank}{" "}
                                    <span>{getRankChangeEmoji(player.rank, player.last_rank)}</span>
                                </td>
                                <td className="px-16 py-2">
                                    {" "}
                                    {/* Increased left padding */}
                                    <span
                                        className={`${
                                            player.last_played_is_loss ? "font-bold" : ""
                                        } relative group`}
                                    >
                                        {`${player.first_name} ${player.last_name} aka. ${
                                            player.nickname || "N/A"
                                        }`}
                                        {player.last_played_is_loss && (
                                            <span className="absolute left-1/2 -translate-x-1/2 -bottom-6 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                Ce joueur a perdu son dernier match
                                            </span>
                                        )}
                                    </span>
                                </td>
                                <td className="px-4 py-2">{getLastOpponent(player)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center py-4 dark:text-white">
                                Pas de joueurs
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
