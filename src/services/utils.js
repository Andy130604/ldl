export const isValidScore = (score) => {
    // TODO: Implement a way to check for sets, short sets and championship tie-breaks
    // For now, we'll just check that the score is an array of 3 sets
    return Array.isArray(score.sets) && score.sets.length === 3;
};

export const getWinnerIdByScore = (score, challengee, challenger) => {
    const challengeeSets = score.sets.filter((set) => set.challengee > set.challenger).length;
    const challengerSets = score.sets.filter((set) => set.challenger > set.challengee).length;

    if (challengeeSets > challengerSets) return challengee;
    if (challengerSets > challengeeSets) return challenger;
    return null;
};

export const getPlayerById = (id, players) => {
    if (!players) return null;
    return players.find((player) => player.id === id);
};

export const getPlayerName = (player) => {
    if (!player) return "Jouer inconnu";
    return `${player.first_name} ${player.last_name} (${player.rank})`;
};
