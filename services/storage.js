const fs = require("fs");

function getTeams() {
  const jsonTeams = fs.readFileSync("./data/teams.json", "utf-8");
  const teams = JSON.parse(jsonTeams);
  return teams;
}

function getSingleTeam(teamId) {
  const teams = getTeams()
  let chosenTeam;
  for (let i = 0; i < teams.length; i++) {
    if (Number(teams[i].id) === Number(teamId)) {
      chosenTeam = teams[i];
    }
  }
  return chosenTeam;
}

module.exports = {
  getTeams,
  getSingleTeam,
};
