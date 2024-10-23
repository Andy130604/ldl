import { supabase } from "./supabaseClient";

export const fetchAllPlayers = async () => {
    const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("rank", { ascending: true });

    if (error) console.error(error);
    return data;
};

export const fetchAllMatches = async () => {
    const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("scheduled_at", { ascending: true });

    if (error) console.error(error);
    return data;
};
