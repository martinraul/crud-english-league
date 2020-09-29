const express = require("express");
const bodyParser = require("body-parser");

const exphbs = require("express-handlebars");
const fs = require("fs");

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
const saveTeams = service.saveTeams;


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

  teams.splice(
    teams.findIndex(function (i) {
      return i.id == req.params.id;
    }),
    1
  );

    saveTeams(teams)

  res.render("home", {
    layout: "layout",
    teams,
    deletedTeamMsg: "Team Deleted",
  });
});

app.get("/edit/:id", (req, res) => {
  const team = getSingleTeam(req.params.id);

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
  saveTeams(teams)
 

  res.redirect(`/viewteam/${req.params.id}`);
});

app.get("/create", (req, res) => {
  res.render("create", { layout: "layout" });
});

app.post("/create", upload.single("imagen"), (req, res) => {
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
    id: 40,
    area: {
      id: 40,
      name: req.body.country
    },
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
    crestUrl,
  };

  teams.push(newTeam);
saveTeams(teams)

  res.redirect(`/`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
