const fs = require('fs-extra');

/**
 * 
 * @param {*} jobName 
 */
const setupDropFolder = jobName => {
    if (fs.existsSync('.cache')) {
        try {
            fs.removeSync('.cache');
        } catch (e) {
            console.log(e);
        }
    }
    fs.mkdirs(`.cache`);
};

/**
 * 
 * @param {*} options 
 * @param {*} name 
 */
const processScreenshots = (options, name, jobName) => {
    return Object.assign(options, {
        filename: `${name}.${options.type}`,
        path: `.cache/${name}.${options.type}`
    });
}


module.exports = {
    setupDropFolder,
    processScreenshots
    // zipOutput
}