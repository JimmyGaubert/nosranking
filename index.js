const { fork } = require("child_process");
const express = require("express");
const helmet = require("helmet");
const app = express();
app.use(helmet());
app.all('*', async function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('X-Frame-Options', 'SAMEORIGIN');
    res.header('Content-Security-Policy', "default-src 'self'");
    next();
});
app.get('/', async (req, res) => {
    const pseudo = req?.query?.pseudo;
    if (!pseudo) return;
    const combat = fork("etc/combat.js");
    const reput = fork("etc/reputation.js");
    const hero = fork("etc/hero.js");
    const pvp = fork("etc/pvp.js");
    [combat, reput, hero, pvp].forEach(elem => { elem.send(pseudo) });
    let player_combat;
    let player_reput;
    let player_hero;
    let player_pvp;
    combat.on("message", async function (cbtObj) { player_combat = cbtObj });
    reput.on("message", async function (rptObj) { player_reput = rptObj; });
    hero.on("message", async function (hObj) { player_hero = hObj; });
    pvp.on("message", async function (pvpObj) { player_pvp = pvpObj });
    let inter = setInterval( async() => {
        if (player_combat && player_hero && player_reput && player_pvp) {
            res.json({
                pseudo,
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
app.listen(55556, '127.0.0.1');