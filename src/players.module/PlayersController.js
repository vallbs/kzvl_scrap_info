const ProcessPlayersService = require('./services/ProcessPlayersService');
const filesMapping = [
    {
        division: 1,
        csvFileName: 'players_div_1.csv',
        jsFileName: 'players_div_1.js'
    },
    {
        division: 2,
        csvFileName: 'players_div_2.csv',
        jsFileName: 'players_div_2.js'
    },
    {
        division: 3,
        csvFileName: 'players_div_3.csv',
        jsFileName: 'players_div_3.js'
    },
    {
        division: 4,
        csvFileName: 'players_div_4.csv',
        jsFileName: 'players_div_4.js'
    },
];

// only for 2nd division
// const division_2 = filesMapping.filter(file => file.division === 2);
// const ProcessPlayersServiceInstance = new ProcessPlayersService(division_2.csvFileName, division_2.jsFileName);


class PlayersController {
    constructor() { 
        this.ProcessPlayersServiceInstance =  new ProcessPlayersService();
    }

    transformFromCsvToJSFile() {
        // only for 2nd division
        const division_2 = filesMapping.filter(file => file.division === 2);
        // const ProcessPlayersServiceInstance = 
        //     new ProcessPlayersService(division_2[0].csvFileName, division_2[0].jsFileName);

        this.ProcessPlayersServiceInstance.fromCsvToArray(division_2[0].csvFileName)
            .then(players => {
                console.log('players: ', players);

                return this.ProcessPlayersServiceInstance.writeArrayToJSFile(players, division_2[0].jsFileName);
            })
            .then(res => {
                console.log('res:', res);
            })
            .catch(err => {
                console.log('err: ', err);
            });
    }
}

module.exports = PlayersController;
