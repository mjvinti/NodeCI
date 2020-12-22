const Page = require('./helpers/page');
const mongoose = require('mongoose');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
});

afterAll(async () => {
    await mongoose.connection.close();
});

test('the header has the correct text', async () => {
    const text = await page.getContentsOf('a.brand-logo');

    expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
    await page.click('.right a');

    const url = await page.url();
    
    expect(url).toMatch(/accounts\.google\.com/);
});

test('when signed in, shows logout button', async () => {
    await page.login();

    const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);

    expect(text).toEqual('Logout');
});