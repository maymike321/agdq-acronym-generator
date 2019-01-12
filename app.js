const express = require("express");
const generateAcronym = require('./AdgqAcronymGenerator').generateAcronym;

const app = express();

app.use(express.static('app'));

app.get('/generateAcronym', async (req, res, next) => {
  const {a, g, d, q} = req.query;
  res.json(await generateAcronym({a, g, d, q}));
});

app.listen(process.env.PORT || 8080);
