// find all players who were in start
// filter players array, show only those which has player.status = 'start'
// https://studio3t.com/knowledge-base/articles/filter-elements-from-mongodb-arrays/
// https://kb.objectrocket.com/mongo-db/filter-mongodb-array-elements-1184

db.getCollection("games_players").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {
			    "homeTeam": "TS"
			}
		},

		// Stage 2
		{
			$project: { 
			    "homeTeam": 1, 
			    "players": { 
			        $filter: { 
			            input: "$players", 
			            as: "players", 
			            cond: { 
			                $eq: ["$$players.status", "start"]
			            }
			        }
			    } 
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
