const fetch = require('node-fetch');
const cheerio = require('cheerio');
process.on("message", async function (pseudo) {
    const params = new URLSearchParams();
    params.append('ranking_typ', 'pvp');
    params.append('search_highscore', pseudo);
    params.append('serverchoice', '1');
    const response = await fetch("https://fr.nostale.gameforge.com/main/highscore", { method: "POST", body: params })
    const $pvp = cheerio.load(await response.text());
    const clmtArene = $pvp('tr.rankfirst td.rank-td-2-1').text().trim() || $pvp('tr.rankfirst td.rank-td-1-1').text().trim();
    const kills = $pvp('tr.rankfirst td.rank-td-2-3').text().trim() || $pvp('tr.rankfirst td.rank-td-1-3').text().trim();
    const deads = $pvp('tr.rankfirst td.rank-td-2-4').text().trim() || $pvp('tr.rankfirst td.rank-td-1-4').text().trim();
    const ratioPvp = (kills / deads)
    process.send({ kills: kills, deads: deads, ratio: ratioPvp.toFixed(2), rang: clmtArene });
    process.exit()
});