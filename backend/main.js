import csv from "csv-parser";
import fs from "fs";
import express from "express";

const app = express();

app.get("/", (_, res) => {
  const csvStatistic = {
    MostPopular: { topCount: 0, topAnswer: "" },
    Female: {},
    University: { Instagram: 0, Facebook: 0, Linkedin: 0 },
  };
  fs.createReadStream("WhatsgoodlyData-10.csv")
    .pipe(csv({}))
    .on("data", function (data) {
      if (csvStatistic["MostPopular"]["topCount"] < parseFloat(data["Count"])) {
        csvStatistic["MostPopular"]["topCount"] = data["Count"];
        csvStatistic["MostPopular"]["topAnswer"] = data["Answer"];
      }
      if (data["Segment Description"] === "Female respondents") {
        csvStatistic["Female"][data["Answer"]] = data["Count"];
      }
      if (data["Segment Type"] === "University") {
        if (data["Answer"] === "Instagram") {
          csvStatistic["University"]["Instagram"] += parseFloat(data["Count"]);
        }
        if (data["Answer"] === "Facebook") {
          csvStatistic["University"]["Facebook"] += parseFloat(data["Count"]);
        }
        if (data["Answer"] === "Linkedin") {
          csvStatistic["University"]["Linkedin"] += parseFloat(data["Count"]);
        }
      }
    })
    .on("end", () => {
      res.send(`<div>
      <h1 style="margin-top: 50px">
        The most popular answer is : ${csvStatistic["MostPopular"]["topAnswer"]} and is't count is ${csvStatistic["MostPopular"]["topCount"]}. 
      </h1>
      <h1 style="margin-top: 100px" >With female respondents most popular is Snapchat and least one is Linkedin</h1>
      <canvas id="PicnicBoard"></canvas>
      <h1 style="margin-top: 100px" >In the segment type of University Linkedin score was much less then Facebook and Instagram </h1>
      <div style="position: relative; width: 50vw; height: 50wh; margin-top: 50px" >
        <canvas id="UniversityP"></canvas>
      </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <script>
      const ctx = document.getElementById("PicnicBoard");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Instagram", "Facebook",  "Linkedin", "Snapchat"],
          datasets: [
            {
              label: "# Female respondents",
              data: [${csvStatistic["Female"]["Instagram"]}, ${csvStatistic["Female"]["Facebook"]}, ${csvStatistic["Female"]["Linkedin"]}, ${csvStatistic["Female"]["Snapchat"]}],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      const universities =  document.getElementById("UniversityP");
      
      new Chart(universities, {
        type: 'doughnut',
        data: {
          labels: [
            'Instagram',
            'Facebook',
            'Linkedin'
          ],
          datasets: [{
            label: 'University',
            data: [${csvStatistic["University"]["Instagram"]}, ${csvStatistic["University"]["Facebook"]}, ${csvStatistic["University"]["Linkedin"]}],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
          }]
      }
      });
    </script>
    ` );

    // res.send(csvStatistic)
    });
});

app.listen(3000);
