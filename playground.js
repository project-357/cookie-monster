const { fetchCookiesAndSaveToCSV: cookm } = require('./cookm');

const urls = [
    "https://www.underarmour.com/",
    "https://www.underarmour.com/en-us/c/shoes/",
    "https://www.underarmour.com/en-us/p/basketball/unisex_ua_lockdown_7_basketball_shoes/3028512.html?dwvar_3028512_color=300",
    "https://www.underarmour.com/en-us/p/basketball/",
    "https://help.underarmour.com/s/",
    "https://www.underarmour.com/en-us/cart/",
    "https://www.underarmour.com/en-us/t/shop-app.html",
    "https://www.underarmour.com/en-us/c/new-arrivals/ ",
    "https://www.underarmour.com/en-us/c/mens/",
]
//  const ua = 'https://www.underarmour.com/';
// cookm(ua);

urls.forEach(url => cookm(url));

