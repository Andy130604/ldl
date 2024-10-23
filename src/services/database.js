import { supabase } from "./supabaseClient";

export const fetchAllPlayers = async () => {
    const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("rank", { ascending: true });

    if (error) console.error(error);
    return data;
};
