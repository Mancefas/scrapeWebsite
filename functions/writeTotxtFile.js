import { writeFile } from 'fs/promises';

export async function writeToTXT(content) {
    try {
        await writeFile('output/test.txt', content + '\n', { flag: 'a' });
    } catch (err) {
        console.log(err);
    }
}
