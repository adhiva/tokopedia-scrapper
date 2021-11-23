const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    // Goes to page
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    await page.goto('https://www.tokopedia.com/p/handphone-tablet/handphone?page=1');

    // Auto Scrolling
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0
            let distance = 100
            let timer = setInterval(() => {
                let scrollHeight = (document.body.scrollHeight/4)
                window.scrollBy(0, distance)
                totalHeight += distance
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer)
                    resolve()
                }
            }, 100)
        })
    })

    // Waiting for the selector
    await page.waitForSelector('.css-bk6tzz.e1nlzfl3');
    let links = [];
    let result = await page.$$eval('.css-bk6tzz.e1nlzfl3 > a', names => names.map(name => name.getAttribute('href')));

    const page2 = await browser.newPage();// open new tab
    await page2.goto('https://www.tokopedia.com/p/handphone-tablet/handphone?page=2');// go to github.com 
    await page2.bringToFront();// make the tab active
    
    // Auto Scrolling
    await page2.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0
            let distance = 100
            let timer = setInterval(() => {
                let scrollHeight = (document.body.scrollHeight/4)
                window.scrollBy(0, distance)
                totalHeight += distance
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer)
                    resolve()
                }
            }, 100)
        })
    })

    let result2 = await page2.$$eval('.css-bk6tzz.e1nlzfl3 > a', names => names.map(name => name.getAttribute('href')));
    links = [...result, ...result2];
    console.log('Total Links : ', links.length);

    links.map(link => async(link) => {
        const detail_page = await browser.newPage();
        await detail_page.goto(link);
        await detail_page.bringToFront();
    })

    await browser.close();
})();
