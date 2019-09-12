#!/usr/bin/env node

'use strict';
const LoginClient = require('./LoginClient.js');
const puppeteer = require('puppeteer');




async function run() {
    let loginclient = new LoginClient(
        {
            headless: true,
            args: ['x--proxy-server=localhost:8080'],
            ignoreHTTPSErrors: true
        }
    );
    await loginclient.loginAs('VBOSS');
    let sessionCookies = loginclient.sessionCookies.map(c => JSON.stringify(c));
    console.log(sessionCookies);
}


run();

