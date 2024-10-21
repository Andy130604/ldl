import { useEffect, useState } from "react";
import { supabase } from "../createClient";

export default function Matches() {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        fetchMatches();
    }, []);

    async function fetchMatches() {
        const { data, error } = await supabase.from("matches").select("*");

        if (error) console.error(error);
        else setMatches(data);
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center dark:text-white">Matchs</h1>
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
                        <th className="px-4 py-2 text-left bg-gray-200 dark:bg-gray-700 dark:text-white">
                            Statut
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {matches.length > 0 ? (
                        matches.map((match, index) => (
                            <tr key={index} className="border-b dark:border-gray-700">
                                <td className="px-4 py-2">{match.player1_id}</td>
                                <td className="px-4 py-2">{match.player2_id}</td>
                                <td className="px-4 py-2">
                                    {new Date(match.scheduled_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2">{match.played ? "Joué" : "À venir"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4 dark:text-white">
                                Pas de matchs
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
