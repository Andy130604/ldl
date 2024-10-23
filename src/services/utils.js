export const createPlayersMap = (players) => {
    const playersMap = {};
    players.forEach((player) => {
        playersMap[player.id] = `${player.first_name} ${player.last_name} (${player.rank})`;
    });
    return playersMap;
};

export const isValidScore = (score) => {
    // TODO: Implement a way to check for sets, short sets and championship tie-breaks
    // For now, we'll just check that the score is an array of 3 sets
    return Array.isArray(score.sets) && score.sets.length === 3;
};

export const getWinnerIdByScore = (score, player1_id, player2_id) => {
    const player1Sets = score.sets.filter((set) => set.player1 > set.player2).length;
    const player2Sets = score.sets.filter((set) => set.player2 > set.player1).length;

    if (player1Sets > player2Sets) return player1_id;
    if (player2Sets > player1Sets) return player2_id;
    return null;
};
