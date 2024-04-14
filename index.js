import { scrapeTableData } from './functions/scrapeTableData.js';
import 'dotenv/config';

scrapeTableData(process.env.WEBSITE_WITH_TABLE);
