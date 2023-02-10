const express = require("express");
const helmet = require("helmet");
const app = express();
app.use(helmet());
const { fork } = require("child_process");
app.all('*', async function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('X-Frame-Options', 'SAMEORIGIN');
    next();
});
app.get('/', async (req, res) => {
    let pseudo = req?.query?.pseudo
    let x = 0;
    const reput = fork("reputation.js");
    reput.send(pseudo)
    let player_reput;
    reput.on("message", async function (rpt) { player_reput = rpt; x++ });
    const combat = fork("combat.js");
    combat.send(pseudo)
    let player_combat;
    combat.on("message", async function (cbt) { player_combat = cbt ; x++ });
    const hero = fork("hero.js");
    hero.send(pseudo)
    let player_hero;
    hero.on("message", async function (h) { player_hero = h ; x++ });
    const pvp = fork("pvp.js");
    pvp.send(pseudo)
    let player_pvp;
    pvp.on("message", async function (pvpObj) { player_pvp = pvpObj; x++ });
    let inter = setInterval( async() => {
        if (x === 4) {
            res.json({
                pseudo: pseudo,
                last_update: player_combat.last_update,
                combat: {lvl: player_combat.lvl, points: player_combat.points, rang: player_combat.rang},
                hero : player_hero,
                reputation : player_reput,
                pvp : player_pvp
            })
            clearInterval(inter)
        }
    }, 1);
});
app.listen(55555, '127.0.0.1');