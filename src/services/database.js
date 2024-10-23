import { supabase } from "./supabaseClient";
import { getWinnerIdByScore, isValidScore } from "./utils";

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

export const writeMatchScore = async (match, score, players) => {
    if (!isValidScore(score)) {
        console.error("Invalid score format");
        return;
    }
    const winner_id = getWinnerIdByScore(score, match.player1_id, match.player2_id);

    // Update the match with the score and winner
    const { error } = await supabase
        .from("matches")
        .update({ score: score, winner_id: winner_id, played: true })
        .eq({ id: match.id });

    if (error) {
        console.error(error);
        return;
    }

    // Update the players with the new ranks or matches streaks

};
