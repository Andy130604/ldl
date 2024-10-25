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

export const writeMatchScore = async (match, score, player1, player2, players) => {
    if (!isValidScore(score)) {
        console.error("Invalid score format");
        return;
    }
    const winner_id = getWinnerIdByScore(score, match.player1_id, match.player2_id);

    // Update the match with the score and winner
    const { error1 } = await supabase
        .from("matches")
        .update({ score: score, winner_id: winner_id, played: true })
        .eq("id", match.id);

    if (error1) {
        console.error(error1);
        return;
    }

    // Update the players with the new ranks or matches streaks
    const isUpset =
        (winner_id === player1.id && player1.rank > player2.rank) ||
        (winner_id === player2.id && player2.rank > player1.rank);
    if (isUpset) {
        const { error2 } = await supabase
            .from("players")
            .update({
                rank: player2.rank,
                last_rank: player1.rank,
                last_player_played_id: player2.id,
                last_played_is_loss: false,
                next_opponent: null
            })
            .eq("id", player1.id)
            .select();
        if (error2) {
            console.error(error2);
            return;
        }
        const { error3 } = await supabase
            .from("players")
            .update({
                rank: player1.rank,
                last_rank: player2.rank,
                last_player_played_id: player1.id,
                last_played_is_loss: false,
                next_opponent: null
            })
            .eq("id", player2.id)
            .select();

        if (error3) {
            console.error(error3);
            return;
        }
    } else {
        const loser = winner_id === player1.id ? player2 : player1;
        // Update winner
        const { error4 } = await supabase
            .from("players")
            .update({
                last_player_played_id: loser.id,
                last_played_is_loss: false,
                next_opponent: null
            })
            .eq("id", winner_id)
            .select();
        if (error4) {
            console.error(error4);
            return;
        }

        if (loser.last_played_is_loss && loser.rank < 7) {
            const { error5 } = await supabase
                .from("players")
                .update({
                    rank: loser.rank + 1,
                    last_rank: loser.rank,
                    last_played_player_id: winner_id,
                    last_played_is_loss: false,
                    next_opponent: null
                })
                .eq("id", loser.id)
                .select();

            if (error5) {
                console.error(error5);
                return;
            }

            const belowPlayer = players.find((player) => player.rank === loser.rank + 1);
            const { error6 } = await supabase
                .from("players")
                .update({ rank: loser.rank, last_rank: belowPlayer.rank })
                .eq("id", belowPlayer.id)
                .select();

            if (error6) {
                console.error(error6);
                return;
            }
        } else {
            const { error7 } = await supabase
                .from("players")
                .update({
                    last_player_played_id: winner_id,
                    last_played_is_loss: true,
                    next_opponent: null
                })
                .eq("id", loser.id)
                .select();

            if (error7) {
                console.error(error7);
                return;
            }
        }
    }
};
