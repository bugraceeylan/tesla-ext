// bot.js (Düzeltilmiş ve Geliştirilmiş Versiyon)

const axios = require('axios');
const puppeteer = require('puppeteer');
const fs = require('fs');

// --- AYARLAR: BU BÖLÜMÜ DİKKATLİCE DÜZENLEYİN ---

const TARGET_CRITERIA = {
    maxPrice: 49000,
    color: "BLUE",
    wheels: "TWENTY",
    interior: "PREMIUM_BLACK",
    hasTowHitch: true,
    trim: "LRAWD"
};

const COOKIE_FILE_PATH = 'cookie.json';

// GÜVENLİK UYARISI: Ödeme bilgileri ASLA koda yazılmaz.
// Bu bilgileri aşağıdaki "Ortam Değişkenlerini Ayarlama" adımında gösterildiği gibi terminalden gir.
const PAYMENT_DETAILS = {
    cardNumber: process.env.TESLA_CARD_NUMBER,
    expiryDate: process.env.TESLA_EXPIRY_DATE, // "MM/YY" formatında
    cvv: process.env.TESLA_CVV,
    cardHolderName: process.env.TESLA_CARD_HOLDER
};

const CHECK_INTERVAL_MS = 8000;
let inventoryCheckInterval;

// --- AYARLAR BİTTİ ---

/**
 * JSON formatındaki cookie dosyasını okuyup axios'un kullanabileceği bir string'e çevirir.
 * @param {string} filePath - cookie.txt dosyasının yolu
 * @returns {string|null} - "key=value; key2=value2;" formatında cookie string'i
 */
function getCookieStringFromFile(filePath) {
    try {
        const cookieJson = fs.readFileSync(filePath, 'utf8');
        const cookies = JSON.parse(cookieJson);
        return cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
    } catch (error) {
        console.error("❌ Cookie dosyası okunamadı veya JSON formatında değil:", error.message);
        return null;
    }
}

function findDesiredCar(cars) {
    for (const car of cars) {
        const criteria = TARGET_CRITERIA;
        const hasTowHitch = car.ADL_OPTS && car.ADL_OPTS.includes("TOWING");

        if (
            car.InventoryPrice <= criteria.maxPrice &&
            car.PAINT.includes(criteria.color) &&
            car.WHEELS.includes(criteria.wheels) &&
            car.INTERIOR.includes(criteria.interior) &&
            car.TRIM.includes(criteria.trim) &&
            (!criteria.hasTowHitch || (criteria.hasTowHitch && hasTowHitch))
        ) {
            console.log("✅ KRİTERLERE UYGUN ARAÇ BULUNDU!");
            return car;
        }
    }
    return null;
}

async function checkInventory(cookieHeader) {
    const url = "https://www.tesla.com/inventory/api/v4/inventory-results?query=%7B%22query%22%3A%7B%22model%22%3A%22my%22%2C%22condition%22%3A%22new%22%2C%22options%22%3A%7B%7D%2C%22arrangeby%22%3A%22Price%22%2C%22order%22%3A%22asc%22%2C%22market%22%3A%22NL%22%2C%22language%22%3A%22nl%22%7D%2C%22offset%22%3A0%2C%22count%22%3A50%7D";
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Cookie': cookieHeader // <<<--- EN ÖNEMLİ DEĞİŞİKLİK BURADA!
    };

    try {
        const response = await axios.get(url, { headers });
        const data = response.data;
        const now = new Date();
        console.log(`[${now.toLocaleTimeString()}] Kontrol ediliyor... Bulunan toplam araç: ${data.total_matches_found || 0}`);

        if (data.results && data.results.length > 0) {
            const targetCar = findDesiredCar(data.results);
            if (targetCar) {
                clearInterval(inventoryCheckInterval);
                console.log("Sipariş süreci başlatılıyor...");
                await startOrderProcess(targetCar);
            }
        }
    } catch (error) {
        if (error.response) {
            console.error(`❌ Envanter sorgulama hatası: Sunucu ${error.response.status} koduyla yanıt verdi.`);
            if (error.response.status === 403) {
                 console.error("-> 403 Hatası: Erişim Engellendi. Cookie'leriniz geçersiz veya süresi dolmuş olabilir. Lütfen 'cookie.txt' dosyasını güncelleyin.");
                 clearInterval(inventoryCheckInterval); // Geçersiz cookie ile denemeyi durdur.
            }
        } else {
            console.error("❌ Envanter sorgulama hatası:", error.message);
        }
    }
}

async function startOrderProcess(car) {
    // ... startOrderProcess fonksiyonu öncekiyle aynı, değişiklik yok ...
    // ... Bu fonksiyonu bir önceki cevaptan kopyalayıp buraya yapıştırabilirsiniz ...
    // Önemli olan checkInventory'nin doğru çalışmasıdır.
}

/**
 * Ana fonksiyon
 */
function main() {
    console.log("Tesla Hollanda (NL) Araç Yakalama Botu Başlatıldı.");
    console.log("Aranan Kriterler:", TARGET_CRITERIA);

    if (!fs.existsSync(COOKIE_FILE_PATH)) {
        console.error(`❌ Hata: '${COOKIE_FILE_PATH}' dosyası bulunamadı. Lütfen cookie dosyasını oluşturun.`);
        return;
    }

    const cookieHeader = getCookieStringFromFile(COOKIE_FILE_PATH);
    if (!cookieHeader) {
        console.error("Bot durduruluyor. Lütfen cookie dosyasını kontrol edin.");
        return;
    }

    console.log("🍪 Çerezler başarıyla okundu. Envanter taraması başlıyor...");
    inventoryCheckInterval = setInterval(() => checkInventory(cookieHeader), CHECK_INTERVAL_MS);
}

main();