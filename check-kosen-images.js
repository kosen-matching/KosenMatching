const kosenData = require('./lib/kosen-data.ts');

// 長野高専のインデックスを見つける
const naganoIndex = kosenData.kosenList.findIndex(k => k.id === 'nagano');

// 長野高専以降の高専をスライス
const targetKosens = kosenData.kosenList.slice(naganoIndex);

console.log(`長野高専以降の高専数: ${targetKosens.length}`);

// HTTPSリクエストを送信して画像の存在を確認
const https = require('https');

async function checkImageUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({
        statusCode: res.statusCode,
        exists: res.statusCode === 200
      });
    }).on('error', (err) => {
      resolve({
        statusCode: 0,
        exists: false,
        error: err.message
      });
    });
  });
}

async function checkAllImages() {
  console.log('\n画像URLチェック結果:\n');
  
  for (const kosen of targetKosens) {
    console.log(`\n【${kosen.name}】`);
    console.log(`ID: ${kosen.id}`);
    console.log(`画像URL: ${kosen.imageUrl}`);
    
    const result = await checkImageUrl(kosen.imageUrl);
    console.log(`ステータス: ${result.statusCode} ${result.exists ? '✅ OK' : '❌ NG'}`);
    
    if (!result.exists) {
      console.log(`エラー: ${result.error || 'Not Found'}`);
    }
    
    console.log(`ライセンス: ${kosen.imageCreditText}`);
    console.log(`元ファイル: ${kosen.imageCreditUrl}`);
  }
}

checkAllImages().then(() => {
  console.log('\n\nチェック完了');
}); 