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
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/uploads`));
app.use(express.static(`${__dirname}/uploads`));

app.get("/", (req, res) => {
  const jsonTeams = fs.readFileSync("./data/teams.json", "utf-8");
  const teams = JSON.parse(jsonTeams);
  res.render("home", {
    layout: "layout",
    teams,
  });
});

app.get("/viewteam/:tla", (req, res) => {
  const jsonSingleTeam = fs.readFileSync(
    `./data/teams/${req.param("tla")}.json`,
    "utf-8"
  );
  const team = JSON.parse(jsonSingleTeam);
  res.render("team", {
    layout: "layout",
    team,
  });
});

app.get("/delete/:id", (req, res, next) => {
  let jsonTeams = fs.readFileSync(`./data/teams.json`, "utf-8");
  let teams = JSON.parse(jsonTeams);
  
  teams.splice(
    teams.findIndex(function (i) {
      return i.id == req.params.id;
    }),1);
  let updatedTeams = JSON.stringify(teams);

  fs.writeFileSync(`./data/teams.json`, updatedTeams, "utf-8");
  //res.redirect("/");
  res.render("home", {
    layout: "layout",
    teams,
    deletedTeamMsg:"Team Deleted",
  });
});

app.get("/edit/:tla", (req, res) => {
  const jsonTeams = fs.readFileSync(
    `./data/teams/${req.param("tla")}.json`,
    "utf-8"
  );
  const team = JSON.parse(jsonTeams);
  res.render("edit", {
    layout: "layout",
    team,
  });
});

app.post("/edit/:tla", (req, res) => {
  const jsonSingleTeam = fs.readFileSync(
    `./data/teams/${req.param("tla")}.json`,
    "utf-8"
  );

  //this update single team card
  const team = JSON.parse(jsonSingleTeam);
  const {
    name, shortName, address, phone, website,
    email,venue,tla, founded,clubColors,} = req.body;

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

  console.log(team);
  let updatedTeam = JSON.stringify(team);
  fs.writeFileSync(`./data/teams/${req.param("tla")}.json`,updatedTeam,"utf-8");
  res.redirect(`/viewteam/${req.param("tla")}`);
});

app.get("/create", (req, res) => {
  res.render("create", {layout: "layout", });
});

app.post("/create", upload.single("imagen"), (req, res) => {
  console.log(req.file);
  const jsonTeams = fs.readFileSync(`./data/teams.json`, "utf-8");
  const teams = JSON.parse(jsonTeams);

  // let pic= req.file
  const {
    name,shortName,address,phone,website,email,venue,tla,
    founded,clubColors,} = req.body;
    
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
