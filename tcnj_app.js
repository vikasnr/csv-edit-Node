const csv = require("csv-parser");
const fs = require("fs");
const moment = require("moment");
const arr = [];
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const inputFilename = process.argv[2] || "tcnj.csv";
const outputFilename = process.argv[3] || "tcnj.prn";

//writer config
const csvWriter = createCsvWriter({
  path: outputFilename,
  header: [
    { id: "Name", title: "Name" },
    { id: "Time Stamp", title: "Time Stamp" },
    { id: "Time", title: "Time" },
    { id: "Interval", title: "Interval" },
    { id: "Unit", title: "Unit" },
    {
      id: "Power",
      title: "Power"
    },
    { id: "x", title: "x" },
    { id: "y", title: "y" },
    { id: "z", title: "z" }
  ]
});

//Read the file
fs.createReadStream(inputFilename)
  .pipe(csv())
  .on("data", row => {
    arr.push(row);
  })
  .on("end", () => {
    processArray(arr);
  });

//process the file
function processArray(arr) {
  let result = [];
  arr.forEach(row => {});
  arr.forEach(row => {
    let date = moment(new Date(row["Timestamp"]));
    let time = date.format("HHmm");
    let name = "tcnj_COGEN_kw"; //manually input name of the meter here

    row["Time Stamp"] = date.format("MMDDYY");
    row["Time"] = time;
    row["Name"] = name;
    row["Unit"] = "kw";
    row["Interval"] = 15;

    //remove comma 4,688.50 = 4688.50
    let splitArr = row["PEGSRVR.COGEN#Block Demand Real Power#kW"].split(",");
    let fullPowerValue = splitArr[0]+splitArr[1];

    row["Power"] = parseFloat(fullPowerValue);
    //  console.log(typeof row["Power"])
  });
  arr.forEach(row => {
    result.push({
      Name: row["Name"],
      "Time Stamp": row["Time Stamp"],
      Time: row["Time"],
      Interval: row["Interval"],
      Unit: row["Unit"],
      Power: row["Power"],
      x: 0,
      y: 0,
      z: 0
    });
  });
  console.log(result.length+ " rows processed");

  //write to file
  csvWriter
    .writeRecords(result)
    .then(() => console.log("PRN file "+ outputFilename + " successfully"));
}
