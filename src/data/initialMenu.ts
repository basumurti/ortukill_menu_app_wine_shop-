import { Product } from '../types/menu';

export const STORE_INFO = {
  name: 'ORTUKILL KEDIRI - ATLAS AMER KEDIRI',
  subtitle: 'ORANG TUA KELILING KEDIRI',
  tagline: 'MELAYANI SETIAP KEBUTUHAN MINUM LUCU KAMU',
  phone: '087779779796',
  waNumber: '6287779779796',
  promoBanner: 'GRATIS ONGKIR RADIUS 10KM',
  address: 'Kediri, Jawa Timur',
  city: 'Kediri',
  operatingHours: '24 HOURS',
  defaultLocation: {
    lat: -7.80925,
    lng: 112.022222,
    address: 'Ortukill ATLAS AMER KEDIRI, Kediri'
  }
};

export const INITIAL_PRODUCTS: Product[] = [
  // --- ANGGUR CATEGORY ---
  {
    id: 'AMG-620',
    sku: 'AMG-620',
    name: 'ANGGUR MERAH GOLD 620ML',
    category: 'ANGGUR',
    abv: '19.7%',
    volume: '620ML',
    regularPrice: 88000,
    redPrice: 83000,
    stock: 48,
    description: 'Anggur Merah Gold fermentasi buah anggur pilihan berkualitas tinggi.',
    isPromo: true
  },
  {
    id: 'AKKT-620',
    sku: 'AKKT-620',
    name: 'ANGGUR KOLESOM TINGGI KUNING 620ML',
    category: 'ANGGUR',
    abv: '19.7%',
    volume: '620ML',
    regularPrice: 83000,
    redPrice: 78000,
    stock: 36,
    description: 'Anggur kolesom tradisional kaya rasa dan kehangatan khas Orang Tua.'
  },
  {
    id: 'AP-620',
    sku: 'AP-620',
    name: 'ANGGUR PUTIH 620ML',
    category: 'ANGGUR',
    abv: '14.7%',
    volume: '620ML',
    regularPrice: 80000,
    redPrice: 75000,
    stock: 30,
    description: 'Anggur putih manis segar cocok untuk dinikmati santai.'
  },
  {
    id: 'ATL-PCH',
    sku: 'ATL-PCH',
    name: 'ATLAS PEACH 620ML',
    category: 'ANGGUR',
    abv: '19.7%',
    volume: '620ML',
    regularPrice: 88000,
    redPrice: 83000,
    stock: 25,
    description: 'Sensasi rasa persik manis dan aroma buah segar khas Atlas.'
  },
  {
    id: 'ATL-STR',
    sku: 'ATL-STR',
    name: 'ATLAS STRAWBERRY 620ML',
    category: 'ANGGUR',
    abv: '19.7%',
    volume: '620ML',
    regularPrice: 88000,
    redPrice: 83000,
    stock: 28,
    description: 'Aroma strawberry asam manis menyegarkan dalam tiap tegukan.'
  },
  {
    id: 'ATL-LYC',
    sku: 'ATL-LYC',
    name: 'ATLAS LYCHEE 620ML',
    category: 'ANGGUR',
    abv: '19.7%',
    volume: '620ML',
    regularPrice: 88000,
    redPrice: 83000,
    stock: 32,
    description: 'Pilihan favorit rasa kelengkeng/lychee segar dan nikmat.'
  },
  {
    id: 'API-HIJ',
    sku: 'API-HIJ',
    name: 'ANGGUR API HIJAU 620ML',
    category: 'ANGGUR',
    abv: '19.7%',
    volume: '620ML',
    regularPrice: 93000,
    redPrice: 88000,
    stock: 20,
    description: 'Anggur Api Hijau dengan cita rasa mantap dan berkarakter.'
  },
  {
    id: 'API-BLK',
    sku: 'API-BLK',
    name: 'ANGGUR API BLACKCURRANT 620ML',
    category: 'ANGGUR',
    abv: '19.7%',
    volume: '620ML',
    regularPrice: 93000,
    redPrice: 88000,
    stock: 22,
    description: 'Rasa gurih manis blackcurrant yang berani.'
  },
  {
    id: 'KK-HIJ',
    sku: 'KK-HIJ',
    name: 'KAWA KAWA ANGGUR HIJAU 620ML',
    category: 'ANGGUR',
    abv: '19.7%',
    volume: '620ML',
    regularPrice: 93000,
    redPrice: 88000,
    stock: 40,
    description: 'Kawa Kawa Anggur Hijau favorit tongkrongan.'
  },
  {
    id: 'KK-MER',
    sku: 'KK-MER',
    name: 'KAWA KAWA ANGGUR MERAH 620ML',
    category: 'ANGGUR',
    abv: '19.7%',
    volume: '620ML',
    regularPrice: 88000,
    redPrice: 83000,
    stock: 45,
    description: 'Kawa Kawa Merah rasa manis legendaris.'
  },
  {
    id: 'ALX-BLK',
    sku: 'ALX-BLK',
    name: 'ALEXIS BLACKCURRANT 620ML',
    category: 'ANGGUR',
    abv: '19.7%',
    volume: '620ML',
    regularPrice: 88000,
    redPrice: 83000,
    stock: 18,
    description: 'Alexis varian Blackcurrant dengan karakter lembut.'
  },
  {
    id: 'ALX-LYC',
    sku: 'ALX-LYC',
    name: 'ALEXIS LYCHEE 620ML',
    category: 'ANGGUR',
    abv: '19.7%',
    volume: '620ML',
    regularPrice: 88000,
    redPrice: 83000,
    stock: 20,
    description: 'Alexis varian Lychee rasa manis buah asli.'
  },
  {
    id: 'ALX-HIJ',
    sku: 'ALX-HIJ',
    name: 'ALEXIS ANGGUR HIJAU 620ML',
    category: 'ANGGUR',
    abv: '19.7%',
    volume: '620ML',
    regularPrice: 93000,
    redPrice: 88000,
    stock: 19,
    description: 'Alexis Anggur Hijau dengan kesegaran maksimal.'
  },
  {
    id: 'SJR-ARK',
    sku: 'SJR-ARK',
    name: 'SINGARAJA ARAK 620ML',
    category: 'ANGGUR',
    abv: '19.7%',
    volume: '620ML',
    regularPrice: 85000,
    redPrice: 81000,
    stock: 24,
    description: 'Singaraja Arak ramuan khas Bali berkualitas tinggi.'
  },
  {
    id: 'INT-ANG',
    sku: 'INT-ANG',
    name: 'INTISARI ANGGUR 620ML',
    category: 'ANGGUR',
    abv: '17.5%',
    volume: '620ML',
    regularPrice: 65000,
    redPrice: 60000,
    stock: 50,
    description: 'Intisari Anggur minuman herbal hangat tradisional Indonesia.'
  },

  // --- BIR & VODKA MIX CATEGORY ---
  {
    id: 'SJR-620',
    sku: 'SJR-620',
    name: 'SINGARAJA 620ML',
    category: 'BIR & VODKA MIX',
    abv: '4.8%',
    volume: '620ML',
    regularPrice: 45000,
    redPrice: 41000,
    stock: 60,
    description: 'Bir Singaraja botol besar dingin dan mantap.'
  },
  {
    id: 'PRT-LGR',
    sku: 'PRT-LGR',
    name: 'PROST LAGER 620ML',
    category: 'BIR & VODKA MIX',
    abv: '4.8%',
    volume: '620ML',
    regularPrice: 52000,
    redPrice: 47000,
    stock: 40,
    description: 'Prost Lager malt bir berkualitas ekspor.'
  },
  {
    id: 'PRT-ALS',
    sku: 'PRT-ALS',
    name: 'PROST ALSTER LYCHEE 330ML',
    category: 'BIR & VODKA MIX',
    abv: '4.8%',
    volume: '330ML',
    regularPrice: 33000,
    redPrice: 29000,
    stock: 35,
    description: 'Prost Alster rasa lychee ringan dan menyegarkan.'
  },
  {
    id: 'SJR-KLG',
    sku: 'SJR-KLG',
    name: 'SINGARAJA KALENG 500ML',
    category: 'BIR & VODKA MIX',
    abv: '4.8%',
    volume: '500ML',
    regularPrice: 33000,
    redPrice: 29000,
    stock: 50,
    description: 'Singaraja kaleng tinggi praktis dibawa nongkrong.'
  },
  {
    id: 'SJR-JM',
    sku: 'SJR-JM',
    name: 'SINGARAJA ARAK JERUK MADU 330ML',
    category: 'BIR & VODKA MIX',
    abv: '4.8%',
    volume: '330ML',
    regularPrice: 33000,
    redPrice: 29000,
    stock: 30,
    description: 'Singaraja Arak racikan manis Jeruk Madu.'
  },
  {
    id: 'ICL-BER',
    sku: 'ICL-BER',
    name: 'ICELAND MIX BERRY LEMONADE 275ML',
    category: 'BIR & VODKA MIX',
    abv: '4.8%',
    volume: '275ML',
    regularPrice: 33000,
    redPrice: 29000,
    stock: 40,
    description: 'Iceland Mix rasa Berry Lemonade asam manis dingin.'
  },
  {
    id: 'ICL-BLU',
    sku: 'ICL-BLU',
    name: 'ICELAND MIX BLUE LAGOON 275ML',
    category: 'BIR & VODKA MIX',
    abv: '4.8%',
    volume: '275ML',
    regularPrice: 33000,
    redPrice: 29000,
    stock: 40,
    description: 'Iceland Mix rasa Blue Lagoon eksotis segar.'
  },
  {
    id: 'ICL-ESP',
    sku: 'ICL-ESP',
    name: 'ICELAND MIX ESPRESSO MARTINI 275ML',
    category: 'BIR & VODKA MIX',
    abv: '4.8%',
    volume: '275ML',
    regularPrice: 33000,
    redPrice: 29000,
    stock: 35,
    description: 'Kombinasi rasa kopi espresso martini khas Iceland.'
  },
  {
    id: 'ICL-KAM',
    sku: 'ICL-KAM',
    name: 'ICELAND MIX KAMIKAZE 275ML',
    category: 'BIR & VODKA MIX',
    abv: '4.8%',
    volume: '275ML',
    regularPrice: 33000,
    redPrice: 29000,
    stock: 35,
    description: 'Iceland Mix Kamikaze dengan jeruk nipis menyegarkan.'
  },
  {
    id: 'ICL-LNG',
    sku: 'ICL-LNG',
    name: 'ICELAND MIX LONG ISLAND 275ML',
    category: 'BIR & VODKA MIX',
    abv: '4.8%',
    volume: '275ML',
    regularPrice: 33000,
    redPrice: 29000,
    stock: 38,
    description: 'Iceland Mix Long Island cocktail siap minum.'
  },
  {
    id: 'ICL-LYC',
    sku: 'ICL-LYC',
    name: 'ICELAND MIX LYCHEE MARTINI 275ML',
    category: 'BIR & VODKA MIX',
    abv: '4.8%',
    volume: '275ML',
    regularPrice: 33000,
    redPrice: 29000,
    stock: 42,
    description: 'Iceland Mix Lychee Martini aroma buah lembut.'
  },
  {
    id: 'KNG-DNK',
    sku: 'KNG-DNK',
    name: 'KÖNIG LUDWIG DUNKEL 620ML',
    category: 'BIR & VODKA MIX',
    abv: '4.8%',
    volume: '620ML',
    regularPrice: 68000,
    redPrice: 62000,
    stock: 15,
    description: 'Bir hitam Jerman premium König Ludwig Dunkel.'
  },
  {
    id: 'BTN-PIL',
    sku: 'BTN-PIL',
    name: 'BINTANG PILSENER 620ML',
    category: 'BIR & VODKA MIX',
    abv: '4.8%',
    volume: '620ML',
    regularPrice: 55000,
    redPrice: 50000,
    stock: 50,
    description: 'Bir Bintang Pilsener klasik Indonesia botol besar.'
  },

  // --- SOJU CATEGORY ---
  {
    id: 'BS-ORI',
    sku: 'BSP-ORI',
    name: 'BAE SOJU ORIGINAL 360ML',
    category: 'SOJU',
    abv: '13.0%',
    volume: '360ML',
    regularPrice: 60000,
    redPrice: 55000,
    stock: 30,
    description: 'Soju Bae Original rasa murni khas Korea.'
  },
  {
    id: 'BS-LYC',
    sku: 'BSL-LYC',
    name: 'BAE SOJU LYCHEE 360ML',
    category: 'SOJU',
    abv: '13.0%',
    volume: '360ML',
    regularPrice: 60000,
    redPrice: 55000,
    stock: 25,
    description: 'Soju Bae rasa Lychee manis favorit.'
  },

  // --- WHISKY CATEGORY ---
  {
    id: 'DWR-350',
    sku: 'DWR-350',
    name: 'DRUM WHISKY 350ML',
    category: 'WHISKY',
    abv: '43.0%',
    volume: '350ML',
    regularPrice: 95000,
    redPrice: 90000,
    stock: 20,
    description: 'Drum Whisky Oak Aged rasa hangat mantap.'
  },

  // --- RUM & VODKA CATEGORY ---
  {
    id: 'CMS-750',
    sku: 'CMS-750',
    name: 'CAPTAIN MORGAN SPICED RUM 750ML',
    category: 'RUM',
    abv: '35.0%',
    volume: '750ML',
    regularPrice: 220000,
    redPrice: 205000,
    stock: 12,
    description: 'Captain Morgan Spiced Gold Rum impor.'
  },
  {
    id: 'IVM-500',
    sku: 'IVM-500',
    name: 'ICELAND VODKA 500ML',
    category: 'VODKA',
    abv: '40.0%',
    volume: '500ML',
    regularPrice: 110000,
    redPrice: 100000,
    stock: 25,
    description: 'Iceland Vodka triple distilled mulus tanpa bikin pusing.'
  },

  // --- JAMU & PROMO ---
  {
    id: 'BK-620',
    sku: 'BK-620',
    name: 'BERAS KENCUR ORTUKILL 620ML',
    category: 'JAMU',
    abv: '14.7%',
    volume: '620ML',
    regularPrice: 70000,
    redPrice: 65000,
    stock: 15,
    description: 'Beras Kencur tradisional resep leluhur Orang Tua.'
  },
  {
    id: 'PROMO-DUO',
    sku: 'PROMO-01',
    name: 'PAKET PROMO DUO AMER GOLD (2 BOTOL)',
    category: 'PROMO',
    abv: '19.7%',
    volume: '2x 620ML',
    regularPrice: 176000,
    redPrice: 160000,
    stock: 10,
    description: 'Hemat Rp 16.000! Paket 2 botol Anggur Merah Gold 620ml.',
    isPromo: true
  }
];

export const CATEGORIES = [
  'SEMUA',
  'ANGGUR',
  'BIR & VODKA MIX',
  'SOJU',
  'WHISKY',
  'RUM',
  'VODKA',
  'JAMU',
  'PROMO'
] as const;
