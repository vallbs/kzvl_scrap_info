const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

class ProcessPlayersService {
    constructor(csvFileName, jsFileName) {
        this.fs = fs;
        this.path = path;
        this.csv = csv;
        // this.csvFileName = csvFileName;
        // this.jsFileName = jsFileName;
        // this.players = [];
    }

    fromCsvToArray(csvFileName) {
        const filePath = this.path.join(__dirname, '..', 'files', csvFileName);
        const results = [];

        return new Promise((resolve, reject) => {
            this.fs.createReadStream(filePath)
                .pipe(this.csv({ separator: ',' }))
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    let index = 0;
                    const photoSrc = 'Photo-src';
                    const achievementsSrc = 'Sport-achievements-src';
                    const teamName = 'team-name';

                    const players = results.map(player => { 
                        index++;
                        let birthDate = player.Birth;

                        if (birthDate) {
                            let ar = birthDate.split(' ');
                            delete ar[3];
                            birthDate = ar.join('');
                        }

                        return { 
                            id: index, 
                            fullName: player.player_list,
                            birthDate,
                            amplua: player.Amplua,
                            height: player.Height ? player.Height.replace(' cm', '') : '',
                            weight: player.Weight ? player.Weight.replace(' kg', '') : '',
                            photoSource: player[photoSrc],
                            achievementsSource: player[achievementsSrc],
                            teamName: player[teamName] ? player[teamName].replace('Команда ', '') : ''
                        };
                    });

                    resolve(players);
                });
        });
        
    }

    writeArrayToJSFile(players, jsFileName) {
        const filePath = this.path.join(__dirname, '..', 'files', jsFileName);
        const content = JSON.stringify(players);

        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, content, 'utf8', function (err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    reject(err);
                }
            
                console.log("JSON file has been saved.");

                resolve(true);
            })
        });
    }
}

module.exports = ProcessPlayersService;

