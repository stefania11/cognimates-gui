const formatMessage = require('format-message');


const language_codes = {
    German: 'de',
    Spanish: 'es',
    French: 'fr'
};

toLower = function (dict) {
    const new_dict = {};
    for (const key in dict) {
        new_dict[key.toLowerCase()] = dict[key];
    }
    return new_dict;
};

reformat = function (arr) {
    const trans = {};
    for (row in arr) {
        const lang = language_codes[arr[row].Language.trim()];
        console.log(arr[row].Language);
        trans[lang] = toLower(arr[row]);
    }
    console.log(trans);
    return trans;
};

Get = function () {
    url = 'https://sheetsu.com/apis/v1.0su/2749ada2e00e';
    const request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send();
    const trans = JSON.parse(request.responseText);
    return trans;
};

const allTrans = reformat(Get());

const Translations = function (msg) {
    const key_msg = msg.toLowerCase();
    const locale = formatMessage.setup().locale;
    if (locale in allTrans) {
        console.log(allTrans[locale][key_msg]);
        return allTrans[locale][key_msg];
    }
    
    return msg;
    

};

module.exports = Translations;
