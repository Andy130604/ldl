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

export const scheduleMatch = async (player1, player2, scheduled_at) => {
    console.log("Scheduling match between", player1, "and", player2, "at", scheduled_at);
    if (player1.next_opponent === null && player2.next_opponent === null) {
        const { data, error1 } = await supabase
            .from("matches")
            .insert([
                {
                    player1_id: player1.id,
                    player2_id: player2.id,
                    played: false,
                    scheduled_at: scheduled_at
                }
            ])
            .select();
        if (error1) {
            console.error(error1);
            return;
        }
        const { error2 } = await supabase
            .from("players")
            .update({ next_opponent: player2.id })
            .eq("id", player1.id);
        if (error2) {
            console.error(error2);
            return;
        }
        const { error3 } = await supabase
            .from("players")
            .update({ next_opponent: player1.id })
            .eq("id", player2.id);
        if (error3) {
            console.error(error3);
            return;
        }
    } else {
        console.error("Players already have a match scheduled.");
    }
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
