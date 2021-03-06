var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var mongoose = require("mongoose");

var { Mongoose } = require("./untils/config.js");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var shoppingRouter = require("./routes/shopping");

// var downloadImageToServerRouterAndController = require("./fetchDataAndDownloadImage/downloadImageToServerRouterAndController");
var generateDataRouterAndController = require("./fetchDataAndDownloadImage/generateDataRouterAndController");

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(
//   session({
//     secret: "fn%$%afho07",
//     name: "sessionId",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24 * 7,
//     },
//   })
// );
Mongoose.connect();
app.use(cookieParser());
app.use(
  session({
    secret:"fn%$%afho07",
    saveUninitialized : true,
    resave: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      autoRemove: "interval",
      autoRemoveInterval: 60 * 24 * 7,
      secret: "fhuiqeg15yf24jtn1oi4tyo",
    }),
  })
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api2/users", usersRouter);
app.use("/api2/shopping", shoppingRouter);

// app.use(
//   "/api2/downloadImageToServer",
//   downloadImageToServerRouterAndController
// );
app.use("/api2/generateData", generateDataRouterAndController);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
