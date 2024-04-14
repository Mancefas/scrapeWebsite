import { scrapeTableData } from './functions/scrapeTableData.js';
import { writeToTXT } from './functions/writeTotxtFile.js';
import 'dotenv/config';

// scrapeTableData(process.env.WEBSITE_WITH_TABLE);

(async () => {
    const tableData = await scrapeTableData(process.env.WEBSITE_WITH_TABLE);
    writeToTXT(tableData);
})();
