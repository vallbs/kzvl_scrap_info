const express = require('express');
const app = express();
const ScrapGames = require('./utils/scrapGames');
const ScrapGamesInstance = new ScrapGames();

const groupGamesMappings = [
    {
        seasonId: '2019-2020',
        division: 'div_2',
        title: 'Group_V',
        url: 'https://ukv.org.ua/index.php?option=com_joomleague&func=showPlan&mode=1&p=412&Itemid=4217',
        fileName: 'div_2.group_v.json'
    },
    {
        seasonId: '2019-2020',
        division: 'div_2',
        title: 'Group_G',
        url: 'https://ukv.org.ua/index.php?option=com_joomleague&func=showPlan&mode=1&p=413&Itemid=4219',
        fileName: 'div_2.group_g.json'
    }
]

const groupGamesPromises = groupGamesMappings.map(group => {
    return ScrapGamesInstance.scrap(group.url);
});

Promise.all(groupGamesPromises).then(results => {
    console.log('results');
    console.log(results);

    const writeToFIlePromises = results.map((group, index) => {

        // fllen group-games object
        // toursGames: tours.tour.games games for 1 group

        let groupGames = [];

        group.map(tour => {
            let tourGames = [];

            if (tour.games) {
                tourGames = tour.games.map(game => {
                    return {
                        ...game,
                        divisionId: groupGamesMappings[index].division,
                        groupId: groupGamesMappings[index].title,
                        tourId: tour.title,
                        tourPeriod: tour.period
                    }
                });

                groupGames = [...groupGames, ...tourGames];
            }
        });

        return ScrapGamesInstance.writeToFile(groupGamesMappings[index].fileName, groupGames);
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
