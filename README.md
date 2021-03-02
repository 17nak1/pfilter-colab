
# Particle Filter using DCP
## Introduction
This package includes a major functions from R package `pomp` (package for statistical inference on partially observed Markov processes).
A pfilter (https://kingaa.github.io/short-course/pfilter/pfilter.html) is a plain vanilla sequential Monte Carlo (particle filter) algorithm. Particle filtering uses a set of particles (also called samples) to represent the posterior distribution of some stochastic process given noisy and/or partial observations. The state-space model can be nonlinear and the initial state and noise distributions can take any form required.


##  input data
The first step is to provide `covar.csv` and `data.csv` in the samples folder. They are both time series and if some values are not provided, can be consider as **NaN** in `data.csv`.

The model also needs to be provided with `initial parameters` inculding 
```
R0,amplitude,gamma,mu,sigma,rho,psi,S_0,E_0,I_0,R_0
``` 

## Installation & Requirements
Install the dependencies with `npm install`. 

## Running the application
Now you are able to start the model and deploy a new set by

```
node pfilterOnNode.js
```

By default, the model works on the [KDS Distributed Computer](https://portal.distributed.computer/) and uses the keystore located in `~/.dcp/default.keystore`.

the final results includes different distributions saved as `savedstates.csv` and also the mean values of all distributions `filterMean.csv` in the results folder.

`epi-fit.js`  also returns one more CSV file (savedStates.csv) that will be used later as an input in the forward model.