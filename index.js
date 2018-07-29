const path = require('path');
const fs = require('fs');

if(!fs.existsSync(path.join(__dirname, './data'))) {
    fs.mkdirSync(path.join(__dirname, './data'));
}

function getJsonData(pathToFile) {
    try {
        return JSON.parse(fs.readFileSync(path.join(__dirname, pathToFile)));
    }catch(e) {
        return undefined;
    }
}

function saveJsonData(pathToFile, data) {
    fs.writeFileSync(path.join(__dirname, pathToFile), JSON.stringify(data, null, "    "));
}

module.exports = function SkipCharacterSelect(dispatch) {	

    const delay = 10; // Probably not required but adding a longer delay might be a good idea?

    let settingsPath,
    enabled = false;
            
    dispatch.hook('S_LOGIN_ACCOUNT_INFO', 1, (event) => {
        settingsPath = `./data/${event.serverName}.json`;
        
        let data = getJsonData(settingsPath);
        if (data) {
            setTimeout(()=>{
                dispatch.toServer('C_SELECT_USER', 1, Object.assign({}, data));
            }, delay);
        }
        enabled = false;
    });
    
    dispatch.hook('C_SELECT_USER', 1, (event) => {
        saveJsonData(settingsPath, Object.assign({}, event));
    });
    
}
