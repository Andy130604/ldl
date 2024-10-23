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

export const createMatch = async (player1_id, player2_id, scheduled_at) => {
    const { data, error } = await supabase
        .from("matches")
        .insert([{ player1_id: player1_id, player2_id: player2_id, scheduled_at: scheduled_at }]);

    if (error) console.error(error);
    return data;
};

export const writeMatchScore = async (match, score) => {
    
};
