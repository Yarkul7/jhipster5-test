'use strict';

const puppeteer = require('puppeteer');

class LoginClient {

    constructor(config, options = {}) {
        this.cookies = [];
        this.options = options;
    }

    async loginAs(username) {
        this.cookies = [];
        const browser = await puppeteer.launch(this.options);

        const page = await browser.newPage();

        page.on('request', request => {
            console.log('Request url: ' + request.url());
        });


        let config = {
            loginUrls: [ 'https://www2.myzurich.com?user={username}' ],
            targetUrls: [ 'https://raw.githubusercontent.com/GoogleChrome/puppeteer/master/package.json']
        };
        try {
            for  (let url of config.loginUrls) {
                await page.goto(url.replace('{username}', username));
            };
            for (let url of config.targetUrls) {
                await page.goto(url);
                await page.content();

                let json = await page.evaluate(() =>  {
                    return JSON.parse(document.querySelector("body").innerText);
                });
                console.log(json);
            };

            this.cookies = await page.cookies();
            await page.close();
        }
        finally {
            await browser.close();
        }
    }

    get sessionCookies () {
        return this.cookies.filter(c => c.session);
    }
}

module.exports = LoginClient;

