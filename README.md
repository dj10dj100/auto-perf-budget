# auto-perf-budget
Profile your web application automatically using headless chrome to ensure performance budgets are met.

Measuring performance is hard, so this app is designed to automate checking if certain performance criteria are met. Can be run locally with HTML report or as command line interface. 

Auto-perf-budget opens specified URL's and checks against *your* defined performance budget values. 

Auto performance budget will report an error if your budget is exceeded.

### How to use:
Run the app using this command:
```
  auto-perf-budget --config test.config.js
```
argument config must be populated.
```
--config <config-location>
```
### Config;
See example (test.config.js):

```
const screenshots = filename => ({
  enabled: true,
  fullPage: false,
  type: 'jpeg',
  quality: 80
}); 
```
Extends the default values found in Chrome puppeteer
[see screenshot here](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions)
```
const viewport = () => ({
  width: 1600,
  height: 2500,
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false,
  isLandscape: true
}); 
```
Extends the default values found in Chrome puppeteer
[see viewport here](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageviewport)
```
module.exports = {
  urls: [
    {
      id: 'crc',
      url: "https://chainreactioncycles.com",
      screenshots: screenshots(),
      viewport: viewport()
    },
    {
      id: 'ebay',
      url: "https://ebay.com",
      screenshots: screenshots(),
      viewport: viewport()
    }
  ],
  report: 'html',
  budget: {
    level: 'error',
    assets: {
      js: 200,//kb
      css: 100//kb
    },
    timeline: {
      pageComplete: 350,//ms
      responseTime: 100,//ms
      domComplete: 500,//ms
      dns: 100,
      ttfb: 1000,//ms
      tti: 1000//ms
    }
  }
}
```
Declare how you want the report to run:
```
report: 'html' || 'cli'
````
`Html`: will open a html file with a report of each page and it's results.

`Cli`: will show the results in the command line, an error will throw an exit code.

### Setting performance budget
Uses the chrome timeline dev tool data, this object can be set to check the values you want to benchmark against:
```
  timeline: {
    pageComplete: 350, //ms
    responseTime: 100, //ms
    domComplete: 500, //ms
    dns: 100, //ms
    ttfb: 1000, //ms
    tti: 1000 //ms
  }
```

Potential use-cases:
- Automating screenshots of website;
- Automate checking speed of website;
- Cache warming of multiple pages;
- Run after release to ensure pages work as expected.

### Output

Below is an example of output from cli:
|Measurement|Value|Budget|%|Status|
|--- |--- |--- |--- |--- |
|pageComplete|1096ms|350ms|313%|Error - ❌|
|responseTime|547ms|100ms|547%|Error - ❌|
|domComplete|818ms|500ms|163%|Error - ❌|
|dns|0ms|100ms|0%|OK - ✅|
|ttfb|263ms|1000ms|26%|OK - ✅|
|tti|539ms|1000ms|53%|OK - ✅|
