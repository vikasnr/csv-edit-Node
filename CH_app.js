const csv = require("csv-parser");
const fs = require("fs");
const moment = require("moment");
const arr = [];
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const filename = "central_hudson.csv"//change file name here
const csvWriter = createCsvWriter({
  path: "central_hudson.prn",
  header: [
    { id: "Name", title: "Name" },
    { id: "Time Stamp", title: "Time Stamp" },
    { id: "Time", title: "Time" },
    { id: "Interval", title: "Interval" },
    { id: "Unit", title: "Unit" },
    { id: "LBMP ($/MWHr)", title: "LBMP ($/MWHr)" }
  ]
});
fs.createReadStream(filename)
  .pipe(csv())
  .on("data", row => {
    var date = moment(row["Time Stamp"]);
    console.log(date.format('hhmm'))
    arr.push(row);
  })
  .on("end", () => {
    process(arr);
  });

function process(arr) {
  var result = [];
  arr.forEach(row => {
    var pickedDate = moment(new Date(row["Time Stamp"]));
    const time = pickedDate.format('HHmm')
    var name = row["Name"];
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
  });
  arr.forEach(row => {
    row["Unit"] = "kw";
    row["Interval"] = 60;
    delete row["Marginal Cost Congestion ($/MWHr)"];
    delete row["Marginal Cost Losses ($/MWHr)"];
    delete row["PTID"];
  });
  arr.forEach(row => {
    result.push({
      "Name": row["Name"],
      "Time Stamp": row["Time Stamp"],
      "Time": row["Time"],
      "Interval": row["Interval"],
      "Unit": row["Unit"],
      "LBMP ($/MWHr)": row["LBMP ($/MWHr)"]
    });
  });
  console.log(result);

  csvWriter
    .writeRecords(result)
    .then(() => console.log("The CSV file was written successfully"));
}
