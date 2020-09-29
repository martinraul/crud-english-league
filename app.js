const express = require("express");
const bodyParser = require("body-parser");

const exphbs = require("express-handlebars");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const upload = multer({ dest: "./uploads/img" });

const app = express();
const hbs = exphbs.create();
const port = process.env.PORT || 3000;

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/uploads`));

const service = require("./services/storage.js");
const getTeams = service.getTeams;
const getSingleTeam = service.getSingleTeam;

app.get("/", (req, res) => {
  const teams = getTeams();

  res.render("home", {
    layout: "layout",
    teams,
  });
});

app.get("/viewteam/:id", (req, res) => {
  const team = getSingleTeam(req.params.id);

  res.render("team", {
    layout: "layout",
    team,
  });
});

app.get("/delete/:id", (req, res, next) => {
  const team = getSingleTeam(req.params.id);

  res.render("delete", {
    layout: "layout",
    team,
  });
});

app.post("/delete/:id", (req, res, next) => {
  const teams = getTeams();
  const team = getSingleTeam(req.params.id);

  teams.splice(
    teams.findIndex(function (i) {
      return i.id == req.params.id;
    }),
    1
  );

  fs.writeFileSync(`./data/teams.json`, JSON.stringify(teams), "utf-8");

  res.render("home", {
    layout: "layout",
    teams,
    deletedTeamMsg: "Team Deleted",
  });
});

app.get("/edit/:id", (req, res) => {
  const team = getSingleTeam(req.params.id);
  console.log(team.shortName);

  res.render("edit", {
    layout: "layout",
    team,
  });
});

app.post("/edit/:id", urlencodedParser, (req, res) => {
  const teams = getTeams();
  const team = getSingleTeam(req.params.id);

  const {
    name,
    shortName,
    address,
    phone,
    website,
    email,
    venue,
    tla,
    founded,
    clubColors,
  } = req.body;

  team.name = name;
  team.shortName = shortName;
  team.tla = tla;
  team.address = address;
  team.phone = phone;
  team.website = website;
  team.email = email;
  team.founded = founded;
  team.clubColors = clubColors;
  team.venue = venue;

  for (let i = 0; i < teams.length; i++) {
    if (Number(team.id) === Number(teams[i].id)) {
      teams.splice(i, 1, team);
    }
  }

  fs.writeFileSync(`./data/teams.json`, JSON.stringify(teams), "utf-8");
  res.redirect(`/viewteam/${req.params.id}`);
});

app.get("/create", (req, res) => {
  res.render("create", { layout: "layout" });
});

app.post("/create", upload.single("imagen"), (req, res) => {
  console.log(req.file);
  const teams = getTeams();

  const {
    name,
    shortName,
    address,
    phone,
    website,
    email,
    venue,
    tla,
    founded,
    clubColors,
  } = req.body;

  crestUrl = `/img/${req.file.filename}`;

  let newTeam = {
    name,
    shortName,
    address,
    phone,
    website,
    email,
    venue,
    founded,
    clubColors,
    tla,
    id: uuidv4(),
    crestUrl,
  };

  teams.unshift(newTeam);
  const updatedTeams = JSON.stringify(teams);
  const newTeamCard = JSON.stringify(newTeam);
  fs.writeFileSync("./data/teams.json", updatedTeams, "utf-8");
  fs.writeFileSync(`./data/teams/${tla}.json`, newTeamCard, "utf-8");

  res.redirect(`/viewteam/${tla}`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
