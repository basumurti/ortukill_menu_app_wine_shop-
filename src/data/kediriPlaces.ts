export interface KediriPlace {
  id: string;
  name: string;
  category: 'Landmark' | 'Kecamatan' | 'Mall & Pasar' | 'Rumah Sakit' | 'Kampus' | 'Transportasi' | 'Pondok Pesantren' | 'Wisata & Taman' | 'Kelurahan' | 'Hotel & Penginapan';
  district: string;
  areaType: 'Kota' | 'Kabupaten';
  lat: number;
  lng: number;
  aliases: string[];
}

export const KEDIRI_PLACES: KediriPlace[] = [
  // --- LANDMARKS POPULER ---
  {
    id: 'slg',
    name: 'Simpang Lima Gumul (SLG)',
    category: 'Landmark',
    district: 'Ngasem',
    areaType: 'Kabupaten',
    lat: -7.8176,
    lng: 112.0722,
    aliases: ['slg', 'gumul', 'monumen simpang lima', 'ngasem']
  },
  {
    id: 'alun-alun-kota',
    name: 'Alun-Alun Kota Kediri',
    category: 'Landmark',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8175,
    lng: 112.0125,
    aliases: ['alun alun', 'masjid agung kediri', 'alun2', 'pusat kota']
  },
  {
    id: 'taman-sekartaji',
    name: 'Taman Sekartaji',
    category: 'Wisata & Taman',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8118,
    lng: 112.0006,
    aliases: ['sekartaji', 'taman mojoroto', 'veteran']
  },
  {
    id: 'taman-brantas',
    name: 'Taman Brantas & Jembatan Brawijaya',
    category: 'Wisata & Taman',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8136,
    lng: 112.0078,
    aliases: ['brantas', 'jembatan brawijaya', 'sungai brantas']
  },
  {
    id: 'gor-jayabaya',
    name: 'GOR Jayabaya Kota Kediri',
    category: 'Landmark',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8341,
    lng: 111.9798,
    aliases: ['gor jayabaya', 'gedung olahraga', 'banjarmlati']
  },
  {
    id: 'stadion-brawijaya',
    name: 'Stadion Brawijaya (Persik Kediri)',
    category: 'Landmark',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8087,
    lng: 112.0195,
    aliases: ['brawijaya', 'stadion persik', 'lapangan persik']
  },
  {
    id: 'goa-selomangleng',
    name: 'Goa Selomangleng & Museum Airlangga',
    category: 'Wisata & Taman',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8164,
    lng: 111.9678,
    aliases: ['selomangleng', 'goa', 'airlangga', 'klotok', 'gunung klotok']
  },

  // --- TRANSPORTASI UTAMA ---
  {
    id: 'bandara-dhoho',
    name: 'Bandara Internasional Dhoho Kediri (DHX)',
    category: 'Transportasi',
    district: 'Grogol / Tarokan',
    areaType: 'Kabupaten',
    lat: -7.7842,
    lng: 111.9427,
    aliases: ['bandara dhoho', 'airport', 'bandara grogol', 'tarokan', 'pesawat']
  },
  {
    id: 'stasiun-kediri',
    name: 'Stasiun Kereta Api Kediri',
    category: 'Transportasi',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8166,
    lng: 112.0163,
    aliases: ['stasiun kediri', 'kereta api', 'kai kediri', 'balowerti']
  },
  {
    id: 'terminal-tamanan',
    name: 'Terminal Bus Tamanan Kota Kediri',
    category: 'Transportasi',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8282,
    lng: 111.9897,
    aliases: ['terminal tamanan', 'terminal bus', 'tamanan']
  },
  {
    id: 'stasiun-papar',
    name: 'Stasiun Papar',
    category: 'Transportasi',
    district: 'Papar',
    areaType: 'Kabupaten',
    lat: -7.7126,
    lng: 112.0792,
    aliases: ['stasiun papar', 'papar']
  },

  // --- MALL & PUSAT PERBELANJAAN ---
  {
    id: 'ketos',
    name: 'Kediri Town Square (Ketos / Matahari)',
    category: 'Mall & Pasar',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8202,
    lng: 112.0229,
    aliases: ['ketos', 'kediri town square', 'matahari', 'hypermart', 'hasanudin']
  },
  {
    id: 'kediri-mall',
    name: 'Kediri Mall (Sri Ratu)',
    category: 'Mall & Pasar',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8179,
    lng: 112.0191,
    aliases: ['kediri mall', 'sri ratu', 'hayam wuruk']
  },
  {
    id: 'dhoho-plaza',
    name: 'Dhoho Plaza Kediri',
    category: 'Mall & Pasar',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8197,
    lng: 112.0135,
    aliases: ['dhoho plaza', 'plaza dhoho']
  },
  {
    id: 'pasar-pahing',
    name: 'Pasar Pahing Kediri',
    category: 'Mall & Pasar',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8160,
    lng: 112.0210,
    aliases: ['pasar pahing', 'pahing']
  },
  {
    id: 'pasar-setono-betek',
    name: 'Pasar Setono Betek',
    category: 'Mall & Pasar',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8239,
    lng: 112.0139,
    aliases: ['setono betek', 'pasar betek']
  },
  {
    id: 'pasar-grosir-ngronggo',
    name: 'Pasar Grosir Ngronggo',
    category: 'Mall & Pasar',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8398,
    lng: 112.0225,
    aliases: ['pasar ngronggo', 'grosir ngronggo', 'buah sayur']
  },
  {
    id: 'pasar-bandar',
    name: 'Pasar Bandar Kediri',
    category: 'Mall & Pasar',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8205,
    lng: 112.0042,
    aliases: ['pasar bandar', 'bandar lor']
  },

  // --- RUMAH SAKIT UTAMA ---
  {
    id: 'rsud-gambiran-baru',
    name: 'RSUD Gambiran Baru (Pakunden)',
    category: 'Rumah Sakit',
    district: 'Pesantren',
    areaType: 'Kota',
    lat: -7.8445,
    lng: 112.0335,
    aliases: ['rsud gambiran', 'gambiran 2', 'gambiran baru', 'pakunden']
  },
  {
    id: 'rsud-gambiran-lama',
    name: 'RSUD Gambiran Lama (Jl. KH Wachid Hasyim)',
    category: 'Rumah Sakit',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8210,
    lng: 112.0005,
    aliases: ['gambiran lama', 'gambiran 1', 'wachid hasyim']
  },
  {
    id: 'rsud-slg',
    name: 'RSUD Simpang Lima Gumul (RSUD SLG)',
    category: 'Rumah Sakit',
    district: 'Ngasem',
    areaType: 'Kabupaten',
    lat: -7.8080,
    lng: 112.0738,
    aliases: ['rsud slg', 'rs slg', 'rumah sakit gumul']
  },
  {
    id: 'rs-bhayangkara',
    name: 'RS Bhayangkara Kediri',
    category: 'Rumah Sakit',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8105,
    lng: 112.0175,
    aliases: ['bhayangkara', 'rs polri', 'kombes duryat']
  },
  {
    id: 'rs-baptis',
    name: 'RS Baptis Kediri',
    category: 'Rumah Sakit',
    district: 'Pesantren',
    areaType: 'Kota',
    lat: -7.8385,
    lng: 112.0528,
    aliases: ['baptis', 'rs baptis', 'bangsal']
  },
  {
    id: 'rs-dkt',
    name: 'Rumkitban DKT Tingkat IV Kediri',
    category: 'Rumah Sakit',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8142,
    lng: 112.0128,
    aliases: ['dkt', 'rs tentara', 'rumkitban']
  },
  {
    id: 'rs-lirboyo',
    name: 'RS Lirboyo Kediri',
    category: 'Rumah Sakit',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8055,
    lng: 111.9862,
    aliases: ['rs lirboyo', 'rumah sakit lirboyo']
  },
  {
    id: 'rs-hva-pare',
    name: 'RS HVA Toeloengredjo Pare',
    category: 'Rumah Sakit',
    district: 'Pare',
    areaType: 'Kabupaten',
    lat: -7.7650,
    lng: 112.1895,
    aliases: ['hva', 'rs hva', 'toeloengredjo', 'pare']
  },
  {
    id: 'rs-amelia-pare',
    name: 'RS Amelia Pare',
    category: 'Rumah Sakit',
    district: 'Pare',
    areaType: 'Kabupaten',
    lat: -7.7785,
    lng: 112.1932,
    aliases: ['amelia', 'rs amelia', 'pare']
  },

  // --- KAMPUS & PENDIDIKAN ---
  {
    id: 'unp-kampus1',
    name: 'Universitas Nusantara PGRI (UNP) Kampus 1',
    category: 'Kampus',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8090,
    lng: 111.9965,
    aliases: ['unp', 'kampus 1 unp', 'ahmad dahlan', 'pgri']
  },
  {
    id: 'unp-kampus2',
    name: 'UNP Kediri Kampus 2',
    category: 'Kampus',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8065,
    lng: 111.9915,
    aliases: ['unp kampus 2', 'mojoroto']
  },
  {
    id: 'iain-kediri',
    name: 'IAIN Kediri (Kampus Ngronggo / Sunan Ampel)',
    category: 'Kampus',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8425,
    lng: 112.0235,
    aliases: ['iain', 'uin kediri', 'ngronggo', 'sunan ampel', 'stain']
  },
  {
    id: 'unik-kediri',
    name: 'Universitas Kadiri (UNIK Selomangleng)',
    category: 'Kampus',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8185,
    lng: 111.9772,
    aliases: ['unik', 'universitas kadiri', 'selomangleng']
  },
  {
    id: 'iik-bhakti-wiyata',
    name: 'IIK Bhakti Wiyata Kediri (Institut Ilmu Kesehatan)',
    category: 'Kampus',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8190,
    lng: 111.9998,
    aliases: ['iik', 'bhakti wiyata', 'kesehatan', 'wahid hasyim']
  },
  {
    id: 'kampung-inggris-pare',
    name: 'Kampung Inggris Pare (Jl. Brawijaya / Tulungrejo)',
    category: 'Wisata & Taman',
    district: 'Pare',
    areaType: 'Kabupaten',
    lat: -7.7660,
    lng: 112.1880,
    aliases: ['kampung inggris', 'tulungrejo', 'brawijaya pare', 'kursus inggris']
  },

  // --- PONDOK PESANTREN BESAR ---
  {
    id: 'ponpes-lirboyo',
    name: 'Pondok Pesantren Lirboyo',
    category: 'Pondok Pesantren',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8048,
    lng: 111.9835,
    aliases: ['lirboyo', 'ponpes lirboyo', 'pesantren lirboyo', 'santri']
  },
  {
    id: 'ponpes-wali-barokah',
    name: 'Pondok Pesantren Wali Barokah (LDII Burengan)',
    category: 'Pondok Pesantren',
    district: 'Pesantren',
    areaType: 'Kota',
    lat: -7.8285,
    lng: 112.0295,
    aliases: ['wali barokah', 'burengan', 'menara asmaul husna', 'ldii']
  },
  {
    id: 'ponpes-ploso',
    name: 'Pondok Pesantren Al-Falah Ploso',
    category: 'Pondok Pesantren',
    district: 'Mojo',
    areaType: 'Kabupaten',
    lat: -7.8920,
    lng: 111.9680,
    aliases: ['ploso', 'al falah ploso', 'mojo', 'ponpes ploso']
  },

  // --- HOTEL & PENGINAPAN DI KEDIRI ---
  {
    id: 'hotel-grand-surya',
    name: 'Grand Surya Hotel Kediri (Jl. Dhoho)',
    category: 'Hotel & Penginapan',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8210,
    lng: 112.0135,
    aliases: ['grand surya', 'hotel grand surya', 'surya hotel', 'jl dhoho', 'hotel bintang 4']
  },
  {
    id: 'hotel-favehotel-slg',
    name: 'favehotel Simpang Lima Gumul Kediri',
    category: 'Hotel & Penginapan',
    district: 'Ngasem',
    areaType: 'Kabupaten',
    lat: -7.8170,
    lng: 112.0650,
    aliases: ['favehotel', 'fave hotel slg', 'fave gumul', 'erlangga tugurejo', 'hotel slg']
  },
  {
    id: 'hotel-lotus-garden',
    name: 'Lotus Garden Hotel Kediri by Waringin',
    category: 'Hotel & Penginapan',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8125,
    lng: 112.0035,
    aliases: ['lotus garden', 'hotel lotus', 'jaksa agung suprapto', 'waringin']
  },
  {
    id: 'hotel-viva-front-one',
    name: 'Viva Hotel Kediri by Front One',
    category: 'Hotel & Penginapan',
    district: 'Pesantren',
    areaType: 'Kota',
    lat: -7.8340,
    lng: 112.0400,
    aliases: ['viva hotel', 'front one viva', 's parman', 'hotel pesantren']
  },
  {
    id: 'hotel-insumo-palace',
    name: 'Insumo Palace Hotel & Club',
    category: 'Hotel & Penginapan',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8285,
    lng: 112.0120,
    aliases: ['insumo', 'insumo palace', 'urip sumoharjo', 'hotel insumo']
  },
  {
    id: 'hotel-bukit-daun',
    name: 'Bukit Daun Hotel & Resort Kediri',
    category: 'Hotel & Penginapan',
    district: 'Semen',
    areaType: 'Kabupaten',
    lat: -7.8320,
    lng: 111.9620,
    aliases: ['bukit daun', 'resort bukit daun', 'argopuro semen', 'hotel bukit daun']
  },
  {
    id: 'hotel-front-one-inn',
    name: 'Front One Inn Kediri',
    category: 'Hotel & Penginapan',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8185,
    lng: 112.0280,
    aliases: ['front one inn', 'hotel front one', 'erlangga kediri']
  },
  {
    id: 'hotel-coconut',
    name: 'Coconut Hotel Kediri',
    category: 'Hotel & Penginapan',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8235,
    lng: 111.9880,
    aliases: ['coconut hotel', 'hotel kelapa', 'suparjan mangun wijaya']
  },
  {
    id: 'hotel-merdeka',
    name: 'Merdeka Hotel Kediri',
    category: 'Hotel & Penginapan',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8160,
    lng: 112.0120,
    aliases: ['hotel merdeka', 'merdeka', 'basuki rahmat', 'balai kota']
  },
  {
    id: 'hotel-citihub',
    name: 'Citihub Hotel @ Kediri',
    category: 'Hotel & Penginapan',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8180,
    lng: 112.0180,
    aliases: ['citihub', 'citihub hotel', 'joyoboyo']
  },
  {
    id: 'hotel-votel-charis',
    name: 'Votel Charis Hotel Kediri',
    category: 'Hotel & Penginapan',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8200,
    lng: 112.0140,
    aliases: ['votel charis', 'hotel charis', 'dhoho']
  },
  {
    id: 'hotel-penataran',
    name: 'Hotel Penataran Kediri',
    category: 'Hotel & Penginapan',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8220,
    lng: 112.0130,
    aliases: ['hotel penataran', 'penataran', 'dhoho']
  },
  {
    id: 'hotel-de-pratitha',
    name: 'De Pratitha Hotel Kediri',
    category: 'Hotel & Penginapan',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8145,
    lng: 112.0160,
    aliases: ['de pratitha', 'hotel pratitha', 'sriwijaya', 'dekat stasiun']
  },
  {
    id: 'hotel-selomangleng',
    name: 'Hotel Selomangleng Kediri',
    category: 'Hotel & Penginapan',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8180,
    lng: 111.9720,
    aliases: ['hotel selomangleng', 'selomangleng', 'dekat goa']
  },
  {
    id: 'hotel-kediri-semampir',
    name: 'Hotel Kediri (Mayor Bismo)',
    category: 'Hotel & Penginapan',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.7980,
    lng: 112.0130,
    aliases: ['hotel kediri', 'mayor bismo', 'semampir']
  },
  {
    id: 'hotel-crown',
    name: 'Crown Hotel Kediri',
    category: 'Hotel & Penginapan',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.7960,
    lng: 112.0135,
    aliases: ['crown hotel', 'hotel crown', 'mayor bismo']
  },
  {
    id: 'hotel-barito',
    name: 'Hotel Barito Kediri',
    category: 'Hotel & Penginapan',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8240,
    lng: 112.0250,
    aliases: ['hotel barito', 'barito']
  },
  {
    id: 'hotel-surya-asri-pare',
    name: 'Hotel Surya Asri Pare',
    category: 'Hotel & Penginapan',
    district: 'Pare',
    areaType: 'Kabupaten',
    lat: -7.7680,
    lng: 112.1960,
    aliases: ['surya asri', 'hotel surya asri', 'pare', 'pb sudirman']
  },
  {
    id: 'hotel-grand-surya-pare',
    name: 'Grand Surya Hotel Pare',
    category: 'Hotel & Penginapan',
    district: 'Pare',
    areaType: 'Kabupaten',
    lat: -7.7620,
    lng: 112.1920,
    aliases: ['grand surya pare', 'hotel pare', 'kampung inggris']
  },
  {
    id: 'hotel-amanda',
    name: 'Hotel Amanda Kediri',
    category: 'Hotel & Penginapan',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8190,
    lng: 112.0170,
    aliases: ['hotel amanda', 'amanda', 'joyoboyo']
  },

  // --- KECAMATAN / WILAYAH KOTA KEDIRI ---
  {
    id: 'kec-kota',
    name: 'Kecamatan Kota Kediri (Kantor Kecamatan)',
    category: 'Kecamatan',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8180,
    lng: 112.0150,
    aliases: ['kediri kota', 'kecamatan kota', 'pusat kota']
  },
  {
    id: 'kec-mojoroto',
    name: 'Kecamatan Mojoroto',
    category: 'Kecamatan',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8080,
    lng: 111.9960,
    aliases: ['mojoroto', 'barat sungai', 'kediri barat']
  },
  {
    id: 'kec-pesantren',
    name: 'Kecamatan Pesantren',
    category: 'Kecamatan',
    district: 'Pesantren',
    areaType: 'Kota',
    lat: -7.8420,
    lng: 112.0450,
    aliases: ['pesantren', 'timur kota']
  },
  {
    id: 'kel-mrican',
    name: 'Kelurahan Mrican / PG Mrican',
    category: 'Kelurahan',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.7850,
    lng: 111.9965,
    aliases: ['mrican', 'pg mrican', 'pabrik gula']
  },
  {
    id: 'kel-campurejo',
    name: 'Kelurahan Campurejo',
    category: 'Kelurahan',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8110,
    lng: 111.9910,
    aliases: ['campurejo', 'tamanan utara']
  },
  {
    id: 'kel-sukorame',
    name: 'Kelurahan Sukorame',
    category: 'Kelurahan',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8180,
    lng: 111.9860,
    aliases: ['sukorame', 'veteran barat']
  },
  {
    id: 'kel-bandar-kidul',
    name: 'Kelurahan Bandar Kidul (Pusat Tenun Ikat)',
    category: 'Kelurahan',
    district: 'Mojoroto',
    areaType: 'Kota',
    lat: -7.8260,
    lng: 112.0010,
    aliases: ['bandar kidul', 'tenun ikat bandar']
  },
  {
    id: 'kel-ngadirejo',
    name: 'Kelurahan Ngadirejo',
    category: 'Kelurahan',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8130,
    lng: 112.0230,
    aliases: ['ngadirejo', 'dandangan timur']
  },
  {
    id: 'kel-dandangan',
    name: 'Kelurahan Dandangan (Stadion / Gudang Garam Unit 1)',
    category: 'Kelurahan',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8050,
    lng: 112.0150,
    aliases: ['dandangan', 'gudang garam unit 1']
  },
  {
    id: 'kel-semampir',
    name: 'Kelurahan Semampir (Mayor Bismo)',
    category: 'Kelurahan',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.7950,
    lng: 112.0120,
    aliases: ['semampir', 'mayor bismo']
  },
  {
    id: 'kel-manisrenggo',
    name: 'Kelurahan Manisrenggo',
    category: 'Kelurahan',
    district: 'Kota',
    areaType: 'Kota',
    lat: -7.8480,
    lng: 112.0220,
    aliases: ['manisrenggo', 'ngronggo selatan']
  },
  {
    id: 'kel-singonegaran',
    name: 'Kelurahan Singonegaran',
    category: 'Kelurahan',
    district: 'Pesantren',
    areaType: 'Kota',
    lat: -7.8310,
    lng: 112.0260,
    aliases: ['singonegaran', 'burengan barat']
  },
  {
    id: 'kel-tosaren',
    name: 'Kelurahan Tosaren',
    category: 'Kelurahan',
    district: 'Pesantren',
    areaType: 'Kota',
    lat: -7.8460,
    lng: 112.0400,
    aliases: ['tosaren', 'pesantren barat']
  },
  {
    id: 'kel-blabak',
    name: 'Kelurahan Blabak',
    category: 'Kelurahan',
    district: 'Pesantren',
    areaType: 'Kota',
    lat: -7.8650,
    lng: 112.0450,
    aliases: ['blabak', 'bawang', 'ujung selatan']
  },

  // --- KECAMATAN / WILAYAH KABUPATEN KEDIRI ---
  {
    id: 'kab-ngasem',
    name: 'Kecamatan Ngasem (Kantor Pemkab / Katang)',
    category: 'Kecamatan',
    district: 'Ngasem',
    areaType: 'Kabupaten',
    lat: -7.8050,
    lng: 112.0520,
    aliases: ['ngasem', 'katang', 'pemkab kediri', 'sukorejo']
  },
  {
    id: 'kab-pare',
    name: 'Kecamatan Pare (Pusat Kota Pare)',
    category: 'Kecamatan',
    district: 'Pare',
    areaType: 'Kabupaten',
    lat: -7.7705,
    lng: 112.1950,
    aliases: ['pare', 'kota pare', 'kampung inggris']
  },
  {
    id: 'kab-gurah',
    name: 'Kecamatan Gurah',
    category: 'Kecamatan',
    district: 'Gurah',
    areaType: 'Kabupaten',
    lat: -7.8220,
    lng: 112.1150,
    aliases: ['gurah', 'tugu gurah']
  },
  {
    id: 'kab-gampengrejo',
    name: 'Kecamatan Gampengrejo',
    category: 'Kecamatan',
    district: 'Gampengrejo',
    areaType: 'Kabupaten',
    lat: -7.7720,
    lng: 112.0250,
    aliases: ['gampengrejo', 'jongbiru', 'putih']
  },
  {
    id: 'kab-papar',
    name: 'Kecamatan Papar',
    category: 'Kecamatan',
    district: 'Papar',
    areaType: 'Kabupaten',
    lat: -7.7110,
    lng: 112.0850,
    aliases: ['papar', 'stasiun papar']
  },
  {
    id: 'kab-purwoasri',
    name: 'Kecamatan Purwoasri',
    category: 'Kecamatan',
    district: 'Purwoasri',
    areaType: 'Kabupaten',
    lat: -7.6520,
    lng: 112.1020,
    aliases: ['purwoasri', 'perbatasan jombang']
  },
  {
    id: 'kab-plemahan',
    name: 'Kecamatan Plemahan',
    category: 'Kecamatan',
    district: 'Plemahan',
    areaType: 'Kabupaten',
    lat: -7.7020,
    lng: 112.1450,
    aliases: ['plemahan', 'sukoharjo']
  },
  {
    id: 'kab-kunjang',
    name: 'Kecamatan Kunjang',
    category: 'Kecamatan',
    district: 'Kunjang',
    areaType: 'Kabupaten',
    lat: -7.6750,
    lng: 112.1850,
    aliases: ['kunjang']
  },
  {
    id: 'kab-badas',
    name: 'Kecamatan Badas',
    category: 'Kecamatan',
    district: 'Badas',
    areaType: 'Kabupaten',
    lat: -7.7320,
    lng: 112.2350,
    aliases: ['badas', 'canggu', 'tunglur']
  },
  {
    id: 'kab-kandangan',
    name: 'Kecamatan Kandangan',
    category: 'Kecamatan',
    district: 'Kandangan',
    areaType: 'Kabupaten',
    lat: -7.7650,
    lng: 112.2850,
    aliases: ['kandangan', 'perbatasan malang kasembon']
  },
  {
    id: 'kab-kepung',
    name: 'Kecamatan Kepung',
    category: 'Kecamatan',
    district: 'Kepung',
    areaType: 'Kabupaten',
    lat: -7.8250,
    lng: 112.2550,
    aliases: ['kepung', 'siman', 'kelud utara']
  },
  {
    id: 'kab-puncu',
    name: 'Kecamatan Puncu',
    category: 'Kecamatan',
    district: 'Puncu',
    areaType: 'Kabupaten',
    lat: -7.8680,
    lng: 112.2350,
    aliases: ['puncu', 'lereng kelud']
  },
  {
    id: 'kab-plosoklaten',
    name: 'Kecamatan Plosoklaten (Sumber Ubalan)',
    category: 'Kecamatan',
    district: 'Plosoklaten',
    areaType: 'Kabupaten',
    lat: -7.8720,
    lng: 112.1480,
    aliases: ['plosoklaten', 'sumber ubalan', 'ubalan']
  },
  {
    id: 'kab-wates',
    name: 'Kecamatan Wates',
    category: 'Kecamatan',
    district: 'Wates',
    areaType: 'Kabupaten',
    lat: -7.9250,
    lng: 112.1150,
    aliases: ['wates', 'pasar wates', 'tugu wates']
  },
  {
    id: 'kab-ngancar',
    name: 'Kecamatan Ngancar (Kawasan Wisata Gunung Kelud)',
    category: 'Kecamatan',
    district: 'Ngancar',
    areaType: 'Kabupaten',
    lat: -7.9280,
    lng: 112.1850,
    aliases: ['ngancar', 'gunung kelud', 'kelud', 'kampung anggrek']
  },
  {
    id: 'kab-kandat',
    name: 'Kecamatan Kandat',
    category: 'Kecamatan',
    district: 'Kandat',
    areaType: 'Kabupaten',
    lat: -7.9350,
    lng: 112.0450,
    aliases: ['kandat', 'jalur blitar']
  },
  {
    id: 'kab-ringinrejo',
    name: 'Kecamatan Ringinrejo',
    category: 'Kecamatan',
    district: 'Ringinrejo',
    areaType: 'Kabupaten',
    lat: -7.9850,
    lng: 112.0650,
    aliases: ['ringinrejo', 'sambi']
  },
  {
    id: 'kab-kras',
    name: 'Kecamatan Kras',
    category: 'Kecamatan',
    district: 'Kras',
    areaType: 'Kabupaten',
    lat: -7.9620,
    lng: 111.9880,
    aliases: ['kras', 'stasiun kras', 'kanigoro']
  },
  {
    id: 'kab-ngadiluwih',
    name: 'Kecamatan Ngadiluwih',
    category: 'Kecamatan',
    district: 'Ngadiluwih',
    areaType: 'Kabupaten',
    lat: -7.8950,
    lng: 111.9950,
    aliases: ['ngadiluwih', 'stasiun ngadiluwih', 'branggahan']
  },
  {
    id: 'kab-mojo',
    name: 'Kecamatan Mojo',
    category: 'Kecamatan',
    district: 'Mojo',
    areaType: 'Kabupaten',
    lat: -7.9150,
    lng: 111.9450,
    aliases: ['mojo', 'surat', 'ploso mojo']
  },
  {
    id: 'kab-semen',
    name: 'Kecamatan Semen (Sumber Podang / Gereja Puhsarang)',
    category: 'Kecamatan',
    district: 'Semen',
    areaType: 'Kabupaten',
    lat: -7.8480,
    lng: 111.9450,
    aliases: ['semen', 'sumber podang', 'puhsarang', 'gereja puhsarang']
  },
  {
    id: 'kab-banyakan',
    name: 'Kecamatan Banyakan',
    category: 'Kecamatan',
    district: 'Banyakan',
    areaType: 'Kabupaten',
    lat: -7.7950,
    lng: 111.9550,
    aliases: ['banyakan', 'maron', 'jabon']
  },
  {
    id: 'kab-grogol',
    name: 'Kecamatan Grogol',
    category: 'Kecamatan',
    district: 'Grogol',
    areaType: 'Kabupaten',
    lat: -7.7550,
    lng: 111.9650,
    aliases: ['grogol', 'sonorejo', 'kawasan bandara']
  },
  {
    id: 'kab-tarokan',
    name: 'Kecamatan Tarokan',
    category: 'Kecamatan',
    district: 'Tarokan',
    areaType: 'Kabupaten',
    lat: -7.7250,
    lng: 111.9350,
    aliases: ['tarokan', 'kedungsari', 'perbatasan nganjuk']
  },
  {
    id: 'kab-kayen-kidul',
    name: 'Kecamatan Kayen Kidul',
    category: 'Kecamatan',
    district: 'Kayen Kidul',
    areaType: 'Kabupaten',
    lat: -7.7450,
    lng: 112.1150,
    aliases: ['kayen kidul', 'bangsongan']
  }
];

/**
 * Quick search algorithm for Kediri database
 */
export function searchKediriPlaces(query: string, limit = 8): KediriPlace[] {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return [];

  const tokens = cleanQ.split(/\s+/).filter(Boolean);

  const scored = KEDIRI_PLACES.map((place) => {
    let score = 0;
    const nameLower = place.name.toLowerCase();
    const districtLower = place.district.toLowerCase();
    const catLower = place.category.toLowerCase();
    const aliasesJoined = place.aliases.join(' ').toLowerCase();

    // Exact matches
    if (nameLower.startsWith(cleanQ)) score += 50;
    else if (nameLower.includes(cleanQ)) score += 30;

    // Aliases match
    for (const alias of place.aliases) {
      if (alias === cleanQ) score += 40;
      else if (alias.includes(cleanQ)) score += 20;
    }

    // Token matches
    for (const token of tokens) {
      if (nameLower.includes(token)) score += 15;
      if (districtLower.includes(token)) score += 10;
      if (aliasesJoined.includes(token)) score += 8;
      if (catLower.includes(token)) score += 5;
    }

    return { place, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.place);

  return scored.slice(0, limit);
}
