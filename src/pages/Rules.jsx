export default function Rules() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Règles</h1>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Règles de la Ligue</h2>
                <ul className="list-disc pl-5 mt-2">
                    <li>
                        Match en 2 sets gagnants format short sets (premier à 4 jeux et tie-break à
                        4-4) avec super tie-break pour le 3ème.
                    </li>
                    <li>
                        Possibilité de faire des sets plus longs si les deux joueurs sont d'accord.
                    </li>
                    <li>
                        Le moins bien classé peut challenger un joueur mieux classé → Le joueur
                        mieux classé doit accepter ou avoir une bonne excuse.
                    </li>
                    <li>
                        On peut challenger quelqu’un qui est au maximum 2 positions au-dessus (ex:
                        4e vs 2e).
                    </li>
                    <li>
                        Si le moins bien classé gagne, les deux joueurs échangent leurs positions.
                    </li>
                    <li>
                        Après 2 défaites consécutives sans changer de classement, on perd une place
                        automatiquement.
                    </li>
                    <li>
                        On ne peut pas rejouer contre le même joueur sans que les deux joueurs aient
                        rencontré d'autres adversaires (encourage plus de matchups).
                    </li>
                    <li>
                        Tous les matchs doivent être annoncés sur le groupe ainsi que les scores,
                        avec mise à jour du classement.
                    </li>
                    <li>
                        Début des matchs le 19.08.24. Fin à décider, probablement vers mi-fin mars
                        avant les interclubs.
                    </li>
                    <li>
                        Une phase de playoffs peut être organisée pour les 4 meilleurs joueurs
                        actifs.
                    </li>
                    <li>Important: Tout trashtalk est vivement encouragé !</li>
                    <li>Bons matchs à tous !</li>
                </ul>
            </div>
        </div>
    );
}
