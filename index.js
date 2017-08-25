#!/usr/bin/env node
const exit = require('exit');
const config = require('./src/configs');
const Helpers = require('./src/helpers');
const Stats = require('./src/stats');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');

const App = () => {

    const jobName = `auto-perf-${Date.now()}`;
    
    // Setup drop folder for any assets;
    Helpers.setupDropFolder(jobName);

    this.data = {
        results: {}
    };

    /**
     * 
     * @param {*} browser 
     * @param {*} item 
     * @param {*} name 
     */
    const LoadPage = async (browser, item, name) => {

        if (!item.url) {
            console.log(`No url found on ${item}`)
        }

        let page = await browser.newPage()

        if (item.emulate) {
            const vp = await page.emulate(item.emulate)
        }

        await page.goto(item.url)

        if (item.screenshots) {
            console.log(`Taking screenshot: ${name}`);
            if (item.viewport) {
                await page.setViewport(item.viewport);
            }
            const sc = await page.screenshot(
                Helpers.processScreenshots(item.screenshots, name, jobName)
            )
        }

        return await Stats.get(page, name);
    };

    const responseData = {};

    puppeteer
        .launch({
            headless: config.headless ? config.headless : false
        })
        .then(async browser => {

            for (let item of config.urls) {
                const name = `${item.id}-${Date.now()}`
                const results = await LoadPage(browser, item, name);
                responseData[name] = {
                    results,
                    item
                };
            }

            browser.close();

        })

        .then(() => Stats.report(responseData))

        .catch(error => {
            console.log(error);
            exit(1)
        })
}
module.exports = App()
