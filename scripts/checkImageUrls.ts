import { kosenList } from '../lib/kosen-data.js';
import { Kosen } from '../types/kosen.js';
import fetch from 'node-fetch';

// sleep関数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function checkImageUrls() {
  console.log(`Checking ${kosenList.length} image URLs...`);

  for (const kosen of kosenList) {
    const url = kosen.imageUrl;
    if (!url) {
      console.log(`SKIP: ${kosen.name} (${kosen.id}) - No imageUrl provided.`);
      continue;
    }

    let retries = 0;
    const maxRetries = 1; // 1回だけ再試行

    while (retries <= maxRetries) {
      try {
        const response = await fetch(url, { method: 'HEAD', timeout: 5000 });

        if (response.status === 404) {
          console.log(`404 NOT FOUND: ${kosen.name} (${kosen.id}) - ${url}`);
          break; // 404の場合は再試行しない
        } else if (response.status === 429) {
          console.log(`429 TOO MANY REQUESTS: ${kosen.name} (${kosen.id}) - ${url}. Retrying in 5 seconds...`);
          retries++;
          await sleep(5000); // 5秒待機
          continue; // 再試行
        } else if (!response.ok) {
          console.log(`ERROR ${response.status}: ${kosen.name} (${kosen.id}) - ${url}`);
          break; // その他のエラーも再試行しない
        } else {
          console.log(`OK: ${kosen.name} (${kosen.id}) - ${url}`);
          break; // 成功したらループを抜ける
        }
      } catch (error: any) {
        console.log(`REQUEST FAILED: ${kosen.name} (${kosen.id}) - ${url} - ${error.message}`);
        break; // リクエスト自体が失敗したら再試行しない
      }
    }
  }
}

checkImageUrls();
