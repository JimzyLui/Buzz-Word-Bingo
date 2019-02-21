const express = require("express");
const app = express();
const router = express.Router();
const bp = require("body-parser");
const PORT = 8080;
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
let arr = [];
const oPASS = { success: true };
const oFAIL = { success: false };

app.get("/", (req, res) => {
  res.render("/public/index.html");
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
  res.json(oPASS);
  console.log("status: ", arr);
});

app.post("/heard", function(req, res) {
  if (arr.map(x => x.buzzWord).indexOf(req.body.buzzWord) > -1) {
    // update the word count
    const objToUpdate = arr.filter(x => x.buzzWord === req.body.buzzWord).pop();
    arr = arr.filter(x => x.buzzWord !== req.body.buzzWord);

    objToUpdate.points += req.body.points;
    arr.push(objToUpdate);
    res.json(oPASS);
  } else {
    res.json(oFAIL);
  }
  console.log("status: ", arr);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});
