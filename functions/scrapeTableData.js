import puppeteer from "puppeteer";
import { writeToTXT } from "./writeTotxtFile.js";

export const scrapeTableData = async (url) => {
  const tableData = [];
  const nextButtonToPress = 10;
  
  const browser = await puppeteer.launch({
    headless: 'new',
    timeout: 0,
    // headless: false,
    // need browser size, because website makes 'display: none' on some items if not wide enough
    defaultViewport: { width: 1200, height: 800 },
    timeout: 0
  });
  
  // Open a new page
  const page = await browser.newPage();

  // wait for table to get some data
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  await page.waitForFunction(() => {
    const tbody = document.querySelector("#datatableOperadores tbody");
    const childrenAmount = tbody.children.length;
    return childrenAmount !== 0;
  });

  // open select and press 100 option
  await page.$('[name="datatableOperadores_length"]')
  await page.select('[name="datatableOperadores_length"]', '100');

  await page.waitForFunction(() => {
    const tbody = document.querySelector("#datatableOperadores tbody");
    const childrenAmount = tbody.children.length;
    return childrenAmount === 100;
  });

  // const isNextDisabled = await page.evaluate(() => {
  //   const nextButton = document.querySelector('a.paginate_button.next.disabled');
  //   return nextButton !== null;
  // });

  // while (!isNextDisabled) {
  for (let i = 0; i < nextButtonToPress; i++) {
    //wait for 100 rows to load
    await page.waitForFunction(() => {
      const tbody = document.querySelector("#datatableOperadores tbody");
      const childrenAmount = tbody.children.length;
      return childrenAmount === 100;
    });

    // Get table data
    const tableRows = await page.evaluate(() => {
    const table = document.querySelector("tbody");

    return Array.from(table.children).map(row => row.innerText);
    });

    for (const row of tableRows) {
      await writeToTXT(row);
    }
    //push new data to array
    // tableData.push(...tableRows);

    //press next button again
    await page.$('#datatableOperadores_next')
    await page.click('#datatableOperadores_next')
  }


  await browser.close();
  // writeToTXT(tableData)
};

async function waitForTableToLoad(page) {
  await page.waitForFunction(() => {
    const tbody = document.querySelector("#datatableOperadores tbody");
    const childrenAmount = tbody.children.length;
    return childrenAmount !== 0;
  });
}

async function waitForRowsToLoad(page, rowCount) {
  await page.waitForFunction((rowCount) => {
    const tbody = document.querySelector("#datatableOperadores tbody");
    const childrenAmount = tbody.children.length;
    return childrenAmount === rowCount;
  }, {}, rowCount);
}
