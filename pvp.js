const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
process.on("message", async function (pseudo) {
    const pvpFD = new FormData();
    pvpFD.append('ranking_typ', 'pvp');
    pvpFD.append('search_highscore', pseudo);
    pvpFD.append('serverchoice', '1');
    const { data: pvpData } = await axios.post(`https://fr.nostale.gameforge.com/main/highscore`, pvpFD, { headers: { ...pvpFD.getHeaders() } });
    const $pvp = cheerio.load(pvpData);
    const clmtArene = $pvp('tr.rankfirst td.rank-td-2-1').text().trim() || $pvp('tr.rankfirst td.rank-td-1-1').text().trim();
    const kills = $pvp('tr.rankfirst td.rank-td-2-3').text().trim() || $pvp('tr.rankfirst td.rank-td-1-3').text().trim();
    const deads = $pvp('tr.rankfirst td.rank-td-2-4').text().trim() || $pvp('tr.rankfirst td.rank-td-1-4').text().trim();
    const ratioPvp = (kills / deads)
    process.send({ kills: kills, deads: deads, ratio: ratioPvp.toFixed(2), rang: clmtArene });
    process.exit()
});