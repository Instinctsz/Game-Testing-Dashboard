const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require('fs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/getdata", (request, response) => {
  let key = request.query.key;
  console.log(key);

  const data = require("./data");

  if (data[key]) response.json(data[key]);
  else response.end("Geen valid key");
});

app.post("/senddata", (req, res) => {
  const data = require("./data");

  let key = req.query.key;
  console.log(key);
  console.log(req.body);

  let newData = data;
  
  if (!newData[key])
    newData[key] = {};
  
  for (const level in req.body) {
    if (newData[key]["level" + level]) {
      if (newData[key]["level" + level][req.body[level]]) 
        newData[key]["level" + level][req.body[level]]++;
      else
        newData[key]["level" + level][req.body[level]] = 1;
    }
      
    else {
      newData[key]["level" + level] = {};
      newData[key]["level" + level][req.body[level]] = 1;
    }
  }
  
  
  fs.writeFileSync('./data.json', JSON.stringify(newData));
  
  const test = fs.readFileSync('./data.json');

  res.end();
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
