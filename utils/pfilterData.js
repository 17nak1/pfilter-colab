var fs = require("fs");

const pfilterData = function (covarFile, dataFile) {
  let dataCases = [];
  let dataCasesTimes = [];
  let dataCovar = [];
  let dataCovarTimes = [];
  let currentParams = []; 
  let temp, file;
  let data;
  file = fs.readFileSync(covarFile).toString();
  let lines = file.split(/\r\n|\n/);
  let dataCovar_name = lines[0].replace(/['"]+/g, '').split(',');
  dataCovar_name.shift();
  for (let i = 1; i < lines.length ; i++) {
    temp = lines[i].split(',');
    if(temp.length > 1) {
      temp = temp.map(x => Number(x));
      dataCovarTimes.push(temp[0]);
      data = {};
      for(let j = 0; j < temp.length - 1; j++){
        data[dataCovar_name[j]] = temp[j + 1];
      }
      dataCovar.push(data)
    }
  }

  
  file = fs.readFileSync(dataFile).toString()
  lines = file.split(/\r\n|\n/);
  let dataCases_name = lines[0].replace(/['"]+/g, '').split(',');
  dataCases_name.shift();
  for (let i = 1; i < lines.length ; i++) {
    temp = lines[i].split(',');
    if(temp.length > 1) {
      temp = temp.map(x => Number(x));
      dataCasesTimes.push(temp[0]);
      data = {};
      for(let j = 0; j < temp.length - 1; j++){
        data[dataCases_name[j]] = temp[j + 1];
      }
      dataCases.push(data)
    }
  }

  return {dataCovar: dataCovar, dataCases: dataCases, dataCasesTimes: dataCasesTimes, dataCovarTimes: dataCovarTimes}
}

module.exports = pfilterData;