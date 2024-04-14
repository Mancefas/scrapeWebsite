import { scrapeTableData } from './functions/scrapeTableData.js';
import { writeToTXT } from './functions/writeTotxtFile.js';
import 'dotenv/config';

(async () => {
    const tableData = await scrapeTableData(process.env.WEBSITE_WITH_TABLE);
    writeToTXT(tableData);
})();
