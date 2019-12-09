const csv = require("csv-parser");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const moment = require("moment");

const arr = [];
//change file name here
const inputFilename = process.argv[2] || "central_hudson.csv";
const outputFilename = process.argv[3] || "central_hudson.prn";

const csvWriter = createCsvWriter({
  path: outputFilename,
  header: [
    { id: "Name", title: "Name" },
    { id: "Time Stamp", title: "Time Stamp" },
    { id: "Time", title: "Time" },
    { id: "Interval", title: "Interval" },
    { id: "Unit", title: "Unit" },
    { id: "LBMP ($/MWHr)", title: "LBMP ($/MWHr)" }
  ]
});

//Reading csv file 
fs.createReadStream(inputFilename)
  .pipe(csv())
  .on("data", row => {
    arr.push(row);
  })
  .on("end", () => {
    processArray(arr);
  });

//Process file 
function processArray(arr) {
  var result = [];

  arr.forEach(row => {
    let pickedDate = moment(new Date(row["Time Stamp"]));
    let time = pickedDate.format("HHmm");
    let name = row["Name"];
    if (name == "HUD VL") {
      name = "HUD_VL";
    } else if (name == "MHK VL") {
      name = "MHK_VL";
    } else if (name == "O H") {
      name = "O_H";
    } else if (name == "H Q") {
      name = "H_Q";
    }
    row["Time Stamp"] = pickedDate.format("DDMMYY");

    row["Time"] = time;
    row["Name"] = "NYISO_DAYAHEAD_" + name;
    row["Unit"] = "kw";
    row["Interval"] = 60;
    delete row["Marginal Cost Congestion ($/MWHr)"];
    delete row["Marginal Cost Losses ($/MWHr)"];
    delete row["PTID"];
  });

  arr.forEach(row => {
    result.push({
      Name: row["Name"],
      "Time Stamp": row["Time Stamp"],
      Time: row["Time"],
      Interval: row["Interval"],
      Unit: row["Unit"],
      "LBMP ($/MWHr)": row["LBMP ($/MWHr)"]
    });
  });
  console.log(result.length+ " rows processed");

  //write to file
  csvWriter
    .writeRecords(result)
    .then(() => console.log("prn file "+ outputFilename + " successfully"));
}
