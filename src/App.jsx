import "./App.css";
import { supabase } from "./createClient";
import { useState, useEffect } from "react";

export default function App() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        const { data } = await supabase.from("users").select("*");
        setUsers(data);
        console.log(data);
    }

    return (
        <div className="h-screen w-screen flex justify-center align-middle items-center">
            <div className="text-3xl font-bold text-gray-300">
                Bienvenue dans la Ligue des Légendes 🔥
            </div>
        </div>
    );
}
