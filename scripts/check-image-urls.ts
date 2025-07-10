import { kosenList } from '../lib/kosen-data';

// Node.js v18以前の環境で実行する場合、'node-fetch'などのインストールが必要です。
if (!global.fetch) {
  console.error(
    'fetch API is not available. Please use Node.js v18 or later, or install a polyfill like `node-fetch`.'
  );
  process.exit(1);
}

interface CheckResult {
  id: string;
  name: string;
  campus: string;
  url: string;
  status: number;
  ok: boolean;
}

async function checkUrl(
  url: string
): Promise<{ status: number; ok: boolean }> {
  try {
    // HEADリクエストでヘッダー情報だけ取得するのが効率的です
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return {
      status: response.status,
      ok: response.ok,
    };
  } catch (error: any) {
    console.error(`Error checking ${url}: ${error.message}`);
    return {
      status: 0, // ステータスコードがないネットワークエラーなど
      ok: false,
    };
  }
}

async function checkImageUrls() {
  console.log('Checking image URLs in kosen-data.ts...');

  const checkPromises = kosenList.map(async (kosen): Promise<CheckResult | null> => {
    if (!kosen.imageUrl || kosen.imageUrl === '/placeholder.jpg') {
        return null;
    }
    const result = await checkUrl(kosen.imageUrl);
    return { ...kosen, url: kosen.imageUrl, status: result.status, ok: result.ok };
  });

  const results = (await Promise.all(checkPromises)).filter((r): r is CheckResult => r !== null);
  const brokenLinks = results.filter((result) => !result.ok);

  console.log('\n--- Check Complete ---');

  if (brokenLinks.length > 0) {
    console.error(`\n❌ Found ${brokenLinks.length} broken image URLs:\n`);
    brokenLinks.forEach((link) => {
      console.log(`[Status: ${link.status}] ${link.name} (${link.campus}) - ${link.id}`);
      console.log(`  URL: ${link.url}\n`);
    });
  } else {
    console.log('\n✅ All image URLs are working correctly!');
  }
}

checkImageUrls().catch((err) => {
  console.error('An unexpected error occurred:', err);
});