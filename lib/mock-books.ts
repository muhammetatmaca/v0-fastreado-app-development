export interface BookContent {
  id: string
  title: string
  author: string
  content: string[]
  totalPages: number
}

export const mockBooks: Record<string, BookContent> = {
  "1": {
    id: "1",
    title: "Nutuk",
    author: "Mustafa Kemal Atatürk",
    totalPages: 542,
    content: [
      "Efendiler! 19 Mayıs 1919'da Samsun'a çıktığım vakit, vaziyetin umumi bir sureti şu idi:",
      "Osmanlı Devleti, Birinci Dünya Harbi'nde müttefikleriyle beraber mağlup olmuş ve ağır bir mütareke imzalamıştı.",
      "Memleketin her tarafı işgal edilmiş, İstanbul'da bulunan hükümet, düşman karşısında âciz kalmıştı.",
      "Millet, uzun harblerden yorgun düşmüş, fakir ve bitkin bir halde idi.",
      "İşte bu şartlar altında, milletin istiklalini ve devletin bekasını kurtarmak için harekete geçtik.",
      "Samsun'a çıktığımız günden itibaren, milli mücadelenin temellerini atmaya başladık.",
      "Amasya Genelgesi ile millete seslenişimiz, kurtuluş mücadelesinin ilk adımı oldu.",
      "Erzurum ve Sivas Kongreleri'nde milli iradenin tecellisi sağlandı.",
      "Ankara'da Büyük Millet Meclisi'nin açılması, yeni Türkiye'nin doğuşunu müjdeledi.",
      "Sakarya Meydan Muharebesi'nde düşmanın taarruzunu kırdık ve zafere doğru yürüdük."
    ]
  },
  "2": {
    id: "2",
    title: "Safahat",
    author: "Mehmet Akif Ersoy",
    totalPages: 324,
    content: [
      "Korkma, sönmez bu şafaklarda yüzen al sancak;",
      "Sönmeden yurdumun üstünde tüten en son ocak.",
      "O benim milletimin yıldızıdır, parlayacak;",
      "O benimdir, o benim milletimindir ancak.",
      "Çatma, kurban olayım, çehreni ey nazlı hilal!",
      "Kahraman ırkıma bir gül! Ne bu şiddet, bu celal?",
      "Sen de gül, yurduma dön, gülerken ağlama, güzel!",
      "Şu cihan-ı zulümde bir gülen sen olsan ne güzel!",
      "Arkadaş! Yurduma alçakları uğratma, sakın;",
      "Siper et gövdeni, dursun bu hayâsızca akın."
    ]
  },
  "3": {
    id: "3",
    title: "Kuyucaklı Yusuf",
    author: "Sabahattin Ali",
    totalPages: 198,
    content: [
      "Yusuf, Kuyucak köyünün en güçlü ve en yakışıklı delikanlısıydı.",
      "Köyde herkes onu severdi, saygı duyardı. Çünkü o, dürüst ve mert bir insandı.",
      "Şahinde'ye olan aşkı, onun hayatının en büyük gerçeğiydi.",
      "Fakat bu aşk, toplumsal önyargılar yüzünden büyük acılara sebep olacaktı.",
      "Muhtarın oğlu Ahmet'in Şahinde'ye göz dikmesi, işleri karıştırdı.",
      "Yusuf, sevdiği kızı korumak için her şeyi göze aldı.",
      "Köydeki adaletsizlikler karşısında susan Yusuf değildi.",
      "O, haksızlığa karşı durmayı bilir, gerektiğinde canını ortaya koyardı.",
      "Şahinde ile Yusuf'un hikayesi, aşkın gücünü ve toplumsal baskıları anlatır.",
      "Bu roman, Anadolu insanının yaşadığı çelişkileri gözler önüne serer."
    ]
  },
  "4": {
    id: "4",
    title: "İçimizdeki Şeytan",
    author: "Sabahattin Ali",
    totalPages: 156,
    content: [
      "Ömer, küçük bir kasabada yaşayan sıradan bir memurdu.",
      "Hayatı monoton ve sıkıcıydı, ta ki o kadınla karşılaşana kadar.",
      "Macide, onun hayatına bambaşka bir renk katmıştı.",
      "Fakat bu ilişki, Ömer'in içindeki karanlık tarafları ortaya çıkaracaktı.",
      "Aşk mı, yoksa tutku mu? Bu sorunun cevabını bulmak kolay değildi.",
      "Ömer, kendini giderek daha derin bir çelişkinin içinde buldu.",
      "İçindeki şeytan, onu kontrol etmeye başlamıştı.",
      "Toplumsal normlar ile kişisel arzular arasında sıkışmıştı.",
      "Bu hikaye, insanın iç dünyasındaki çelişkileri anlatır.",
      "Sabahattin Ali'nin ustalığı, bu karmaşık duyguları yansıtmasında görülür."
    ]
  },
  "5": {
    id: "5",
    title: "Sinekli Bakkal",
    author: "Halide Edib Adıvar",
    totalPages: 287,
    content: [
      "Rabia, küçük bir Anadolu kasabasında yaşayan genç bir kızdı.",
      "Babası Hacı Etem'in dükkânı, kasabanın en işlek yerindeydi.",
      "Sinekli Bakkal adıyla anılan bu dükkân, birçok hikayeye ev sahipliği yapmıştı.",
      "Rabia'nın eğitim hayatı, o dönemin kadın sorunlarını gözler önüne seriyordu.",
      "Geleneksel yaşam ile modern düşünceler arasında kalan genç kız, zorlu kararlar vermek zorundaydı.",
      "Kasabadaki sosyal yapı, kadının toplumsal konumunu belirgin şekilde ortaya koyuyordu.",
      "Rabia'nın mücadelesi, aynı zamanda Türk kadınının kurtuluş mücadelesiydi.",
      "Halide Edib Adıvar, bu romanda kadın hakları konusundaki görüşlerini dile getirmiştir.",
      "Sinekli Bakkal, Türk edebiyatının önemli feminist eserlerinden biridir.",
      "Roman, geleneksel ile modern arasındaki çelişkileri başarıyla anlatır."
    ]
  },
  "6": {
    id: "6",
    title: "Çalıkuşu",
    author: "Reşat Nuri Güntekin",
    totalPages: 342,
    content: [
      "Feride, İstanbul'da büyümüş, eğitimli ve idealist bir genç kızdı.",
      "Öğretmen olmaya karar verdiğinde, ailesi bu duruma pek sıcak bakmamıştı.",
      "Anadolu'nun ücra köşelerinde öğretmenlik yapmak, onun için bir mücadele alanıydı.",
      "Her gittiği yerde, cehalet ve yoksullukla karşılaştı.",
      "Fakat Feride, hiçbir zaman pes etmedi, her zaman umudunu korudu.",
      "Çalıkuşu lakabı, onun özgür ruhunu ve uçma arzusunu simgeliyordu.",
      "Kamran ile olan aşkı, hayatının en büyük sınavlarından biriydi.",
      "Toplumsal önyargılar ve kişisel mutluluk arasında tercih yapmak zorunda kaldı.",
      "Bu roman, Cumhuriyet döneminin eğitim ve kadın sorunlarını ele alır.",
      "Feride'nin hikayesi, birçok kuşağa ilham vermiştir."
    ]
  },
  "7": {
    id: "7",
    title: "Aşk-ı Memnu",
    author: "Halit Ziya Uşaklıgil",
    totalPages: 456,
    content: [
      "Adnan Bey, İstanbul'un varlıklı ailelerinden birinin reisiydi.",
      "İkinci evliliğini genç ve güzel Bihter ile yapmıştı.",
      "Fakat bu evlilik, beklenmedik bir aşkın doğmasına sebep olacaktı.",
      "Bihter ile Behlül arasındaki yasak aşk, ailenin sonunu getirecekti.",
      "Nihal, Adnan Bey'in ilk evliliğinden olan kızıydı ve masum bir genç kızdı.",
      "Aile içindeki bu karmaşık ilişkiler, herkesin hayatını etkileyecekti.",
      "Bihter'in iç dünyasındaki çelişkiler, onu uçuruma sürüklüyordu.",
      "Toplumsal ahlak kuralları ile kişisel arzular arasındaki çatışma, romanın temel konusuydu.",
      "Halit Ziya Uşaklıgil, psikolojik tahlilleriyle Türk edebiyatına yeni bir soluk getirmiştir.",
      "Aşk-ı Memnu, Türk edebiyatının en önemli psikolojik romanlarından biridir."
    ]
  },
  "8": {
    id: "8",
    title: "Tutunamayanlar",
    author: "Oğuz Atay",
    totalPages: 724,
    content: [
      "Turgut Özben, hayata tutunmaya çalışan ama bir türlü başaramayan bir aydındı.",
      "İstanbul'da yaşıyor, fakat kendini hiçbir yere ait hissetmiyordu.",
      "Çevresindeki insanlarla kurduğu ilişkiler, hep yarım kalmış, eksik kalmıştı.",
      "Modern hayatın getirdiği yabancılaşma, onu derinden etkiliyordu.",
      "Selim ile olan dostluğu, hayatındaki en anlamlı ilişkilerden biriydi.",
      "Fakat bu dostluk da, zamanla karmaşık bir hal almaya başladı.",
      "Turgut'un iç monologları, modern insanın ruh halini yansıtıyordu.",
      "Toplumsal değişim karşısında kaybolmuş bir kuşağın hikayesiydi bu.",
      "Oğuz Atay, bu romanda modernleşmenin getirdiği sorunları ele almıştır.",
      "Tutunamayanlar, Türk edebiyatının en önemli modern romanlarından biridir."
    ]
  },
  "9": {
    id: "9",
    title: "Beyaz Kale",
    author: "Orhan Pamuk",
    totalPages: 198,
    content: [
      "17. yüzyılda, genç bir Venedikli bilim adamı Osmanlı gemilerince esir alınır.",
      "İstanbul'a getirilen bu esir, Hoca adında bir Osmanlı bilginiyle karşılaşır.",
      "İkisi arasındaki benzerlik, hem şaşırtıcı hem de rahatsız edicidir.",
      "Hoca, esirine bilimsel konularda sorular sorar, ondan öğrenmeye çalışır.",
      "Zamanla aralarında garip bir dostluk ve rekabet gelişir.",
      "Kimlik değişimi, romanın en önemli temalarından biridir.",
      "Doğu ile Batı arasındaki kültürel farklılıklar ve benzerlikler sorgulanır.",
      "Hoca'nın büyük silah yapma projesi, ikisini daha da yakınlaştırır.",
      "Fakat bu yakınlık, kimlik karmaşasını da beraberinde getirir.",
      "Orhan Pamuk, bu romanda Doğu-Batı sentezini ustaca işlemiştir."
    ]
  },
  "10": {
    id: "10",
    title: "Sevgili Arsız Ölüm",
    author: "Nazım Hikmet",
    totalPages: 234,
    content: [
      "Ölüm, insanoğlunun en büyük korkusu ve en büyük merakıdır.",
      "Nazım Hikmet, ölümle olan hesaplaşmasını şiirlerinde dile getirmiştir.",
      "Yaşama sevgisi ile ölüm korkusu arasındaki çelişki, şairin temel temasıdır.",
      "Hapishane yılları, ona ölümü daha yakından tanıma fırsatı vermiştir.",
      "Sevgili arsız ölüm, hem korkulan hem de merak edilen bir varlıktır.",
      "Şair, ölümü kişileştirerek onunla diyaloga girer.",
      "Bu diyalogda, yaşamın anlamı ve değeri sorgulanır.",
      "Nazım'ın ölüm anlayışı, materyalist felsefesinden kaynaklanır.",
      "O, ölümü doğal bir süreç olarak kabul eder, ama yaşamı da sever.",
      "Bu şiir kitabı, Türk şiirinin en derin eserlerinden biridir."
    ]
  }
}

export function getBookContent(bookId: string, page: number = 0): string {
  const book = mockBooks[bookId]
  if (!book) return "Kitap bulunamadı."

  const pageIndex = Math.min(page, book.content.length - 1)
  return book.content[pageIndex] || "Sayfa bulunamadı."
}

export function getBookInfo(bookId: string): BookContent | null {
  return mockBooks[bookId] || null
}