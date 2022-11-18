const db = require('../config/connection');
const { Team, League, Player, Lineup } = require('../models');

const leagueSortedSeeds = require('./sorted.json');

db.once('open', async () => {
  try {
    
    // Clear previous db data
    await League.deleteMany({});
    await Team.deleteMany({});
    await Lineup.deleteMany({});
    await Player.deleteMany({});

    // Populate db models begins here:
    const leagueDoc = await League.create(
      {
        "id": '84532749',
        "teams": []
      }
    )

    // For each team...
    for (let iTeam = 0; iTeam < leagueSortedSeeds.length; iTeam++){
      let team = leagueSortedSeeds[iTeam];
      
      // Create the Team document in the db and push its _id to a leagueDoc
      let teamDoc = await Team.create({
        "name": team.name,
        "id": team.id,
        "startingLineups": [],
        "optimalLineups": [],
        "totalActual": team.totalActual,
        "totalOptimal": team.totalOptimal,
        "totalDeficit": team.totalDeficit,
        "perfectWeeks": team.perfectWeeks
      });
      leagueDoc.teams.push(teamDoc._id);

      // For each team's weekly lineup index...
      for (let iLineups = 0; iLineups < team.rawLineups.length; iLineups++){
        let week = iLineups + 1;

        // -------- ACTUAL LINEUP --------
        let actualLineup = team.actualLineups[iLineups];
        let actualFPTS = Math.round(getTotal(actualLineup)*100)/100;
        // Create the Player docs
        let actPlayerDocIds = [];
        for (let actualPlayer in actualLineup) {
          let actPlayerDoc = await Player.create(actualLineup[actualPlayer]);
          actPlayerDocIds.push(actPlayerDoc._id);
        }
        // Create the "actualLineupDoc"
        let actualLineupDoc = await Lineup.create(
          {
            "week": week,
            "players": actPlayerDocIds,
            "totalFPTS": actualFPTS
          }
        );
        // Push "actualLineupDoc" to a teamDoc's actualLineups key
        teamDoc.startingLineups.push(actualLineupDoc);
        
        // -------- OPTIMAL LINEUP --------
        let optimalLineup = team.optimalLineups[iLineups];
        let optimalFPTS = Math.round(getTotal(optimalLineup)*100)/100;
        // Create the Player docs
        let optPlayerDocIds = [];
        for (let optimalPlayer in optimalLineup) {
          let optPlayerDoc = await Player.create(optimalLineup[optimalPlayer]);
          optPlayerDocIds.push(optPlayerDoc._id);
        }
        // Create the "optimalLineupDoc"
        let optimalLineupDoc = await Lineup.create(
          {
            "week": week,
            "players": optPlayerDocIds,
            "totalFPTS": optimalFPTS
          }
        );
        // Push "optimalLineupDoc" to a teamDoc's optimalLineups key
        teamDoc.optimalLineups.push(optimalLineupDoc);        
      }
    }

    console.log('all done!');
    process.exit(0);
  } catch (err) {
    throw err;
  }
});

function getTotal(startingLineup) {
  
  let total = 0.00;
  for (let player in startingLineup) {

    let FPTS = parseFloat(startingLineup[player].FPTS);
    let FPTSDecimals = Math.round(FPTS * 100)/100;
    total += FPTSDecimals; 
  }
  return total;
}