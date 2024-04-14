import { writeFile } from 'fs/promises';

export async function writeToTXT(content: (string| null)[] ) {
    if (!content) return;
    
    try {
        for (const row of content) {
            await writeFile('output/test.txt', row + '\n', { flag: 'a' });
        }
    } catch (err) {
        console.log(err);
    }
}
