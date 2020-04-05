const express = require('express');
const app = express();
const ScrapGames = require('./utils/scrapGames');
const ScrapGamesInstance = new ScrapGames();

const gamesPageUrl = 'https://ukv.org.ua/index.php?option=com_joomleague&func=showPlan&mode=1&p=412&Itemid=4217';

ScrapGamesInstance.scrap(gamesPageUrl).then(tours => {
    console.log('then');
    console.log(tours);
});

const PORT = '3000';

app.listen(PORT, () => {
    console.log(`server runs on ${PORT} port`);
});
