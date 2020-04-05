const express = require('express');
const app = express();
const ScrapGames = require('./utils/scrapGames');
const ScrapGamesInstance = new ScrapGames();

const gamesPageUrl = 'https://ukv.org.ua/index.php?option=com_joomleague&func=showPlan&mode=1&p=412&Itemid=4217';

const groupGames = [
    {
        division: 'div_2',
        title: 'Group_B',
        url: 'https://ukv.org.ua/index.php?option=com_joomleague&func=showPlan&mode=1&p=412&Itemid=4217',
        fileName: 'div_2.group_b.json'
    },
    {
        division: 'div_2',
        title: 'Group_G',
        url: 'https://ukv.org.ua/index.php?option=com_joomleague&func=showPlan&mode=1&p=413&Itemid=4219',
        fileName: 'div_2.group_g.json'
    }
]

const groupGamesPromises = groupGames.map(group => {
    return ScrapGamesInstance.scrap(group.url);
});

Promise.all(groupGamesPromises).then(results => {
    console.log('results');
    console.log(results);

    const writeToFIlePromises = results.map((groups, index) => {
        return ScrapGamesInstance.writeToFile(groupGames[index].fileName, groups);
    });

    return Promise.all(writeToFIlePromises);
})
.then(res => {
    console.log('res');
    console.log('has written to all files');
});

const PORT = '3000';

app.listen(PORT, () => {
    console.log(`server runs on ${PORT} port`);
});
