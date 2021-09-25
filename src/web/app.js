const express = require('express');
const https = require("https");
const path = require('path');
const cookieParser = require('cookie-parser');

const passport = require("passport");
const url = require("url");
const Strategy = require("passport-discord").Strategy;
const bodyParser = require("body-parser");
const Discord = require("discord.js");
const session = require("express-session");

const ejs = require("ejs");

const { readFileSync } = require("fs");

const app = express();
const MemoryStore = require("memorystore")(session);

module.exports = async (client, modules) => {
  const templateDir = path.resolve(`${process.cwd()}${path.sep}src${path.sep}web${path.sep}views`); 

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));
  
  passport.use(new Strategy({ 
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.DOMAIN}/callback`,
      scope: ["identify", "guilds"],
      prompt: 'consent'
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => done(null, profile));
  }));
  
  app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  let domain = process.env.DOMAIN
  let port = process.env.PORT

  app.locals.domain = domain.split("//")[1];

  app.engine("html", ejs.renderFile);
  app.set("view engine", "html");

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(express.static(__dirname + '/public'));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
      extended: true
  }));
  
  const renderTemplate = (res, req, template, data = {}) => {
    const baseData = {
      bot: client,
      path: req.path,
      user: req.isAuthenticated() ? req.user : null
    };
    res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
  };

  const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/login");
  }

  // * Login/Logout

  app.get("/login", (req, res, next) => {
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL; 
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = "/";
    }
    next();
  },
  passport.authenticate("discord"));
  
  app.get("/logout", function (req, res) {
    req.session.destroy(() => {
      req.logout();
      res.redirect("/");
    });
  });

  app.get("/", (req, res) => {
    renderTemplate(res, req, "index.ejs");
  });

  app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), (req, res) => {
    if (req.session.backURL) {
      const url = req.session.backURL;
      req.session.backURL = null;
      res.redirect(url);
    } else {
      res.redirect("/");
    }
  });

  app.get("/privacy", (req, res) => {
    renderTemplate(res, req, "privacy.ejs");
  });

  let commands = modules.modules;

  app.get("/commands", (req, res) => {
    renderTemplate(res, req, "commands.ejs", { commands });
  });

  app.get("/serverlist", checkAuth, (req, res) => {
    renderTemplate(res, req, "serverlist.ejs", { perms: Discord.Permissions });
  });

  // * Dashboard

  app.get("/dashboard", checkAuth, (req, res) => {
    renderTemplate(res, req, "dashboard.ejs", { perms: Discord.Permissions });
  });

  app.get("/dashboard/:guildID", checkAuth, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);

    if (!guild) return res.redirect("/serverlist");
    const member = guild.members.cache.get(req.user.id);
    if (!member) return res.redirect("/serverlist");
    if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/serverlist");
    
    let prefix = client.getGuildConfig().get(guild.id, "prefix");

    renderTemplate(res, req, "dashboard.ejs", { guild, prefix });
  });

  // app.post("/dashboard/:guildID", checkAuth, async (req, res) => {
  //     const guild = client.guilds.cache.get(req.params.guildID);

  //     if (!guild) return res.redirect("/serverlist");
  //     const member = guild.members.cache.get(req.user.id);
  //     if (!member) return res.redirect("/serverlist");
  //     if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/serverlist");

  //     let prefix = client.getGuildConfig().get(guild.id, "prefix");

  //     renderTemplate(res, req, "dashboard.ejs", { guild, prefix });
  // });

  // * Modules

  app.post('/dashboard/:guildID/prefix', (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/serverlist");
    const member = guild.members.cache.get(req.user.id);
    if (!member) return res.redirect("/serverlist");
    if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/serverlist");
    const prefix = req.body.prefix;

    client.getGuildConfig().set(guild.id, prefix, "prefix");

    res.redirect(req.get('referer'));
    res.end();
  });
  
  // * Redirects

  app.get("/discord", (req, res) => {
    res.status(301).redirect("https://discord.gg/9MHrwpf72U");
  });

  app.get("/invite", (req, res) => {
    res.status(301).redirect("https://discord.com/oauth2/authorize?client_id=791188742512967690&permissions=70577254&redirect_uri=https://discord.gg/9MHrwpf72U&scope=bot");
  });

  // * Error Handler

  app.get('*', function(req, res, next) {
    let err = new Error(`${req.ip} tried to reach ${req.originalUrl}`); 
    err.statusCode = 404;
    err.shouldRedirect = true; 
    next(err);
  });

  app.use(function(err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;

    if (err.shouldRedirect) {
      res.render(`${templateDir}/error.ejs`, { err: err });
    } else {
      res.status(err.statusCode).send(err.message);
    }
  });

  // * Shutdown Handler

  process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    process.exit(1);
  });

  // * Initialize the Dashboard

  app.listen(process.env.PORT, function() {
    console.log(`Dashboard is up and running!\n${process.env.DOMAIN}:${process.env.PORT}`);
  });
}
