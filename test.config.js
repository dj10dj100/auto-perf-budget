
const screenshots = filename => ({
  enabled: true,
  fullPage: false,
  type: 'jpeg',
  quality: 80
})

const viewport = () => ({
  width: 480,
  height: 800,
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: false,
  isLandscape: false
})

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