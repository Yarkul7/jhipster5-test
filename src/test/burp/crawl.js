#!/usr/bin/env node
'use strict';

const puppeteer = require('puppeteer');
const creds = require('./credentials');

async function run() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--proxy-server=localhost:8080'],
    ignoreHTTPSErrors: true 
  });

  const page = await browser.newPage();
  page.on('request', request => {
    console.log('Request url: ' + request.url());
  });

  try {
      console.log('Starting crawl');

      await page.goto('https://crimdrac- jhipster-5-demo.herokuapp.com', {timeout: 180000});

      await page.click('span[jhitranslate="global.menu.account.main"]');
      await page.click('span[jhitranslate="global.menu.account.login"]');

      await page.click('#username');
      await page.keyboard.type(creds.username);
      await page.click('#password');
      await page.keyboard.type(creds.password);

      await page.click('button[jhitranslate="login.form.button"]');
      await page.waitForSelector('span[jhitranslate="home.logged.message"]');


      await page.click('span[jhitranslate="global.menu.entities.main"]');
      await page.click('span[jhitranslate="global.menu.entities.blog"]');

      await page.click('span[jhitranslate="global.menu.entities.main"]');
      await page.click('span[jhitranslate="global.menu.entities.entry"]');

      await page.click('span[jhitranslate="global.menu.entities.main"]');
      await page.click('span[jhitranslate="global.menu.entities.tag"]');

      await page.click('span[jhitranslate="global.menu.admin.main"]');
      //await page.click('span[jhitranslate="global.menu.admin.userManagement"]');
      //await page.click('button.btn.btn-info.btn-sm[tabindex="0"]:nth-of-type(1)');

      await page.click('span[jhitranslate="global.menu.account.main"]');
      await page.click('span[jhitranslate="global.menu.account.settings"]');
      await page.click('button[jhitranslate="settings.form.button"]');

      await page.close();
      await browser.close();
      console.log('Crawl finished');
  }
  catch(error) {
      console.log(error);
      browser.close();
      console.log('Crawl aborted');
  }
}

run();
