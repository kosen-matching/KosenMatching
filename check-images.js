// A new, more robust script to check for broken image links in kosen-data.ts

const fs = require('fs').promises;
const path = require('path');
// This script requires node-fetch@2. To install: npm install node-fetch@2
const fetch = require('node-fetch');

// --- Configuration ---
const DEFAULT_DELAY_MS = 1000; // Default delay between requests in milliseconds.
const RETRY_DELAY_MS = 5000;  // Delay before retrying on a 429 error.
const DATA_FILE_PATH = path.join(__dirname, 'lib', 'kosen-data.ts');

// --- Helper Functions ---
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Parses command line arguments.
 * --fix: Applies the changes to the file. Without this flag, it's a dry run.
 * --delay=<ms>: Overrides the default delay between requests.
 * @returns {object} { shouldFix: boolean, delay: number }
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const shouldFix = args.includes('--fix');
    const delayArg = args.find(arg => arg.startsWith('--delay='));
    let delay = DEFAULT_DELAY_MS;
    if (delayArg) {
      const delayVal = parseInt(delayArg.split('=')[1], 10);
      if (!isNaN(delayVal)) {
        delay = delayVal;
      } else {
        console.error(`Invalid delay value. Using default: ${DEFAULT_DELAY_MS}ms`);
      }
    }
    return { shouldFix, delay };
}

/**
 * Checks the status of a given URL.
 * Implements a single retry with a longer delay for 429 errors.
 * @param {string} url - The URL to check.
 * @param {string} kosenId - The ID of the kosen for logging.
 * @returns {Promise<boolean>} - True if the link is valid, false otherwise.
 */
async function isLinkValid(url, kosenId) {
    try {
        let response = await fetch(url, { method: 'HEAD', timeout: 5000 });
        
        if (response.status === 429) {
            console.warn(`⚠️ Received 429 (Too Many Requests) for ${kosenId}. Retrying after ${RETRY_DELAY_MS}ms...`);
            await sleep(RETRY_DELAY_MS);
            response = await fetch(url, { method: 'HEAD', timeout: 8000 });
        }

        if (response.ok) {
            console.log(`✅ [${response.status}] ${kosenId} image is OK.`);
            return true;
        } else {
            console.error(`❌ [${response.status}] Found broken link for ${kosenId}.`);
            return false;
        }
    } catch (error) {
        console.error(`🚨 Network error checking ${kosenId}: ${error.message}.`);
        return false;
    }
}


/**
 * Main function to check and optionally fix broken image links.
 */
async function checkImageLinks() {
    const { shouldFix, delay } = parseArgs();

    console.log('--- Kosen Image Link Checker ---');
    console.log(`Mode: ${shouldFix ? 'FIX' : 'DRY RUN'}`);
    console.log(`Request Delay: ${delay}ms`);
    console.log(`Reading data from: ${DATA_FILE_PATH}`);
    console.log('---------------------------------');

    let fileContent;
    try {
        fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    } catch (error) {
        console.error(`Failed to read data file: ${error.message}`);
        return;
    }
    
    // This regex finds kosen objects that contain an 'imageUrl'.
    // It's designed to not match across different objects by using `[^}]*?`.
    const kosenObjectRegex = /{\s*id:\s*"([^"]+)"[^}]*?imageUrl:\s*"([^"]+)"[^}]*?}/g;
    
    const objectsToModify = [];
    const allMatches = [...fileContent.matchAll(kosenObjectRegex)];

    for (const [index, currentMatch] of allMatches.entries()) {
        const kosen = {
            id: currentMatch[1],
            url: currentMatch[2],
            fullObject: currentMatch[0]
        };

        console.log(`(${index + 1}/${allMatches.length}) Checking ${kosen.id}...`);

        if (!kosen.url.startsWith('http')) {
            console.log(`-> Skipping non-http URL for ${kosen.id}`);
            continue;
        }

        const isValid = await isLinkValid(kosen.url, kosen.id);
        if (!isValid) {
            objectsToModify.push(kosen);
        }
        
        // Wait before the next request to avoid rate limiting.
        if (index < allMatches.length -1) {
            await sleep(delay); 
        }
    }

    if (objectsToModify.length === 0) {
        console.log('\n✨ All image links are valid! No changes needed.');
        return;
    }

    console.log(`\nFound ${objectsToModify.length} broken links: ${objectsToModify.map(k => k.id).join(', ')}`);

    if (!shouldFix) {
        console.log('\nDRY RUN finished. To apply these changes, run the script with the --fix flag.');
        return;
    }

    // --- Apply Fixes ---
    console.log('\n--- Applying Fixes ---');
    let modifiedContent = fileContent;
    for (const kosen of objectsToModify) {
        // This regex precisely targets the block of three image properties.
        // It tries to match with a preceding comma first.
        const imageBlockWithCommaRegex = /,\s*imageUrl:\s*"[^"]*"\s*,\s*imageCreditText:\s*"[^"]*"\s*,\s*imageCreditUrl:\s*"[^"]*"/s;
        let cleanedObject = kosen.fullObject.replace(imageBlockWithCommaRegex, '');

        // If that didn't work, it might be at the start of the properties, so we match it differently
        // and remove a potential trailing comma.
        if (cleanedObject === kosen.fullObject) {
            const imageBlockAtStartRegex = /imageUrl:\s*"[^"]*"\s*,\s*imageCreditText:\s*"[^"]*"\s*,\s*imageCreditUrl:\s*"[^"]*"\s*,?/s;
            cleanedObject = kosen.fullObject.replace(imageBlockAtStartRegex, '');
        }

        modifiedContent = modifiedContent.replace(kosen.fullObject, cleanedObject);
        console.log(`- Removed image info for ${kosen.id}`);
    }
    
    try {
        await fs.writeFile(DATA_FILE_PATH, modifiedContent, 'utf-8');
        console.log('\n✅ File successfully modified.');
    } catch (error) {
        console.error(`\n🚨 Failed to write changes to file: ${error.message}`);
    }
}

checkImageLinks(); 