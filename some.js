process.argv.forEach(element => {
   console.log(element)
});

const value = '4444.444';
const arr = {
    'Timestamp': '6/12/2019 14:45',
    'PEGSRVR.COGEN#Block Demand Real Power#kW': '4,064.47'
  }
const p = arr["PEGSRVR.COGEN#Block Demand Real Power#kW"].split(",");
const ne = p[0]+p[1];
console.log(ne);
console.log(parseFloat(p.toString()));
console.log(parseFloat(value));


