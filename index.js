const { chromium } = require("playwright");

chromium.launch({ headless: false, args:  ["--auto-open-devtools-for-tabs"] }).then(async (browser) => {
    page = await browser.newPage();
    await page.goto("https://accounts.hcaptcha.com/demo");

    await page.waitForSelector("iframe[src^='https://newassets.hcaptcha.com/captcha/v1/']");
    let response = "<hCaptcha Response>";
    let widgetId = await page.evaluate(() => {
        return document.querySelector("iframe[src^='https://newassets.hcaptcha.com/captcha/v1/']").getAttribute("data-hcaptcha-widget-id");
    });
    await page.evaluate(({widgetId, response}) => {
        window.postMessage(JSON.stringify({
            "source": "hcaptcha", 
            "label": "challenge-closed",
            "id": widgetId,
            "contents": {
                "event": "challenge-passed",
                "response": response,
                "expiration": 120
            }
        }));
    }, {widgetId, response});
});
