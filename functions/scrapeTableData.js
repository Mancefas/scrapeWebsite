import puppeteer from 'puppeteer';

export const scrapeTableData = async (url) => {
    const tableData = [];
    const nextButtonToPress = 2;
    let previousContent = null;
    const startTime = new Date();

    const browser = await puppeteer.launch({
        // headless: 'new',
        // if dont need to check how it is working, can use headless: 'new'
        headless: false,
        // need browser size, because website makes 'display: none' on some items if not wide enough
        defaultViewport: { width: 1200, height: 800 },
        protocolTimeout: 0,
    });

    // Open a new page
    const page = await browser.newPage();
    await page.setDefaultTimeout(0);

    // wait for table to get some data
    await page.goto(url, {
        waitUntil: 'domcontentloaded',
    });

    // open select and press 100 option
    await page.waitForSelector('[name="datatableOperadores_length"]');
    await page.select('[name="datatableOperadores_length"]', '100');

    await page.waitForFunction(() => {
        const tbody = document.querySelector('#datatableOperadores tbody');
        const childrenAmount = tbody.children.length;
        return childrenAmount !== 0;
    });

    const initialContent = await page.$eval(
        '#datatableOperadores_info',
        (el) => el.innerText
    );
    previousContent = initialContent;

    for (let i = 0; i < nextButtonToPress - 1; i++) {
        if (i === 0) {
            const tableRows = await page.evaluate(() => {
                const table = document.querySelector('tbody');

                return Array.from(table.children).map((row) => row.innerText);
            });
            tableData.push(...tableRows);

            await page.waitForSelector('#datatableOperadores_next');
            await page.click('#datatableOperadores_next');
        }
        const updatedContent = await page.$eval(
            '#datatableOperadores_info',
            (el) => el.innerText
        );
        previousContent = updatedContent;

        await page.waitForFunction(
            (previousContent) => {
                const textOfCurrentLines = document.querySelector(
                    '#datatableOperadores_info'
                );
                const innerText = textOfCurrentLines.innerText;
                return innerText !== previousContent;
            },
            {},
            previousContent
        );

        // Get table data
        const tableRows = await page.evaluate(() => {
            const table = document.querySelector('tbody');

            return Array.from(table.children).map((row) => row.innerText);
        });

        tableData.push(...tableRows);

        //press next button again
        await page.waitForSelector('#datatableOperadores_next');
        await page.click('#datatableOperadores_next');
    }

    await browser.close();

    const endTime = new Date();
    // Calculate the difference in milliseconds
    const executionTime = endTime - startTime;

    // Log the execution time
    console.log(`Execution time: ${executionTime} ms`);
    return tableData;
};
