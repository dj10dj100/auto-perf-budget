const config = require('./configs');
const Table = require('cli-table');
const fs = require('fs-extra');
const opn = require('opn');
const exit = require('exit');
/**
 * 
 * @param {*} page 
 * @param {*} name 
 */
const get = async (page, name) => {

    const perf = await page.evaluate(() => performance.toJSON());

    let perfData = await perf.timing;

    let stats = {

        //page load
        pageComplete: perfData.loadEventEnd - perfData.navigationStart,

        //responseTime
        responseTime: perfData.responseEnd - perfData.requestStart,

        //page render time
        domComplete: perfData.domComplete - perfData.domLoading,

        //dns lookup
        dns: perfData.domainLookupEnd - perfData.domainLookupStart,

        //time to first byte
        ttfb: perfData.responseStart - perfData.navigationStart,

        //time to interactive
        tti: perfData.domInteractive - perfData.domLoading

    }

    // console.log(pageStats);
    // pageStats.performanceEntries = await page.evaluate(() => {
    //   return JSON.stringify(performance.getEntries());
    // });

    return await {
        stats,
        perf
    };
};

const generatePageSection = (page, rows, headings) => {
    const buildRows = () => {
        return `
            ${rows.map(r =>
                `<tr>
                        ${r.map(td => `<td>${td}</td>`).join('')}
                </tr>`
            ).join('')}
        `
    };
    const buildHeading = () => {
        return `
        <tr>
           ${headings.map(h => `<th>${h}</th>`).join('')}
        </tr>
        `
    }

    return `
        <section class="panel panel-default">
            <div class="panel-heading text-center">
                <h1>
                ${page.item.id} 
                    <small>
                        <a href="${page.item.url}">${page.item.url}</a>
                    </small>
                </h1>                
            </div>    
            <div class="panel-body">
                <a href="${page.item.screenshots.filename}" target="_blank" />
                    <img src="${page.item.screenshots.filename}" class="img-responsive img-thumbnail center-block"/>
                </a>
                <br/> <br/>
                <table class="table table-bordered table-striped">
                ${buildHeading()}
                ${buildRows()}
                </table>
            </div>
        </section>
    `;
};

/**
 * TODO - use a real template engine
 * @param {*} sections 
 */
const generateCompleteReport = sections => {
    const page = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
                </head>
                <body>
                    <div class="container">
                        <div class="row">
                        ${sections}
                        </div>
                    </div>
                </body>
            </html>`;

    fs.writeFile('.cache/index.html', page, () => {
        opn('.cache/index.html', { wait: false });
    })
};




const report = responseData => {

    const timeline = config.budget.timeline;
    const headings = ['Measurement', 'Value', 'Budget', '%', 'Status'];
    const htmlSections = [];
    const errors = [];

    Object.keys(responseData).map(x => {
        // instantiate
        let table = new Table({
            head: headings,
            chars: {
                'top': '==', 'top-mid': '', 'top-left': '', 'top-right': ''
                , 'bottom': '==', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': ''
                , 'left': '', 'left-mid': '', 'mid': '', 'mid-mid': ''
                , 'right': '...', 'right-mid': '', 'middle': ' '
            }
        });


        const page = responseData[x];
        let pageStatus = true;
        let pageRows = [];

        for (let stat in page.results.stats) {
            let error = false;
            if (!timeline[stat]) {
                console.log(`Value not found in timeline data ${stat}`);
            }

            let percentage;
            let status = 'error';

            if (page.results.stats[stat] < timeline[stat]) {
                percentage = `${Math.floor((page.results.stats[stat] / timeline[stat]) * 100)}%`;
                status = 'OK - ✅';
            } else {
                percentage = `${Math.floor((page.results.stats[stat] / timeline[stat]) * 100)}%`;
                status = 'Error - ❌';
                error = true;
                pageStatus = false;
            }

            /** Generate Row */
            let row = [
                stat,
                `${page.results.stats[stat]}ms`,
                `${timeline[stat]}ms`,
                percentage,
                status
            ];

            if (error === true) {
                let errorRow = {
                    id: page.item.id,
                    row: row
                }
                errors.push(errorRow);
            }

            if (config.report === 'cli') {
                table.push(row);
            };

            if (config.report === 'html') {
                pageRows.push(row);
            };
        }

        if (config.report === 'html') {
            htmlSections.push(generatePageSection(page, pageRows, headings));
        };

        if (config.report === 'cli') {
            console.log(`ID:${page.item.id}\nURL:${page.item.url}`);
            console.log(table.toString());
            console.log('===========================\n');
        };

    });

    if (config.report === 'cli' && errors) {
        let errorTable = new Table({
            head: ['ID', 'Measurement', 'Value', 'Budget', '%',],
            chars: {
                'top': '==', 'top-mid': '', 'top-left': '', 'top-right': ''
                , 'bottom': '==', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': ''
                , 'left': '', 'left-mid': '', 'mid': '', 'mid-mid': ''
                , 'right': '...', 'right-mid': '', 'middle': ' '
            }
        });

        Object.keys(errors).map(error => {
            let err = errors[error];
            err.row.unshift(err.id);
            err.row.pop();
            errorTable.push(err.row)
        });

        console.error(`Errors found {${errors.length}}:`);
        console.error(errorTable.toString());
        exit(1);
    };

    if (config.report === 'html') {

        if (config.cli === 'html') {
            Object.keys(errors).map(error => {
                let err = errors[error];
                err.row.unshift(err.id);
                err.row.pop();
                errorTable.push(err.row)
            });
        }

        generateCompleteReport(htmlSections.join(''));
    }
}

module.exports = {
    get,
    report
}