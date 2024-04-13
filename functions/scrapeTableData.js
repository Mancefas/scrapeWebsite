import puppeteer from "puppeteer";

export const scrapeTableData = async (url) => {
  
  const browser = await puppeteer.launch({
    headless: 'new',
    // need browser size, because website makes 'display: none' on some items if not wide enough
    defaultViewport: { width: 1200, height: 800 }
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

  // Get table data
  const tableRows = await page.evaluate(() => {
    const table = document.querySelector("tbody");

    return Array.from(table.children).map(row => row.innerText);
  });

  await browser.close();

  // return data as array
  // return tableRows
  console.log(tableRows)
};