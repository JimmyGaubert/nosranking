const fetch = require('node-fetch');
const cheerio = require('cheerio');
process.on("message", async function (pseudo) {
    const params = new URLSearchParams();
    params.append('ranking_typ', 'fame');
    params.append('search_highscore', pseudo);
    params.append('serverchoice', '1');
    const response = await fetch("https://fr.nostale.gameforge.com/main/highscore", { method: "POST", body: params })
    const $fame = cheerio.load(await response.text());
    const fameRank = $fame('tr.rankfirst td.rank-td-2-1').text().trim() || $fame('tr.rankfirst td.rank-td-1-1').text().trim();
    const fame = $fame('tr.rankfirst td.rank-td-2-3').text().trim() || $fame('tr.rankfirst td.rank-td-1-3').text().trim();
    let reputation;
    if (fame > 1 && fame < 250) { reputation = "Débutant" }
    else if (fameRank === 3) { reputation = "Héros Ancien" }
    else if (fameRank === 2) { reputation = "Héros Mystérieux" }
    else if (fameRank === 1) { reputation = "Héros Légendaire" }
    else if (fameRank >= 14 && fameRank <= 43) { reputation = "Légende" }
    else if (fameRank >= 4 && fameRank <= 13) { reputation = "Légende" }
    else if (fame >= 251 && fame <= 500) { reputation = "Apprenti Vert" }
    else if (fame >= 501 && fame <= 750) { reputation = "Apprenti Bleu" }
    else if (fame >= 751 && fame <= 1000) { reputation = "Apprenti Rouge" }
    else if (fame >= 1001 && fame <= 2500) { reputation = "Experts Vert" }
    else if (fame >= 2501 && fame <= 3500) { reputation = "Experts Bleu" }
    else if (fame >= 3501 && fame <= 5000) { reputation = "Experts Rouge" }
    else if (fame >= 5001 && fame <= 9500) { reputation = "Soldat de bataille Vert" }
    else if (fame >= 9501 && fame <= 19500) { reputation = "Soldat de bataille Bleu" }
    else if (fame >= 19501 && fame <= 25000) { reputation = "Soldat de bataille Rouge" }
    else if (fame >= 25001 && fame <= 40000) { reputation = "Expert Vert" }
    else if (fame >= 40001 && fame <= 60000) { reputation = "Expert Bleu" }
    else if (fame >= 60001 && fame <= 85000) { reputation = "Expert Rouge" }
    else if (fame >= 85001 && fame <= 115000) { reputation = "Chef Vert" }
    else if (fame >= 115001 && fame <= 150000) { reputation = "Chef Bleu" }
    else if (fame >= 150001 && fame <= 190000) { reputation = "Chef Rouge" }
    else if (fame >= 190001 && fame <= 235000) { reputation = "Maître Vert" }
    else if (fame >= 235001 && fame <= 285000) { reputation = "Maître Bleu" }
    else if (fame >= 285001 && fame <= 350000) { reputation = "Maître Rouge" }
    else if (fame >= 350001 && fame <= 500000) { reputation = "Nos Vert" }
    else if (fame >= 500001 && fame <= 1500000) { reputation = "Nos Bleu" }
    else if (fame >= 1500001 && fame <= 2500000) { reputation = "Nos Rouge" }
    else if (fame >= 2500001 && fame <= 3750000) { reputation = "Elite Vert" }
    else if (fame >= 3750001 && fame <= 5000000) { reputation = "Elite Bleu" }
    else if (fame >= 5000001 && fame <= 250000000) { reputation = "Elite Rouge" }
    process.send({lvl: reputation, points: fame, rang: fameRank});
    process.exit()
});
