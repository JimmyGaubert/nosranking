const fetch = require('node-fetch');
const cheerio = require('cheerio');
process.on("message", async function (pseudo) {
    const params = new URLSearchParams();
    params.append('ranking_typ', 'champion');
    params.append('search_highscore', pseudo);
    params.append('serverchoice', '1');
    const response = await fetch("https://fr.nostale.gameforge.com/main/highscore", { method: "POST", body: params })
    const $champ = cheerio.load(await response.text());
    const heroRank = $champ('tr.rankfirst td.rank-td-2-1').text().trim() || $champ('tr.rankfirst td.rank-td-1-1').text().trim();
    const heroLevel = $champ('tr.rankfirst td.rank-td-2-3').text().trim() || $champ('tr.rankfirst td.rank-td-1-3').text().trim();
    const heroExperience = $champ('tr.rankfirst td.rank-td-1-4').text().trim() || $champ('tr.rankfirst td.rank-td-2-4').text().trim();
    process.send({lvl: heroLevel, points: heroExperience, rang: heroRank});
    process.exit()
});