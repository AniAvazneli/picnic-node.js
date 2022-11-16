import csv from "csv-parser";
import fs from "fs";
import express from "express";

const app = express();

app.get("/", (_, res) => {
  const results = [];
  const csvStatistic = { topCount: 0, topAnswer: "",  };
  fs.createReadStream("WhatsgoodlyData-10.csv")
    .pipe(csv({}))
    .on("data", function (data) {
      if (csvStatistic["topCount"] < parseFloat(data["Count"])) {
        csvStatistic["topCount"] = data["Count"];
        csvStatistic["topAnswer"] = data["Answer"];
      }
    })
    .on("end", () => {
      res.send(csvStatistic);
    });
});

app.listen(3000);
