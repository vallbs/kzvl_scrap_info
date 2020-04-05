const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

export default class ProcessPlayers {
    constructor(fs, path, csv) {
        this.fs = fs;
        this.path = path;
        this.csv = csv;
        this.playersFilePath = '../files/div_1.csv';
    }

    process() {
        const filePath = this.path.join(__dirname, this.playersFilePath);
        const results = [];

        this.fs.createReadStream(filePath)
            .pipe(this.csv({ separator: ',' }))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                console.log(results);
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
                console.log(players);
            });
    }
}

