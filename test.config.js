
const screenshots = filename => ({
  enabled: true,
  fullPage: true,
  width: 1600
})

module.exports = {
  urls: [
    // {
    //   id: 'google1',
    //   url: "https://www.google.com",
    //   screenshots: screenshots(),
    // },
    {
      id: 'google',
      url: "https://google.com",
      screenshots: screenshots()
    }
  ],
  budget: {
    assets: {
      js: 200,
      css: 100
    },
    timeline: {
      ttfb: 1000,
      tti: 1000,
      response: 1000
    }
  }
}