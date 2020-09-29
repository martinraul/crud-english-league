const fs = require("fs");

function getTeams() {
  const jsonTeams = fs.readFileSync("./data/teams.json", "utf-8");
  const teams = JSON.parse(jsonTeams);
  return teams;
}

function getSingleTeam(id) {
  const teams = getTeams()
  let chosenTeam;
  for (let i = 0; i < teams.length; i++) {
    if (Number(teams[i].id) === Number(id)) {
      chosenTeam = teams[i];
    }
  }
  return chosenTeam;
}

function SaveTeams(teams){
  fs.writeFileSync(`./data/teams.json`, JSON.stringify(teams), "utf-8");
}

module.exports = {
  getTeams,
  getSingleTeam,
  saveTeams,
};
