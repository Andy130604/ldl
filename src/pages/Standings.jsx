import { useEffect, useState } from "react";
import { fetchAllPlayers } from "../services/database";

export default function Standings() {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetchAllPlayers().then((data) => setPlayers(data));
    }, []);

    const getRankChangeEmoji = (rank, lastRank) => {
        if (lastRank === null) return "➡️";
        if (rank < lastRank) return "⬆️";
        if (rank > lastRank) return "⬇️";
        return "➡️";
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
                        <th className="px-4 py-2 text-left bg-gray-200 dark:bg-gray-700 dark:text-white">
                            Prénom
                        </th>
                        <th className="px-4 py-2 text-left bg-gray-200 dark:bg-gray-700 dark:text-white">
                            Nom
                        </th>
                        <th className="px-4 py-2 text-left bg-gray-200 dark:bg-gray-700 dark:text-white">
                            Surnom
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {players.length > 0 ? (
                        players.map((player) => (
                            <tr key={player.nickname} className="border-b dark:border-gray-700">
                                <td className="px-4 py-2">
                                    {player.rank}{" "}
                                    <span>{getRankChangeEmoji(player.rank, player.last_rank)}</span>
                                </td>
                                <td className="px-4 py-2">{player.first_name}</td>
                                <td className="px-4 py-2">{player.last_name}</td>
                                <td className="px-4 py-2">{player.nickname || "N/A"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4 dark:text-white">
                                Pas de joueurs
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
