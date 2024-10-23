import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [players, setPlayers] = useState({});

    useEffect(() => {
        fetchMatches();
        fetchPlayers();
    }, []);

    async function fetchMatches() {
        const { data, error } = await supabase
            .from("matches")
            .select("*")
            .order("scheduled_at", { ascending: true });

        if (error) console.error(error);
        else setMatches(data);
    }

    async function fetchPlayers() {
        const { data, error } = await supabase.from("players").select("id, first_name, last_name");

        if (error) console.error(error);
        else {
            const playersMap = {};
            data.forEach((player) => {
                playersMap[player.id] = `${player.first_name} ${player.last_name}`;
            });
            setPlayers(playersMap);
        }
    }

    const getPlayerName = (id) => players[id] || "Inconnu";

    const splitMatches = () => {
        const upcoming = matches.filter((match) => !match.played);
        const played = matches.filter((match) => match.played);
        return { upcoming, played };
    };

    const { upcoming, played } = splitMatches();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center dark:text-white">Matchs</h1>

            {/* Upcoming Matches */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Matchs à venir</h2>
                <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left bg-gray-200 dark:bg-gray-700 dark:text-white">
                                Joueur 1
                            </th>
                            <th className="px-4 py-2 text-left bg-gray-200 dark:bg-gray-700 dark:text-white">
                                Joueur 2
                            </th>
                            <th className="px-4 py-2 text-left bg-gray-200 dark:bg-gray-700 dark:text-white">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {upcoming.length > 0 ? (
                            upcoming.map((match, index) => (
                                <tr key={index} className="border-b dark:border-gray-700">
                                    <td className="px-4 py-2">{getPlayerName(match.player1_id)}</td>
                                    <td className="px-4 py-2">{getPlayerName(match.player2_id)}</td>
                                    <td className="px-4 py-2">
                                        {new Date(match.scheduled_at).toLocaleDateString("fr-CH")}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4 dark:text-white">
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
                                className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-4"
                            >
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
                                    {/* Player 1 */}
                                    <tr
                                        className={`player ${
                                            winner === match.player1_id
                                                ? "bg-green-200 dark:bg-green-700"
                                                : ""
                                        }`}
                                    >
                                        <td className="name px-4 py-2">
                                            {getPlayerName(match.player1_id)}
                                        </td>
                                        <td className="set set-1 px-4 py-2">
                                            {score?.sets?.[0]?.player1 ?? ""}
                                        </td>
                                        <td className="set set-2 px-4 py-2">
                                            {score?.sets?.[1]?.player1 ?? ""}
                                        </td>
                                        <td className="set set-3 px-4 py-2">
                                            {score?.sets?.[2]?.player1 ?? ""}
                                        </td>
                                    </tr>
                                    {/* Player 2 */}
                                    <tr
                                        className={`player ${
                                            winner === match.player2_id
                                                ? "bg-green-200 dark:bg-green-700"
                                                : ""
                                        }`}
                                    >
                                        <td className="name px-4 py-2">
                                            {getPlayerName(match.player2_id)}
                                        </td>
                                        <td className="set set-1 px-4 py-2">
                                            {score?.sets?.[0]?.player2 ?? ""}
                                        </td>
                                        <td className="set set-2 px-4 py-2">
                                            {score?.sets?.[1]?.player2 ?? ""}
                                        </td>
                                        <td className="set set-3 px-4 py-2">
                                            {score?.sets?.[2]?.player2 ?? ""}
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
        </div>
    );
}
