#!/bin/bash

# 画像URLのリスト（長野高専以降）
declare -a urls=(
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nagano_National_College_of_Technology_20110503.JPG/640px-Nagano_National_College_of_Technology_20110503.JPG"
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/National_Institute_of_Technology%2C_Toyama_College_Imizu_Campus_Main_Gate_20130427.JPG/640px-National_Institute_of_Technology%2C_Toyama_College_Imizu_Campus_Main_Gate_20130427.JPG"
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Ishikawa_National_College_of_Technology_20110503.JPG/640px-Ishikawa_National_College_of_Technology_20110503.JPG"
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Fukui_National_College_of_Technology_20110503.JPG/640px-Fukui_National_College_of_Technology_20110503.JPG"
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Gifu_National_College_of_Technology_20110503.JPG/640px-Gifu_National_College_of_Technology_20110503.JPG"
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Numazu_National_College_of_Technology_20110503.JPG/640px-Numazu_National_College_of_Technology_20110503.JPG"
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Toyota_National_College_of_Technology_20110503.JPG/640px-Toyota_National_College_of_Technology_20110503.JPG"
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Toba_National_College_of_Maritime_Technology_20110503.JPG/640px-Toba_National_College_of_Maritime_Technology_20110503.JPG"
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Suzuka_National_College_of_Technology_20110503.JPG/640px-Suzuka_National_College_of_Technology_20110503.JPG"
)

declare -a names=(
  "長野高専"
  "富山高専"
  "石川高専"
  "福井高専"
  "岐阜高専"
  "沼津高専"
  "豊田高専"
  "鳥羽商船高専"
  "鈴鹿高専"
)

# 各URLをチェック
for i in "${!urls[@]}"; do
  echo "【${names[$i]}】"
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${urls[$i]}")
  if [ "$STATUS" = "200" ]; then
    echo "✅ OK (${STATUS})"
  else
    echo "❌ NG (${STATUS})"
  fi
  echo ""
done 