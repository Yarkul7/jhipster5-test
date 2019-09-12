#!/usr/bin/env node

'use strict';

const puppeteer = require('puppeteer');
const login = require('./LoginClient');



async function run() {
    let cookies = await login.loginas();
    console.log("Cookies:");
    let sessionCookies = cookies.filter(c => c.session).map(c => JSON.stringify(c));
    console.log(sessionCookies);
}


run();

