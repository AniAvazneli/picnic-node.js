import csv from "csv-parser";
import fs from "fs";
import express from "express";

const app = express();

app.get("/", (_, res) => {
  const results = [];
  fs.createReadStream("WhatsgoodlyData-10.csv")
    .pipe(csv({}))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.send(results);
    });
});

app.listen(3000);
