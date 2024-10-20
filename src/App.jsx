import "./App.css";
import { supabase } from "./createClient";
import { useEffect, useState } from "react";

export default function App() {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetchPlayers();
    }, []);

    async function fetchPlayers() {
        const { data, error } = await supabase
            .from("players")
            .select("first_name, last_name, nickname, rank, last_rank")
            .order("rank", { ascending: true }); // Sort by rank ascending

        if (error) {
            console.error("Error fetching players:", error);
        } else {
            setPlayers(data); // Set fetched players into state
        }
    }

    // Function to determine the rank change emoji and corresponding color
    const getRankChange = (rank, lastRank) => {
        if (lastRank === null) return { emoji: "➡️", color: "" }; // Grey if last_rank is NULL
        if (rank < lastRank) return { emoji: "⬆️", color: "text-green-500" }; // Green if rank improved
        if (rank > lastRank) return { emoji: "⬇️", color: "text-red-500" }; // Red if rank dropped
        return { emoji: "➡️", color: "" }; // Grey if rank is the same
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6 text-center">Player Rankings</h1>

                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left bg-gray-200">Rank</th>
                            <th className="px-4 py-2 text-left bg-gray-200">First Name</th>
                            <th className="px-4 py-2 text-left bg-gray-200">Last Name</th>
                            <th className="px-4 py-2 text-left bg-gray-200">Nickname</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.length > 0 ? (
                            players.map((player) => {
                                const { emoji, color } = getRankChange(
                                    player.rank,
                                    player.last_rank
                                );

                                return (
                                    <tr key={player.nickname} className="border-b">
                                        <td className={`px-4 py-2 ${color}`}>
                                            {player.rank} <span className="ml-2">{emoji}</span>
                                        </td>
                                        <td className="px-4 py-2">{player.first_name}</td>
                                        <td className="px-4 py-2">{player.last_name}</td>
                                        <td className="px-4 py-2">{player.nickname || "N/A"}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4">
                                    No players found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
