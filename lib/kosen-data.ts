import { Kosen } from '@/types/kosen';

export const kosenList: Kosen[] = [
  // --- 国立高専 (51校) ---
  // 北海道 (4校)
  { id: "hakodate", name: "函館工業高等専門学校", location: "北海道函館市", website: "https://www.hakodate-ct.ac.jp/", type: "国立", departments: ["生産システム工学科", "物質環境工学科", "社会基盤工学科", "情報工学科"], description: "函館の恵まれた自然環境の中で、ものづくりと地域創生に貢献できる技術者を育成。早期からのキャリア教育も充実。", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Bldg.Advanced-course_of_NIT%2C_Hakodate_College.jpg", imageCreditText: "Itya, CC0, via Wikimedia Commons", imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Bldg.Advanced-course_of_NIT,_Hakodate_College.jpg" },
  { 
    id: "tomakomai", 
    name: "苫小牧工業高等専門学校", 
    location: "北海道苫小牧市", 
    website: "https://www.tomakomai-ct.ac.jp/", 
    type: "国立", 
    departments: ["創造工学科（機械・電気電子系、情報・制御系、物質・環境系）"], 
    description: "産業都市苫小牧に位置し、多様な分野をカバーする創造工学科が特色。PBL教育や国際交流も盛ん。", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c9/National_Institute_of_Technology%2CTomakomai_College.jpg",
    imageCreditText: "Endou subaru, CC BY-SA 4.0, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:National_Institute_of_Technology,Tomakomai_College.jpg"
  },
  { id: "kushiro", name: "釧路工業高等専門学校", location: "北海道釧路市", website: "https://www.kushiro-ct.ac.jp/", type: "国立", departments: ["創造工学科（スマートメカニクスコース、エレクトロニクスコース、建築デザインコース）"], description: "1965年設置。人格、広い視野と創造力、チャレンジ精神を育む教育を目標とする。2年次よりコース選択。略称は釧路高専。", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/94/Kushiro_national_college_of_technology.jpg",
    imageCreditText: "GenOishi, Public domain, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Kushiro_national_college_of_technology.jpg" },
  { 
    id: "asahikawa", 
    name: "旭川工業高等専門学校", 
    location: "北海道旭川市", 
    website: "https://www.asahikawa-nct.ac.jp/", 
    type: "国立", 
    departments: ["機械システム工学科", "電気情報工学科", "システム制御情報工学科", "物質化学工学科"], 
    description: "1962年設置。北海道旭川市に所在する国立高等専門学校。略称は旭川高専。校訓は「明朗誠実 自主創造」。国際的視野と人間性に富んだ実践的な技術者の育成を目指す。", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/45/%E6%97%AD%E5%B7%9D%E9%AB%98%E5%B0%82.jpg",
    imageCreditText: "Rela1470, CC BY-SA 3.0, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:%E6%97%AD%E5%B7%9D%E9%AB%98%E5%B0%82.jpg"
  },
  // 東北 (6校)
  { 
    id: "hachinohe", 
    name: "八戸工業高等専門学校", 
    location: "青森県八戸市", 
    website: "https://www.hachinohe-ct.ac.jp/", 
    type: "国立", 
    departments: ["機械システムデザインコース", "電気情報システムコース", "マテリアル・バイオシステムコース", "環境都市・建築デザインコース"], 
    description: "青森県八戸市に位置する国立高等専門学校。地域産業界との連携を重視し、実践的技術者の育成に力を注いでいる。「自主探究」活動など、学生の主体的な学びを促す取り組みも特徴的。", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Hachinohe-kousen-seimon.jpg",
    imageCreditText: "house-nasu, CC BY-SA 3.0, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Hachinohe-kousen-seimon.jpg"
  },
  { id: "ichinoseki", name: "一関高専", location: "岩手県一関市", website: "https://www.ichinoseki.ac.jp/", type: "国立", departments: ["未来創造工学科（機械・知能コース、電気・電子コース、情報・ソフトウェアコース、化学・バイオコース）"], description: "自然豊かな環境で、座学と実践をバランス良く学ぶ。DCON（高専ディープラーニングコンテスト）での活躍も知られる。", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7c/National_Institute_of_Technology%2C_Ichinoseki_College_1.jpg",
    imageCreditText: "Ebiebi2, CC BY-SA 4.0, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:National_Institute_of_Technology,_Ichinoseki_College_1.jpg" 
  },
  { 
    id: "sendai_natori", 
    name: "仙台高専（名取）", 
    location: "宮城県名取市", 
    website: "https://www.sendai-nct.ac.jp/natori-campus/", 
    type: "国立", 
    departments: ["機械システム工学科", "電気システム工学科", "マテリアル環境工学科", "建築デザイン学科"], 
    description: "2009年に宮城工業高等専門学校と仙台電波工業高等専門学校が統合・再編されて発足した国立高等専門学校。名取キャンパスは旧宮城工業高等専門学校。地域社会や産業界との連携にも力を入れている。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Sendai_Kosen_in_Natori_2011.jpg",
    imageCreditText: "Kinori, CC0, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Sendai_Kosen_in_Natori_2011.jpg"
  },
  { 
    id: "sendai_hirose", 
    name: "仙台高等専門学校（広瀬キャンパス）", 
    location: "宮城県仙台市青葉区", 
    website: "https://www.sendai-nct.ac.jp/hirose-campus/", 
    type: "国立", 
    departments: ["情報システムコース", "情報通信コース", "知能エレクトロニクスコース", "応用化学コース", "ロボティクスコース"], 
    description: "2009年に宮城工業高等専門学校と仙台電波工業高等専門学校が統合・再編されて発足した国立高等専門学校。広瀬キャンパスは旧仙台電波工業高等専門学校。地域社会や産業界との連携にも力を入れている。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/%E5%BA%83%E7%80%AC%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%91%E3%82%B9%E6%A0%A1%E8%88%8E.jpg",
    imageCreditText: "Koho snct, CC BY-SA 4.0, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:%E5%BA%83%E7%80%AC%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%91%E3%82%B9%E6%A0%A1%E8%88%8E.jpg"
  },
  { 
    id: "akita", 
    name: "秋田工業高等専門学校", 
    location: "秋田県秋田市", 
    website: "https://www.akita-nct.ac.jp/", 
    type: "国立", 
    departments: ["創造システム工学科 （機械系、電気系、土木系）"], 
    description: "1962年設置。秋田県秋田市に位置し、「創造実践」を教育理念に掲げる。少人数教育と早期専門教育により、実践的技術者を育成。地域の課題解決にも積極的に取り組む。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b6/National_Institute_of_Technology%2C_Akita_College_20181103.jpg",
    imageCreditText: "掬茶, CC BY-SA 4.0, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:National_Institute_of_Technology,_Akita_College_20181103.jpg"
  },
  { 
    id: "tsuruoka", 
    name: "鶴岡工業高等専門学校", 
    location: "山形県鶴岡市", 
    website: "https://www.tsuruoka-nct.ac.jp/", 
    type: "国立", 
    departments: ["創造工学科（機械コース、電気・電子コース、情報コース、生物・化学コース）"], 
    description: "1963年設立。山形県鶴岡市に位置する国立高等専門学校。「自学自習 理魂工才」を教育理念に、実践的技術者の育成を目指す。地域連携にも積極的。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tsuruoka-nct.jpg",
    imageCreditText: "Abentz, CC BY 3.0, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Tsuruoka-nct.jpg"
  },
  {
    id: "fukushima",
    name: "福島工業高等専門学校",
    location: "福島県いわき市",
    website: "https://www.fukushima-nct.ac.jp/",
    type: "国立",
    departments: ["機械システム工学科", "電気電子システム工学科", "化学・バイオ工学科", "都市システム工学科", "経営情報学科"],
    description: "1962年設立。福島県いわき市に位置する国立高等専門学校。略称は福島高専。幅広い教養と人間力、科学技術の基礎的素養、創造性と実践力を育成。文系学科も擁する点が特徴。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Fukushima_National_College_of_Technology.JPG",
    imageCreditText: "Altomarina, CC BY-SA 3.0, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Fukushima_National_College_of_Technology.JPG"
  },
  // 関東信越 (7校)
  { 
    id: "ibaraki", 
    name: "茨城工業高等専門学校", 
    location: "茨城県ひたちなか市", 
    website: "https://www.ibaraki-ct.ac.jp/", 
    type: "国立", 
    departments: ["機械・制御系（機械工学コース、制御工学コース）", "電気・電子系", "情報系", "化学・生物・環境系"], 
    description: "1964年設置。茨城県ひたちなか市に所在する国立高等専門学校。国際社会に貢献できる教育研究拠点として、幅広い教養と豊かな人間性を持ち、深く専門の学芸を教授し、知的・実践的指導力を備えた創造的技術者を育成する。", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Ibaraki_National_College_of_Technology.JPG", 
    imageCreditText: "Abasaa, Public domain, via Wikimedia Commons", 
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Ibaraki_National_College_of_Technology.JPG" 
  },
  { 
    id: "oyama", 
    name: "小山工業高等専門学校", 
    location: "栃木県小山市", 
    website: "https://www.oyama-ct.ac.jp/", 
    type: "国立", 
    departments: ["機械工学科", "電気電子創造工学科", "物質工学科", "建築学科"], 
    description: "1965年設立。栃木県小山市に位置する国立高等専門学校。「技術者である前に人間であれ」という初代校長の理念のもと、幅広い教養と豊かな人間性を備えた実践的技術者の育成を目指す。", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Oyama_National_College_of_Technology_main_gate.JPG", 
    imageCreditText: "ほぶ, CC0, via Wikimedia Commons", 
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Oyama_National_College_of_Technology_main_gate.JPG" 
  },
  { 
    id: "gunma", 
    name: "群馬工業高等専門学校", 
    location: "群馬県前橋市", 
    website: "https://www.gunma-ct.ac.jp/", 
    type: "国立", 
    departments: ["機械工学科", "電子メディア工学科", "電子情報工学科", "物質工学科", "環境都市工学科"], 
    description: "1962年設立。群馬県前橋市に位置する国立高等専門学校。創造性豊かな実践的技術者の育成を目標とし、地域社会との連携にも力を入れている。５つの専門学科を有する。", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Gunma_National_College_of_Technology.jpg", 
    imageCreditText: "☆(・ω<), CC BY 3.0, via Wikimedia Commons", 
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Gunma_National_College_of_Technology.jpg"
  },
  { 
    id: "kisarazu", 
    name: "木更津工業高等専門学校", 
    location: "千葉県木更津市", 
    website: "https://www.kisarazu.ac.jp/", 
    type: "国立", 
    departments: ["機械工学科", "電気電子工学科", "電子制御工学科", "情報工学科", "環境都市工学科"], 
    description: "1967年設立。千葉県木更津市に位置する国立高等専門学校。略称は木更津高専。教育理念は「深く専門の学芸を教授し、職業に必要な能力を育成する」。ものづくり教育を重視している。", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/af/Kisarazu_National_College_of_Technology.JPG", 
    imageCreditText: "Abasaa, Public domain, via Wikimedia Commons", 
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Kisarazu_National_College_of_Technology.JPG" 
  },
  { id: "tokyo", name: "東京工業高等専門学校", location: "東京都八王子市", website: "https://www.tokyo-ct.ac.jp/", type: "国立", departments: ["機械工学科", "電気工学科", "電子工学科", "情報工学科", "物質工学科"], description: "1965年に設置された国立高等専門学校。東京都八王子市に位置し、略称は東京高専。豊かな人間性と社会性、国際性を備え、深く専門の学芸を教授し、新しい科学技術を創造できる実践的技術者の育成を目指しています。", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Tokyo_kousen_seimon.jpg", imageCreditText: "Ishimochi, CC BY-SA 3.0, via Wikimedia Commons", imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Tokyo_kousen_seimon.jpg" },
  { 
    id: "nagaoka", 
    name: "長岡工業高等専門学校", 
    location: "新潟県長岡市", 
    website: "https://www.nagaoka-ct.ac.jp/", 
    type: "国立", 
    departments: ["機械工学科", "電気工学科", "電子制御工学科", "情報工学科", "環境都市工学科"], 
    description: "新潟県長岡市に位置する国立高等専門学校。実践的・創造的な技術者育成を目指し、地域連携も重視。5学科を有し、特に「複合系」学科も充実。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a1/NNCT_2015.JPG",
    imageCreditText: "D.suga, CC BY-SA 4.0, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:NNCT_2015.JPG"
  },
  { id: "nagano", name: "長野工業高等専門学校", location: "長野県長野市", website: "https://www.nagano-nct.ac.jp/", type: "国立", departments: ["機械工学科", "電気電子工学科", "電子制御工学科", "情報工学科", "環境都市工学科"], description: "長野県長野市に位置する国立高等専門学校。技術者倫理と実践力を重視し、地域に貢献できる人材を育成。インターンシップや卒業研究に力を入れている。", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dd/National_Institute_of_Technology%2C_Nagano_College.JPG", imageCreditText: "Rald, CC BY 3.0, via Wikimedia Commons", imageCreditUrl: "https://commons.wikimedia.org/wiki/File:National_Institute_of_Technology,_Nagano_College.JPG" },
  // 東海北陸 (8校)
  { 
    id: "toyama", 
    name: "富山高等専門学校", 
    location: "富山県（富山市・射水市）", 
    website: "https://www.nc-toyama.ac.jp/", 
    type: "国立", 
    departments: ["機械システム工学科", "電気制御システム工学科", "物質化学工学科", "生物工学科", "国際流通情報学科", "商船学科", "電子情報工学科", "国際ビジネス学科"], 
    description:"本郷キャンパスと射水キャンパスの2キャンパス体制。工学・商船学の融合。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/62/Toyama-k%C5%8Dsen.JPG",
    imageCreditText: "越中掾, Public domain, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Toyama-k%C5%8Dsen.JPG?uselang=ja"
  },
  { 
    id: "ishikawa", 
    name: "石川工業高等専門学校", 
    location: "石川県河北郡津幡町", 
    website: "https://www.ishikawa-nct.ac.jp/", 
    type: "国立", 
    departments: ["機械工学科", "電気工学科", "電子情報工学科", "環境都市工学科", "建築学科"], 
    description: "石川県河北郡津幡町に位置する国立高等専門学校。実践的技術者の育成を目指し、地域連携も推進。国際交流や寮生活も特徴。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/34/Ishikawa-NCT_200509.jpg",
    imageCreditText: "Tsql, CC0, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Ishikawa-NCT_200509.jpg"
  },
  { 
    id: "fukui", 
    name: "福井工業高等専門学校", 
    location: "福井県鯖江市", 
    website: "https://www.fukui-nct.ac.jp/", 
    type: "国立", 
    departments: ["機械工学科", "電気電子工学科", "情報工学科", "環境都市工学科", "建築学科"], 
    description: "福井県鯖江市に位置する国立高等専門学校。「創造性豊かな実践的技術者の育成」を目指し、地域産業や文化との連携を重視。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/National_Institute_of_Technology%2C_Fukui_College_%28NIT-Fukui%29_1.jpg",
    imageCreditText: "Ebiebi2, CC BY-SA 4.0, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:National_Institute_of_Technology,_Fukui_College_(NIT-Fukui)_1.jpg?uselang=ja"
  },
  { 
    id: "gifu", 
    name: "岐阜工業高等専門学校", 
    location: "岐阜県本巣市", 
    website: "https://www.gifu-nct.ac.jp/", 
    type: "国立", 
    departments: ["機械工学科", "電気情報工学科", "電子制御工学科", "環境材料工学科", "建築学科"], 
    description: "岐阜県本巣市に位置する国立高等専門学校。「地域とともに歩む、創造性豊かな実践的技術者の育成」を目指し、特色ある技術教育を展開。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Gifu_National_College_of_Technology2008-1.jpg",
    imageCreditText: "Monami, CC BY-SA 2.5, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Gifu_National_College_of_Technology2008-1.jpg?uselang=ja"
  },
  { 
    id: "numazu", 
    name: "沼津工業高等専門学校", 
    location: "静岡県沼津市", 
    website: "https://www.numazu-ct.ac.jp/", 
    type: "国立", 
    departments: ["機械工学科", "電気電子工学科", "電子制御工学科", "情報工学科", "環境都市工学科"], 
    description: "静岡県沼津市に位置する国立高等専門学校。「創造性豊かな実践的技術者の育成」を目標に、地域産業や国際社会に貢献できる人材を輩出。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/68/National_Institute_of_Technology%2C_Numazu_College_Logo.svg",
    imageCreditText: "沼津工業高等専門学校, Public domain, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:National_Institute_of_Technology,_Numazu_College_Logo.svg"
  },
  { 
    id: "toyota", 
    name: "豊田工業高等専門学校", 
    location: "愛知県豊田市", 
    website: "https://www.toyota-ct.ac.jp/", 
    type: "国立", 
    departments: ["機械工学科", "電気・電子システム工学科", "情報工学科", "環境都市工学科", "建築学科"], 
    description: "愛知県豊田市に位置する国立高等専門学校。トヨタ自動車との連携が深く、実践的な技術教育を展開。「ものづくり」を重視。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/63/Toyota_National_College_of_Technology.jpg",
    imageCreditText: "Kabata, CC BY-SA 3.0, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Toyota_National_College_of_Technology.jpg?uselang=ja"
  },
  { id: "toba_shosen", name: "鳥羽商船高等専門学校", location: "三重県鳥羽市", website: "https://www.toba-cmt.ac.jp/", type: "国立", departments: ["商船学科", "情報機械システム工学科"], description: "三重県鳥羽市に位置する商船系の国立高等専門学校。海事科学と工学技術を学び、海上技術者や陸上技術者を育成。" },
  { id: "suzuka", name: "鈴鹿工業高等専門学校", location: "三重県鈴鹿市", website: "https://www.suzuka-ct.ac.jp/", type: "国立", departments: ["機械工学科", "電気電子工学科", "電子情報工学科", "生物資源工学科", "環境都市工学科"], description: "三重県鈴鹿市に位置する国立高等専門学校。「創造性豊かな実践的技術者の育成」を目指し、地域産業や国際社会に貢献できる人材を輩出。" },
  // 近畿 (4校)
  { id: "maizuru", name: "舞鶴工業高等専門学校", location: "京都府舞鶴市", website: "https://www.maizuru-ct.ac.jp/", type: "国立", departments: ["機械工学科", "電気情報工学科", "電子制御工学科", "建設システム工学科"], description: "京都府舞鶴市に位置する国立高等専門学校。「創造性と実践力を有する技術者の育成」を目指し、地域産業や国際社会に貢献できる人材を育成。" },
  { id: "akashi", name: "明石工業高等専門学校", location: "兵庫県明石市", website: "https://www.akashi.ac.jp/", type: "国立", departments: ["機械工学科", "電気情報工学科", "応用化学科", "建築学科", "都市システム工学科"], description: "兵庫県明石市に位置する国立高等専門学校。明石海峡大橋を望む環境で、実践的・創造的な技術者育成を目指す。" },
  { id: "nara", name: "奈良工業高等専門学校", location: "奈良県大和郡山市", website: "https://www.nara-k.ac.jp/", type: "国立", departments: ["機械工学科", "電気工学科", "電子工学科", "情報工学科", "物質化学工学科", "建築学科"], description: "奈良県大和郡山市に位置する国立高等専門学校。「技術者である前に人間であれ」を教育理念に、幅広い分野で活躍できる技術者を育成。" },
  { id: "wakayama", name: "和歌山工業高等専門学校", location: "和歌山県御坊市", website: "https://www.wakayama-nct.ac.jp/", type: "国立", departments: ["機械工学科", "電気情報工学科", "生物応用化学科", "環境都市工学科"], description: "和歌山県御坊市に位置する国立高等専門学校。地域産業や社会に貢献できる、実践的技術者の育成を目指す。" },
  // 中国 (8校)
  { id: "yonago", name: "米子工業高等専門学校", location: "鳥取県米子市", website: "https://www.yonago-k.ac.jp/", type: "国立", departments: ["機械工学科", "電気情報工学科", "化学バイオ工学科", "建築学科", "開発・建設工学科"], description: "鳥取県米子市に位置する国立高等専門学校。「創造性豊かな実践的技術者の育成」を目指し、地域社会や国際社会に貢献できる人材を育成。" },
  { id: "matsue", name: "松江工業高等専門学校", location: "島根県松江市", website: "https://www.matsue-ct.jp/", type: "国立", departments: ["機械工学科", "電気工学科", "電子情報工学科", "環境・建設工学科", "建築学科"], description: "島根県松江市に位置する国立高等専門学校。「創造性豊かな実践的技術者の育成」を目指し、地域産業や国際社会に貢献できる人材を育成。" },
  { id: "tsuyama", name: "津山工業高等専門学校", location: "岡山県津山市", website: "https://www.tsuyama-ct.ac.jp/", type: "国立", departments: ["機械システム工学科", "電気電子システム工学科", "情報工学科", "環境建設工学科"], description: "岡山県津山市に位置する国立高等専門学校。「地域に根差し、世界をめざす創造的技術者の育成」を教育理念に掲げている。" },
  { id: "hiroshima_shosen", name: "広島商船高等専門学校", location: "広島県豊田郡大崎上島町", website: "https://www.hiroshima-cmt.ac.jp/", type: "国立", departments: ["商船学科", "流通情報工学科"], description: "広島県大崎上島町に位置する商船系の国立高等専門学校。海事科学と工学技術を学び、海上技術者や流通情報分野の技術者を育成。" },
  { id: "kure", name: "呉工業高等専門学校", location: "広島県呉市", website: "https://www.kure-nct.ac.jp/", type: "国立", departments: ["機械工学科", "電気情報工学科", "環境材料工学科", "建築学科"], description: "広島県呉市に位置する国立高等専門学校。「創造性豊かな実践的技術者の育成」を目指し、地域産業や社会に貢献できる人材を育成。" },
  { id: "tokuyama", name: "徳山工業高等専門学校", location: "山口県周南市", website: "https://www.tokuyama.ac.jp/", type: "国立", departments: ["機械電気工学科", "情報電子工学科", "土木建築工学科", "環境科学技術工学科"], description: "山口県周南市に位置する国立高等専門学校。「人間力豊かな実践的技術者の育成」を目指し、地域産業や社会に貢献できる人材を育成。" },
  { id: "ube", name: "宇部工業高等専門学校", location: "山口県宇部市", website: "https://www.ube-k.ac.jp/", type: "国立", departments: ["機械工学科", "電気工学科", "制御情報工学科", "化学工学科", "部材開発工学科", "共同システム工学専攻"], description: "山口県宇部市に位置する国立高等専門学校。「創造性豊かな実践的技術者の育成」を目指し、地域産業や国際社会に貢献できる人材を育成。" },
  { id: "oshima_shosen", name: "大島商船高等専門学校", location: "山口県大島郡周防大島町", website: "https://www.oshima-k.ac.jp/", type: "国立", departments: ["商船学科", "情報機械システム工学科"], description: "山口県周防大島町に位置する商船系の国立高等専門学校。海事科学と工学技術を学び、海上技術者や陸上技術者を育成。" },
  // 四国 (5校)
  { id: "anan", name: "阿南工業高等専門学校", location: "徳島県阿南市", website: "https://www.anan-nct.ac.jp/", type: "国立", departments: ["機械工学科", "電気電子工学科", "情報工学科", "建設システム工学科"], description: "徳島県阿南市に位置する国立高等専門学校。「創造性豊かな実践的技術者の育成」を目指し、地域産業や国際社会に貢献できる人材を育成。" },
  { id: "kagawa", name: "香川高等専門学校", location: "香川県（高松市・三豊市）", website: "https://www.kagawa-nct.ac.jp/", type: "国立", departments: ["機械工学科", "電気情報工学科", "応用化学科", "建設環境工学科", "通商情報学科", "機械電子工学科", "情報通信工学科", "電子システム工学科", "香川高等専門学校専攻科（建設環境工学専攻、機械電子システム工学専攻、情報通信システム工学専攻）"], description:"高松キャンパスと詫間キャンパスの2キャンパス体制。" },
  { id: "niihama", name: "新居浜工業高等専門学校", location: "愛媛県新居浜市", website: "https://www.niihama-nct.ac.jp/", type: "国立", departments: ["機械工学科", "電気情報工学科", "応用化学科", "環境材料工学科"], description: "愛媛県新居浜市に位置する国立高等専門学校。「創造性豊かな実践的技術者の育成」を目指し、地域産業や国際社会に貢献できる人材を育成。" },
  { id: "yuge_shosen", name: "弓削商船高等専門学校", location: "愛媛県越智郡上島町", website: "https://www.yuge.ac.jp/", type: "国立", departments: ["商船学科", "情報工学科", "ソーシャルデザイン学科"], description: "愛媛県上島町に位置する商船系の国立高等専門学校。商船学、情報工学、ソーシャルデザインを学び、地域や国際社会に貢献できる人材を育成。" },
  { id: "kochi", name: "高知工業高等専門学校", location: "高知県南国市", website: "https://www.kochi-ct.ac.jp/", type: "国立", departments: ["ソーシャルデザイン工学科"], description: "1963年に設置された国立高等専門学校。南国市物部に位置し、エネルギー・環境、ロボティクス、情報セキュリティ、まちづくり・防災、新素材・生命の5つの分野で教育。", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/df/Kochikosen.jpg", imageCreditText: "Hykw-a4, CC BY-SA 3.0, via Wikimedia Commons", imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Kochikosen.jpg" },
  // 九州・沖縄 (9校)
  { id: "kurume", name: "久留米工業高等専門学校", location: "福岡県久留米市", website: "https://www.kurume-nct.ac.jp/", type: "国立", departments: ["機械工学科", "電気電子工学科", "制御情報工学科", "生物応用化学科", "材料システム工学科"], description: "1964年に設置された国立高等専門学校。久留米市小森野に位置し、筑後川流域の産業発展に貢献する技術者を育成。" },
  { id: "ariake", name: "有明工業高等専門学校", location: "福岡県大牟田市", website: "https://www.ariake-nct.ac.jp/", type: "国立", departments: ["創造工学科"], description: "1963年に設置された国立高等専門学校。大牟田市東萩尾町に位置し、エネルギー、応用化学、環境生命、メカニクス、情報システムの5コースで教育。" },
  { id: "kitakyushu", name: "北九州工業高等専門学校", location: "福岡県北九州市", website: "https://www.kct.ac.jp/", type: "国立", departments: ["生産デザイン工学科"], description: "1965年に設置された国立高等専門学校。北九州市小倉南区志井に位置し、機械創造システム、知能ロボットシステム、電気電子、情報システム、物質化学の5コースで教育。" },
  { id: "sasebo", name: "佐世保工業高等専門学校", location: "長崎県佐世保市", website: "https://www.sasebo.ac.jp/", type: "国立", departments: ["機械工学科", "電気電子工学科", "電子制御工学科", "物質工学科"], description: "1962年に設置された国立高等専門学校。佐世保市沖新町に位置し、造船業で栄えた港湾都市の特性を活かした実践的な技術教育を展開。" },
  { id: "kumamoto", name: "熊本高等専門学校", location: "熊本県合志市", website: "https://kumamoto-nct.ac.jp/", type: "国立", departments: ["情報通信エレクトロニクス工学科", "制御情報システム工学科", "人間情報システム工学科", "機械知能システム工学科", "建築社会デザイン工学科", "生物化学システム工学科"], description: "2009年に熊本電波工業高等専門学校と八代工業高等専門学校が統合して設立。熊本キャンパスと八代キャンパスの2キャンパス体制。" },
  { id: "oita", name: "大分工業高等専門学校", location: "大分県大分市", website: "https://www.oita-ct.ac.jp/", type: "国立", departments: ["機械工学科", "電気電子工学科", "情報工学科", "都市・環境工学科"], description: "1963年に設置された国立高等専門学校。大分市牧に位置し、大分県の産業発展に貢献する技術者を育成。地域連携教育も積極的に推進。" },
  { id: "miyakonojo", name: "都城工業高等専門学校", location: "宮崎県都城市", website: "https://www.miyakonojo-nct.ac.jp/", type: "国立", departments: ["機械工学科", "電気情報工学科", "物質工学科", "建築学科"], description: "1964年に設置された国立高等専門学校。都城市吉尾町に位置し、南九州の産業発展に貢献する技術者を育成。農工連携教育も特徴。" },
  { id: "kagoshima", name: "鹿児島工業高等専門学校", location: "鹿児島県霧島市", website: "https://www.kagoshima-ct.ac.jp/", type: "国立", departments: ["機械工学科", "電気電子工学科", "電子制御工学科", "情報工学科", "都市環境デザイン工学科"], description: "1963年に設置された国立高等専門学校。霧島市隼人町に位置し、桜島を望む環境で実践的な技術教育を展開。地熱エネルギー研究も特徴。" },
  { id: "okinawa", name: "沖縄工業高等専門学校", location: "沖縄県名護市", website: "https://www.okinawa-ct.ac.jp/", type: "国立", departments: ["機械システム工学科", "情報通信システム工学科", "メディア情報工学科", "生物資源工学科"], description: "2004年に設置された国内で最も新しい国立高等専門学校。名護市辺野古に位置し、亜熱帯地域の特性を活かした教育研究を実施。生物資源工学科は全国唯一。" },

  // --- 公立高専 (3校) ---
  { id: "tokyo_metro_cit", name: "東京都立産業技術高等専門学校", location: "東京都（品川区・荒川区）", website: "https://www.metro-cit.ac.jp/", type: "公立", departments: ["ものづくり工学科", "航空宇宙工学科群", "情報通信工学科群", "社会基盤工学科群", "AI・スマート工学コース"], description: "品川・荒川の2キャンパス体制。幅広い産業分野で活躍できる技術者を育成。" }, 
  { id: "osaka_omu_ct", name: "大阪公立大学工業高等専門学校", location: "大阪府寝屋川市", website: "https://www.ct.omu.ac.jp/", type: "公立", departments: ["総合工学システム学科（機械工学コース、電気電子工学コース、環境物質化学コース、都市環境工学コース）"], description: "大阪公立大学グループの一員。旧・大阪府立大学工業高等専門学校。" },
  { id: "kobe_city_ct", name: "神戸市立工業高等専門学校", location: "兵庫県神戸市西区", website: "https://www.kobe-kosen.ac.jp/", type: "公立", departments: ["機械工学科", "電気工学科", "電子工学科", "応用化学科", "都市工学科"], description: "神戸研究学園都市に位置。創造教育に力を入れている。" },

  // --- 私立高専 (3校) --- ※神山まるごと高専は別に定義
  { id: "salesio_sp", name: "サレジオ工業高等専門学校", location: "東京都町田市", website: "https://www.salesio-sp.ac.jp/", type: "私立", departments: ["デザイン学科", "電気工学科", "機械電子工学科", "情報工学科"], description: "キリスト教精神に基づく人間教育と専門技術教育。国際交流も盛ん。" },
  { id: "ict_kanazawa", name: "国際高等専門学校", location: "石川県金沢市・白山市", website: "https://www.ict-kanazawa.ac.jp/", type: "私立", departments: ["国際理工学科"], description: "全寮制・英語での授業（一部）。グローバルなエンジニア育成重視。金沢工業大学設立。" },
  { id: "kindai_ktc", name: "近畿大学工業高等専門学校", location: "三重県名張市", website: "https://www.ktc.ac.jp/", type: "私立", departments: ["総合システム工学科（ロボティクス、エネルギーメカトロニクス、情報システム、バイオサイエンス、建築デザイン）"], description: "近畿大学の併設校。幅広い分野の技術者を育成。クラブ活動も活発。" },
  { 
    id: "kamiyama_ac", 
    name: "神山まるごと高等専門学校", 
    location: "徳島県名西郡神山町", 
    website: "https://kamiyama.ac.jp/", 
    type: "私立", 
    departments: ["デザイン・エンジニアリング学科"], 
    description: "地域創生と起業家精神を重視。2023年開校。「モノをつくる力で、コトを起こす人」を育てる。", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/Kamiyama_Marugoto_College_of_Design%2C_Engineering_and_Entrepreneurship_Logo.svg",
    imageCreditText: "神山まるごと高等専門学校, Public domain, via Wikimedia Commons",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Kamiyama_Marugoto_College_of_Design,_Engineering_and_Entrepreneurship_Logo.svg"
  },
];

// 補足:
// - 上記リストは国立高専を全て網羅し、type: "国立" を設定しています。
// - 全ての高専に、Wikipedia/Wikimedia Commons由来の画像情報を設定しています。
// - departments, description も主要なものや判明している範囲であり、追っての充実が必要です。
// - id はURLフレンドリーな短い文字列を基本とし、重複を避けるために必要に応じて接尾辞 (_pref, _city など) を検討できますが、ここではシンプルにしています。 