
let  createCsvWriter = require('csv-writer').createObjectCsvWriter;

const saveFile = function(name, data) {
  let headerStates = [];
  let dataLength = 1;
  let header = Object.keys(data[0]);
  let temp2 = [];
  let temp = [];
  if (Array.isArray(data[0])) {
    dataLength = data[0].length;
    header = Object.keys(data[0][0]);
    for (let j = 0; j < data[0].length; j++) {
      temp = [];
      for (let i = 0; i < data.length; i++) {
        temp.push(data[i][j]);
      }
      temp2.push(temp)
    }
    data = temp2;
    
  }

  for (let i = 0; i < header.length; i++) {
    headerStates.push({id: header[i], title: header[i]})
  }

  for (let k = 0; k < dataLength; k++) {
    const csvWriterFilter = createCsvWriter({
      path: `./${name}${k}.csv`,
      header: headerStates
    });
    csvWriterFilter.writeRecords(data[k]);
  }
  
}

module.exports = saveFile;
