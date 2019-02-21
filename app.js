const express = require("express");
const app = express();
const router = express.Router();
const bp = require("body-parser");
const PORT = 8080;
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
let arr = [];
let totalScore = 0;
const oPASS = { success: true };
const oFAIL = { success: false };

app.get("/", (req, res) => {
  res.send(
    "<h1>Buzz Word Bingo</h1> <p>A vintage game where a total number of points are won when the contestant says certain words which have different preassigned values.</p>"
  );

  // res.render("/public/index.html");
});
app
  .route("/buzzwords")
  .get((req, res) => {
    const arrBW = arr.map(x => x.buzzWord);
    res.json({ buzzWords: arrBW });
  })
  .post((req, res) => {
    if (arr.length >= 5) {
      res.json(oFAIL);
    } else {
      if (arr.map(x => x.buzzWord).indexOf(req.body.buzzWord) === -1) {
        // add the word
        arr.push(req.body);
        res.json(oPASS);
      } else {
        res.json(oFAIL);
      }
      console.log("status: ", arr);
    }
  })
  .put((req, res) => {
    if (arr.map(x => x.buzzWord).indexOf(req.body.buzzWord) > -1) {
      // update the word count by removing and re-adding obj
      arr = arr.filter(x => x.buzzWord !== req.body.buzzWord);
      arr.push(req.body);
      // arr[req.body.buzzWord] = req.body.points;
      res.json(oPASS);
    } else {
      res.json(oFAIL);
    }
    console.log("status: ", arr);
  })
  .delete((req, res) => {
    if (arr.map(x => x.buzzWord).indexOf(req.body.buzzWord) > -1) {
      // remove the word
      arr = arr.filter(x => x.buzzWord !== req.body.buzzWord);
    } else {
      res.json(oFAIL);
    }
    console.log("status: ", arr);
  });

app.post("/reset", function(req, res) {
  arr = [];
  totalScore = 0;
  res.json(oPASS);
  console.log("status: ", arr);
});

/*
app.post("/heard", function(req, res) {
  if (arr.map(x => x.buzzWord).indexOf(req.body.buzzWord) > -1) {
    // update the word count
    const objToUpdate = arr.filter(x => x.buzzWord === req.body.buzzWord).pop();
    arr = arr.filter(x => x.buzzWord !== req.body.buzzWord);

    // objToUpdate.points += req.body.points;
    objToUpdate.points++;
    arr.push(objToUpdate);
    const oRtn = { totalScore: objToUpdate.points };
    res.json(oRtn);
  } else {
    res.json(oFAIL);
  }
  console.log("status: ", arr);
});
*/
app.post("/heard", function(req, res) {
  if (arr.map(x => x.buzzWord).indexOf(req.body.buzzWord) > -1) {
    // Found the word
    const objWord = arr.filter(x => x.buzzWord === req.body.buzzWord).pop();
    totalScore += objWord.points;

    const oRtn = { totalScore: totalScore };
    res.json(oRtn);
  } else {
    res.json(oFAIL);
  }
  console.log("status: ", arr);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});
