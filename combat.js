const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
process.on("message", async function (pseudo) {
    const levelFD = new FormData();
    levelFD.append('ranking_typ', 'level');
    levelFD.append('search_highscore', pseudo);
    levelFD.append('serverchoice', '1');
    const { data: levelData } = await axios.post(`https://fr.nostale.gameforge.com/main/highscore`, levelFD, { headers: { ...levelFD.getHeaders() } });
    const $level = cheerio.load(levelData);
    const levelRank = $level('tr.rankfirst td.rank-td-1-1').text().trim() || $level('tr.rankfirst td.rank-td-2-1').text().trim();
    const level = $level('tr.rankfirst td.rank-td-1-3').text().trim() || $level('tr.rankfirst td.rank-td-2-3').text().trim();
    const lvlExperience = $level('tr.rankfirst td.rank-td-1-4').text().trim() || $level('tr.rankfirst td.rank-td-2-4').text().trim();
    const lastUpdate = $level('#highscoreTable .info_text').text().trim().split(' ').splice(3).join(' ');
    process.send({lvl: level, points: lvlExperience, rang: levelRank, last_update: lastUpdate});
    process.exit()
});