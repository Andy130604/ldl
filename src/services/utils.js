export const isValidScore = (score) => {
    // TODO: Implement a way to check for sets, short sets and championship tie-breaks
    // For now, we'll just check that the score is an array of 3 sets
    return Array.isArray(score.sets) && score.sets.length === 3;
};

export const getWinnerIdByScore = (score, challengee, challenger) => {
    let challengeeSets = 0;
    let challengerSets = 0;

    score.sets.forEach((set) => {
        if (set.challengee > set.challenger) {
            challengeeSets++;
        } else {
            challengerSets++;
        }
    });

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

export const checkIfMatchIsPossible = (challengee, challenger, date) => {
    if (challengee.next_opponent !== null) return "Le joueur défié a déjà un match de prévu";
    if (challenger.next_opponent !== null) return "Le challenger a déjà un match de prévu";
    if (date == "") return "Veuillez choisir une date pour le match";
    if (
        challengee.last_player_played_id === challenger.id ||
        challenger.last_player_played_id === challengee.id
    )
        return "Les joueurs viennent de se rencontrer";

    if (challengee.rank > challenger.rank) return "Le joueur défié doit être mieux classé";
    if (challenger.rank === challengee.rank) return "Choisissez deux joueurs différents";
    if (challenger.rank - challengee.rank > 2)
        return "Le challenger peut défier un joueur classé au maximum 2 rangs au-dessus de lui";

    return null;
};
