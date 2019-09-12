#!/usr/bin/env node
'use strict';

const puppeteer = require('puppeteer');
const creds = require('./credentials');

var login = (function () {

    return {
        loginas: async function loginas() {
            const browser = await
                puppeteer.launch({
                    headless: true,
                    args: ['x--proxy-server=localhost:8080'],
                    ignoreHTTPSErrors: true
                });

            const page = await browser.newPage();
            page.on('request', request => {
                console.log('Request url: ' + request.url());
            });

            try {
                console.log('Starting crawl');

                //let url = 'https://www2.myzurich.com';
                let url = 'https://www.dndbeyond.com';
                await
                    page.goto(url, {timeout: 180000});

                let cookies = await page.cookies();
                // let url = 'https://crimdrac-jhipster-5-demo.herokuapp.com';
                console.log("Cookies:");
                let sessionCookies = cookies.filter(c => c.session).map(c => JSON.stringify(c));
                console.log(sessionCookies);

                await page.close();
                await browser.close();
                console.log('Crawl finished');
                return cookies;
            }
            catch (error) {
                console.log(error);
                browser.close();
                console.log('Crawl aborted');
            }
        }
    }
})();


// for node.js
if (typeof module !== 'undefined') {
    if (typeof module.exports !== 'undefined') {
        module.exports = login;
    }
}
//run();
