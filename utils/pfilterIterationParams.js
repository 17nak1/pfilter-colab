var fs = require("fs");

const pfilterIterationParams = function (iter, file) {
  
  let currentParams = [];
  let params =[];
  let temp, file;
  let data;
  
  file = fs.readFileSync(file).toString()
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
  for (let i = 0; i < iter; i++) {
    params.push(...currentParams);
  }
  return params;
}

module.exports = pfilterIterationParams;