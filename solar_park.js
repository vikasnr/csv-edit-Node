const moment = require("moment");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
//change file name here
const outputFilename = process.argv[2];
let initial_date = process.argv[3];
let new_date = moment(initial_date, "DDMMYYYY")
  .add(1, "days")
  .format("DDMMYYYY");

const csvWriter = createCsvWriter({
  path: outputFilename,
  header: [
    { id: "Name", title: "Name" },
    { id: "Timestamp", title: "Timestamp" },
    { id: "Time", title: "Time" },
    { id: "Interval", title: "Interval" },
    { id: "KW", title: "KW" }
  ]
});

var arr = [];

let hour = moment(new_date, "HHmm").format("HHmm");
console.log(hour);
for (j = 0; j < 30; j++) {
  for (k = 0; k < 24; k++) {
    const obj = {
      Name: "SMYRNASOLAR",
      Timestamp: new_date,
      Time: hour,
      Interval: 60,
      KW: "kw"
    };
    arr.push(obj);
    hour = moment(hour, "HH")
      .add(1, "hours")
      .format("HHmm");
  }

  new_date = moment(new_date, "DDMMYYYY")
    .add(1, "days")
    .format("DDMMYYYY");
}

// for (i = 0; i < ; i++) {
//   const obj = { Name: "SMYRNASOLAR", Timestamp: new_date };
//   new_date = moment(new_date, "DDMMYYYY")
//     .add(1, "days")
//     .format("DDMMYYYY");
//   arr.push(obj);
// }
console.log(arr);

//write to file
csvWriter
  .writeRecords(arr)
  .then(() => console.log("PRN file " + outputFilename + " successfully"));
