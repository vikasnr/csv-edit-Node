const csv = require("csv-parser");
const fs = require("fs");
const moment = require("moment");
const arr = [];
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: "tcnj.prn",
  header: [
    { id: "Name", title: "Name" },
    { id: "Time Stamp", title: "Time Stamp" },
    { id: "Time", title: "Time" },
    { id: "Interval", title: "Interval" },
    { id: "Unit", title: "Unit" },
    {
      id: "PEGSRVR.COGEN#Block Demand Real Power#kW",
      title: "PEGSRVR.COGEN#Block Demand Real Power#kW"
    },
    { id: "x", title: "x" },
    { id: "y", title: "y" },
    { id: "z", title: "z" }
  ]
});
fs.createReadStream("tcnj.csv")
  .pipe(csv())
  .on("data", row => {
    arr.push(row);
  })
  .on("end", () => {
    process(arr);
  });

function process(arr) {
  var result = [];
  arr.forEach(row => {
    var date = moment(new Date(row["Timestamp"]));
    const time = date.format("HHmm");
    var name = "tcnj_COGEN_kw"; //manually input name of the meter here
    row["Time Stamp"] = date.format("MMDDYY");

    row["Time"] = time;
    row["Name"] = name;
  });
  arr.forEach(row => {
    row["Unit"] = "kw";
    row["Interval"] = 15; //change interval here
  });
  arr.forEach(row => {
    result.push({
      Name: row["Name"],
      "Time Stamp": row["Time Stamp"],
      Time: row["Time"],
      Interval: row["Interval"],
      Unit: row["Unit"],
      "PEGSRVR.COGEN#Block Demand Real Power#kW":
        row["PEGSRVR.COGEN#Block Demand Real Power#kW"],
      x: 0,
      y: 0,
      z: 0
    });
  });
  //   console.log(result);

  //   const fastcsv = require("fast-csv");
  //   const ws = fs.createWriteStream("out.csv");
  //   fastcsv.write(result, { headers: true }).pipe(ws);

  csvWriter
    .writeRecords(result)
    .then(() => console.log("The CSV file was written successfully"));
  //   console.log(arr);
}
 