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

export const scheduleMatch = async (challengee, challenger, scheduled_at) => {
    if (
        challengee.next_opponent === null &&
        challenger.next_opponent === null &&
        challenger.rank > challengee.rank &&
        challenger.rank - challengee.rank <= 2
    ) {
        const { error1 } = await supabase
            .from("matches")
            .insert([
                {
                    challengee: challengee.id,
                    challenger: challenger.id,
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
            .update({ next_opponent: challenger.id })
            .eq("id", challengee.id);
        if (error2) {
            console.error(error2);
            return;
        }
        const { error3 } = await supabase
            .from("players")
            .update({ next_opponent: challengee.id })
            .eq("id", challenger.id);
        if (error3) {
            console.error(error3);
            return;
        }
    } else {
        console.error(
            "Players already have a match scheduled or there is a rank difference greater than 2"
        );
    }
};

export const writeMatchScore = async (match, score, challengee, challenger, players) => {
    if (!isValidScore(score)) {
        console.error("Invalid score format");
        return;
    }
    const winner_id = getWinnerIdByScore(score, match.challengee, match.challenger);

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
    if (winner_id === challengee.id) {
        const { error2 } = await supabase
            .from("players")
            .update({
                rank: challenger.rank,
                last_rank: challengee.rank,
                last_player_played_id: challenger.id,
                last_played_is_loss: false,
                next_opponent: null
            })
            .eq("id", challengee.id)
            .select();
        if (error2) {
            console.error(error2);
            return;
        }
        const { error3 } = await supabase
            .from("players")
            .update({
                rank: challengee.rank,
                last_rank: challenger.rank,
                last_player_played_id: challengee.id,
                last_played_is_loss: false,
                next_opponent: null
            })
            .eq("id", challenger.id)
            .select();

        if (error3) {
            console.error(error3);
            return;
        }
    } else {
        const loser = winner_id === challengee.id ? challenger : challengee;
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

export const deleteMatch = async (match) => {
    const { error } = await supabase.from("matches").delete().eq("id", match.id);
    if (error) console.error(error);
    const { error1 } = await supabase
        .from("players")
        .update({ next_opponent: null })
        .eq("id", match.challengee);
    if (error1) console.error(error1);
    const { error2 } = await supabase
        .from("players")
        .update({ next_opponent: null })
        .eq("id", match.challenger);
    if (error2) console.error(error2);
};
