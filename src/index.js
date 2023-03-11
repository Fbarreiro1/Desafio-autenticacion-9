const express = require('express')
const bodyParser = require('body-parser');
const router = require('./router')
const mongoose = require('mongoose')
const morgan = require('morgan')
const { db } = require('./config')
const { userDb, passDb } = db
const handlebars = require("express-handlebars")
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require('passport');
const initializePassport = require('./config/passport.config');



const app = express()


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine("handlebars", handlebars.engine())

app.set("views",__dirname+"/views")
app.set("view engine","handlebars")
app.use(express.static(__dirname+"/public"))

app.use(cookieParser("algo"));

app.use(session({
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://${userDb}:${passDb}@cluster0.c9r329l.mongodb.net/session?retryWrites=true&w=majority`,
    mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},


  }),
  secret: "secret0",
  resave: false,
  saveUninitialized: true
}))

app.use(morgan('dev'))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

router(app)

mongoose.set('strictQuery', false)
mongoose.connect(`mongodb+srv://${userDb}:${passDb}@cluster0.c9r329l.mongodb.net/ecommerce?retryWrites=true&w=majority`, error => {
  if (error) {
    console.log(`Cannot connect to db. Error ${error}`)
  }
  console.log('db connected')
})

module.exports = app