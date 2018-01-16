

var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");


// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var request = require("request");
var cheerio = require("cheerio");
var path = require("path");
// Require all models
var db = require("./model");

const PORT = process.env.PORT || 3000;


// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// Routes

//scraping data and putting in database
app.get("/scrape", function(req, res) {
  request("http://www.echojs.com/", function(error, response, html) {
//
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);

    // An empty array to save the data that we'll scrape
    var results = [];

    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works
    $("article h2").each(function(i, element) {

      var link = $(element).children().attr("href");
      var title = $(element).children().text();
      results.push({
                  title: title,
                  link: link
                });
    });
    // Log the results once you've looped through each of the elements found with cheerio
    res.send(results);
  });

});


app.get("/savedArticles", function(req, res) {
  // Grab every document in the Articles collection
  res.sendFile(path.join(__dirname, "./public/save.html"));
});

app.get("/", function(req, res) {
  // Grab every document in the Articles collection
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article
    .find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// // Route for saving/updating an Article's associated Note
app.post("/articles", function(req, res) {
  // Create a new note and pass the req.body to the entry

  db.Article
          .create(req.body)
          .then(function(dbArticle) {
            // If we were able to successfully scrape and save an Article, send a message to the client
              res.send(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
  // Save these results in an object that we'll push into the results array we defined earlier
});


app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry

  db.Note
          .create(req.body)
          .then(function(dbNote) {
            // If we were able to successfully scrape and save an Article, send a message to the client
               res.send(dbNote);
               return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
             })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
  // Save these results in an object that we'll push into the results array we defined earlier
});

app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.delete("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article
    .findOne({ _id: req.params.id })
    .then(function(dbArticle) {
      db.Note
      .remove({_id: dbArticle.note}).then(function(dbNote){
        db.Article
          .remove({ _id: req.params.id })

        .then(function(dbArticle) {
          // If we were able to successfully find an Article with the given id, send it back to the client
          res.send(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
      });
    });
});


app.delete("/notes/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article
    .findOne({ _id: req.params.id })
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      db.Note.remove({ _id: dbArticle.note })
      .then(function(dbNote) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.send(dbNote);
      })
      .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  });
});
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});


//
