var fs = require("fs");

const readFile = function (filePath) {
  
  let currentParams = [];
  let temp, file;
  let data;
  
  file = fs.readFileSync(filePath).toString()
  lines = file.split(/\r\n|\n/);
  let currentParams_name = lines[0].replace(/['"]+/g, '').split(',');
  for (let i = 1; i < lines.length ; i++) {
    temp = lines[i].split(',');
    if(temp.length > 1) {
      temp = temp.map(x => Number(x));
      data = {};
      for(let j = 0; j < temp.length; j++){
        data[currentParams_name[j]] = temp[j];
      }
      currentParams.push(data);
    }
  }
  return currentParams;
}

module.exports = readFile;