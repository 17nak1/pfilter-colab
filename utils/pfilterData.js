var fs = require("fs");

const pfilterData = function (filePath) {
  let mainData = [];
  let mainDataTimes = [];
   
  let temp, file;
  let data;
  file = fs.readFileSync(filePath).toString();
  let lines = file.split(/\r\n|\n/);
  let mainData_name = lines[0].replace(/['"]+/g, '').split(',');
  mainData_name.shift();
  for (let i = 1; i < lines.length ; i++) {
    temp = lines[i].split(',');
    if(temp.length > 1) {
      temp = temp.map(x => Number(x));
      mainDataTimes.push(temp[0]);
      data = {};
      for(let j = 0; j < temp.length - 1; j++){
        data[mainData_name[j]] = temp[j + 1];
      }
      mainData.push(data)
    }
  }

  return [mainData, mainDataTimes]
}

module.exports = pfilterData;