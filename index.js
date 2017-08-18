const exit = require('exit');
const config = require('./src/configs');
const puppeteer = require('puppeteer');




const App = () => {

    let RESPONSE_DATA = {

    };


    const processScreenshots = (options, name) => {
        let opts = options;
        return Object.assign(options, { path: `drop-folder/${options.path ? `${options.path}` : `${name}.png`}` })
    };

    const utilizePage = async (browser, item, name) => {
        let page = await browser.newPage();

        if (item.emulate) {
            const vp = await page.emulate(item.emulate);
        }
        await page.goto(item.url);

        if (item.screenshots) {
            const sc = await page.screenshot(processScreenshots(item.screenshots, name));
        }
        return await page.evaluate(() => {
            //performance.getEntries()
            return JSON.stringify(performance);
        });
    };


    puppeteer.launch({
        headless: false
    }).then(
        async browser => {
            let performanceResults = {}
            for (let item of config.urls) {
                const name = `${item.id}-${Date.now()}`
                const value = await utilizePage(browser, item, name);
                performanceResults[name] = value;
            }

            console.log(performanceResults);
            browser.close();
        }
        ).catch(
        error => {
            console.log(error);
            exit(1)
        });
}
module.exports = App();





