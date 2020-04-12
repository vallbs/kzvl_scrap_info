const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

class ScrapGames {
    constructor(pageUrl) {
        // this.pageUrl = pageUrl;
        this.filesRootPath = '../files';
    }

    scrap(pageUrl) {
        const thisClass = this;
        const options = {
            uri: pageUrl,
            rejectUnauthorized: false,
            insecure: true,
            transform: function (body) {
                return cheerio.load(body);
            }
        }
        return rp(options).then($ => {  
            const matchdayTable = $('.matchdaytitle').next();
            const titles = $('.matchdaytitle .contentheading');
            const tours = [];

            titles.each((index, element) => {
                const rows = $(matchdayTable[index]).find('tr');
                const gamesArr = [];

                rows.each((index, element) => {
                    const el = $(element);
                    const elClass = el.attr('class');

                    // get date el - it is a header
                    if (elClass === 'sectiontableheader') {
                        

                        // the next element is a row about game info
                        const gameInfoEl = $(el.next());

                        const game = thisClass.getGameInfo(gameInfoEl);
                        const dateSplitted = el.text().split(". ");
                        game.date = new Date(dateSplitted[2], parseInt(dateSplitted[1]) - 1, dateSplitted[0]);

                        gamesArr.push(game);
                    }
                });

                const el = $(element);
                const tourTitle = el.find('a').text();
                const tourPeriod = el.text().trim();

                const tour = {
                    title: tourTitle,
                    period: tourPeriod,
                    games: gamesArr
                };

                tours.push(tour);

                // console.log(tourTitle + ': ' + tourPeriod);
            });

            // console.log(tours);
            console.log('end');

            return tours;
        });
    }

    getGameInfo(gameInfoEl) {
        if (!gameInfoEl) {
            return {};
        }

        const game = {};

        game.stadium = gameInfoEl.find('td:nth-child(2)').text().trim();
        game.time = gameInfoEl.find('td:nth-child(3)').text().trim();
        game.homeTeam = gameInfoEl.find('td:nth-child(5)').text().trim();
        game.guestTeam = gameInfoEl.find('td:nth-child(8)').text().trim();
        game.homeTeamScore = gameInfoEl.find('td:nth-child(9)').text().trim();

        const guestTeamScore = gameInfoEl.find('td:nth-child(11)').text().trim();
        const guestTeamScoreSplitted = guestTeamScore.split('(');
        
        const scores = guestTeamScoreSplitted[2].split('-');
        scores[scores.length-1] = scores[scores.length-1].replace(')', '');

        game.guestTeamScore = guestTeamScoreSplitted[0].trim();
        game.scoreBySets = scores;

        return game;
    }

    writeToFile(fileName, gamesPayload) {
        const filePath = path.join(__dirname, `${this.filesRootPath}/${fileName}`);

        const jsonContent = JSON.stringify(gamesPayload);

        return fs.writeFile(filePath, jsonContent, 'utf8', err => {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
         
            console.log("JSON file has been saved.");

            return true;
        });
    }
}

const test = 'test';

module.exports = ScrapGames;