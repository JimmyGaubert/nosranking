const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
process.on("message", async function (pseudo) {
    const champFD = new FormData();
    champFD.append('ranking_typ', 'champion');
    champFD.append('search_highscore', pseudo);
    champFD.append('serverchoice', '1');
    const { data: champData } = await axios.post(`https://fr.nostale.gameforge.com/main/highscore`, champFD, { headers: { ...champFD.getHeaders() } });
    const $champ = cheerio.load(champData);
    const heroRank = $champ('tr.rankfirst td.rank-td-2-1').text().trim() || $champ('tr.rankfirst td.rank-td-1-1').text().trim();
    const heroLevel = $champ('tr.rankfirst td.rank-td-2-3').text().trim() || $champ('tr.rankfirst td.rank-td-1-3').text().trim();
    const heroExperience = $champ('tr.rankfirst td.rank-td-1-4').text().trim() || $champ('tr.rankfirst td.rank-td-2-4').text().trim();
    process.send({lvl: heroLevel, points: heroExperience, rang: heroRank});
    process.exit()
});