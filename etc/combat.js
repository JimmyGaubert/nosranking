const cheerio = require('cheerio');
const fetch = require('node-fetch');
process.on("message", async function (pseudo) {
    const params = new URLSearchParams();
    params.append('ranking_typ', 'level');
    params.append('search_highscore', pseudo);
    params.append('serverchoice', '1');
    const response = await fetch("https://fr.nostale.gameforge.com/main/highscore", { method: "POST", body: params })
    const $level = cheerio.load(await response.text());
    const levelRank = $level('tr.rankfirst td.rank-td-1-1').text().trim() || $level('tr.rankfirst td.rank-td-2-1').text().trim();
    const level = $level('tr.rankfirst td.rank-td-1-3').text().trim() || $level('tr.rankfirst td.rank-td-2-3').text().trim();
    const lvlExperience = $level('tr.rankfirst td.rank-td-1-4').text().trim() || $level('tr.rankfirst td.rank-td-2-4').text().trim();
    const lastUpdate = $level('#highscoreTable .info_text').text().match(/\d.+/)?.[0];
    process.send({ lvl: level, points: lvlExperience, rang: levelRank, last_update: lastUpdate });
    process.exit()
});