# auto-perf-budget
Profile your web application automatically using headless chrome to ensure performance budgets are met.


```
const screenshots = filename => ({
  enabled: true,
  fullPage: true,
  width: 1600
})

module.exports = {
  urls: [
    {
      id: 'tradera',
      url: "http://www.tradera.com/",
      screenshots: screenshots(),
    },
    {
      id: 'google',
      url: "https://google.com",
      screenshots: screenshots()
    },
    {
      id: 'facebook',
      url: "https://facebook.com",
      screenshots: screenshots()
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
}```