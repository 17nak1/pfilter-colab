
const fs = require("fs");
const csv = require('csvtojson')

const process = require("process");
const snippet = require("./modelSnippet");
const mathLib = require('./library/mathLib');

/** Main program entry point */
async function start(workerFn) {
 
  require('dcp-client').initSync(process.argv);
  const compute = require('dcp/compute');
  const wallet = require('dcp/wallet');
  const dcpCli = require('dcp/cli');
  const identityKeystore = await dcpCli.getIdentityKeystore();
  wallet.addId(identityKeystore);
  const accountKeystore = await dcpCli.getAccountKeystore();

  let dataCases = [];
  let dataCasesTimes = [];
  let dataCovar = [];
  let dataCovarTimes = [];
  let currentParams = []; 
  let temp, file;
  let data;
  file = fs.readFileSync('./samples/London_covar.csv').toString();
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

  //* 2nd data set
  file = fs.readFileSync('./samples/London_BiData.csv').toString()
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

  //* 3nd data set and names
  file = fs.readFileSync('./samples/initial_parameters.csv').toString()
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
      currentParams.push(data)
    }
  }
  
   
  const pompData = {
    data :  dataCases,
    times:  dataCasesTimes,
    t0: 1940,
    rprocessDetail:  { type:"euler_sim", deltaT: 1/365.25 },
    covar: dataCovar,
    tcovar: dataCovarTimes,
    zeronames: snippet.zeronames,
    statenames: snippet.statenames,
    paramnames: [...snippet.paramsMod, ...snippet.paramsIc]
  };
  
  let numberOfParticles = 10;

  let dataPfilter = [{
    object: pompData,
    Np: numberOfParticles,
    filterMean: true,
    saveStates: true,
    maxFail: 3000,
    replicate: 1
  }];

  console.log("Deploying job...");
  let job = compute.for(currentParams, workerFn, dataPfilter);
  
  job.on('console', (msg) => console.log("Got console event:", msg));
  job.on('uncaughtException', (error) => console.error(error));

  job.on('accepted', () => {
    console.log("Job accepted");
  });

  job.on('status', (status) => {
    console.log("Got a status update:", status);
  });
  
  job.on('result', (ev) => console.log("Got a result:", ev.result.loglik));
  job.on('complete', async function() {
    await job.results.fetch();
    let result = job.results.values();
    console.log("On complete", result[0].loglik);
  });
  
  const resultHandle = await job.exec(compute.marketValue, accountKeystore);
  let pf = Array.from(resultHandle);

  let allLogliks  =[];
  for (let i = 0; i < pf.length; i++) {
    allLogliks.push(pf[i].loglik)
  }
  let loglik = mathLib.logMeanExp(allLogliks);

  // console.log('Best set of parameters is : ', Object.assign(pf[0].params,{loglik: loglik}));
  pf = pf[0];

  let headerStates = [];
  for (let i = 0; i < Object.keys(pf.filterMean[0]).length; i++) {
    headerStates.push({id: Object.keys(pf.filterMean[0])[i], title: Object.keys(pf.filterMean[0])[i]})
  }
  
  const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  const csvWriterFilter = createCsvWriter({
    path: `./results/filterMean.csv`,
    header: headerStates
  });
  csvWriterFilter.writeRecords(pf.filterMean);

  pf = pf.saveStates;
  
  let states = [];
  for(let j = 0; j < numberOfParticles; j ++) {
    states = [];
    for (let j = 0; j < numberOfParticles; j++) {
      for (let i = 0; i < pf.length; i++) {
          states.push(pf[i][j])
      }

      const csvStates = createCsvWriter({          /* Log the saved states */
        path: `./results/savedStates${j}.csv`,
        header: headerStates
      });

      csvStates.writeRecords(states); 
    }
  }       
}

(async function run(){
  let workerBundle = fs.readFileSync('./pfilter/www/js/worker-bundle.js', 'utf8');
  const workerFn = `(async (...args) => {
    ${workerBundle}
    return await self.workerfn(...args);
  })`;

  await start(workerFn);
})();

