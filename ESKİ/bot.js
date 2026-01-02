// bot.js
import axios from 'axios';
import puppeteer from 'puppeteer';
import Captcha from '2captcha';
import { config } from './config.js';

const { personalInfo, cardInfo, tesla, captcha, settings } = config;

// Türkiye pazarı için envanter URL'si (Model Y, yeni araçlar)
const TESLA_INVENTORY_URL = "https://www.tesla.com/inventory/api/v4/inventory-results?query=%7B%22query%22%3A%7B%22model%22%3A%22my%22%2C%22condition%22%3A%22new%22%2C%22options%22%3A%7B%7D%2C%22arrangeby%22%3A%22Price%22%2C%22order%22%3A%22asc%22%2C%22market%22%3A%22TR%22%2C%22language%22%3A%22tr%22%2C%22super_region%22%3A%22emea%22%7D%2C%22offset%22%3A0%2C%22count%22%3A50%2C%22outsideSearch%22%3Afalse%7D";
const ORDER_API_URL = "https://www.tesla.com/coinorder/api/v4/order";

const HEADERS = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Origin': 'https://www.tesla.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Referer': 'https://www.tesla.com/tr_TR/inventory/new/my',
    'Cookie': tesla.cookie
};

const processedVins = new Set();
const captchaSolver = new Captcha.Solver(captcha.apiKey);

// hCaptcha çözümü için helper
async function solveCaptcha(orderPageUrl) {
    console.log("hCaptcha çözümü isteniyor...");
    try {
        const options = {
            proxy: "72.10.160.90:5985",  // Gerekliyse proxy
            proxytype: 'HTTP',
            pageurl: orderPageUrl 
        };
        console.log("2Captcha servisine istek gönderiliyor...");
        const res = await captchaSolver.hcaptcha(tesla.hCaptchaSiteKey, orderPageUrl, options);
        console.log("✅ hCaptcha başarıyla çözüldü.");
        return res.data;  // hCaptcha token değeri
    } catch (error) {
        console.error("hCaptcha çözme hatası:", error.message);
        return null;
    }
}

// Kredi kartı ödemesini tamamlayan fonksiyon
async function completePayment(orderResponse, car) {
    console.log("💳 Ödeme süreci başlatılıyor...");
    const browser = await puppeteer.launch({ headless: settings.headless });
    const page = await browser.newPage();
    // Tesla oturum cookie'lerini tarayıcıya ekleyelim
    const cookies = tesla.cookie.split(/; */).map(cookieStr => {
        const [name, ...valParts] = cookieStr.split('=');
        return { name: name, value: valParts.join('='), domain: '.tesla.com' };
    });
    await page.setCookie(...cookies);

    const returnUrl = orderResponse.returnUrl;
    // Mümkünse reservation (RN) ve ödeme token değerlerini al
    const RN = orderResponse.reservationNumber || orderResponse.reservationId || null;
    const paymentToken = orderResponse.signedData || orderResponse.paymentToken || null;

    console.log("Ödeme sayfasına bağlanılıyor...");
    await page.goto(returnUrl, { waitUntil: 'networkidle0' });  // static-assets-pay Tesla ödeme sayfası
    // Entegre ödeme kodunu tarayıcıda çalıştır
    const paymentResult = await page.evaluate(async ({ card, personal, token, vin, deposit, rn }) => {
        // Gerekli verileri değişkenlere ayır
        const { cardNumber, cardHolderName, cardExpMonth, cardExpYear, cardCVV } = card;
        const { address, city, postalCode } = personal;
        const addressLine1 = address;
        const zipCode = postalCode;
        const stateProvince = "";  // TR için gerekmez
        // Adyen Device Fingerprint (df.js) kurulumu
        let fp = { style: "style" };
        if (typeof dfInitDS === 'function' && typeof dfSet === 'function') {
            dfInitDS();
            dfSet(fp);
        }
        console.log("Adyen parmak izi değeri:", fp.value);
        // Kredi kartı şifreleme için Adyen CSE oluştur
        const cse = adyen.createEncryption({ numberIgnoreNonNumeric: false });
        const genTime = { generationtime: new Date().toISOString() };
        // Ödeme isteğini Tesla Pay API'ine gönder
        const resp = await fetch("https://static-assets-pay.tesla.com/api/payments/v4", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            credentials: "include",
            body: JSON.stringify({
                billingAddress: {
                    addressLine1,
                    addressLine2: "",
                    countryCode: "TR",
                    zipCode,
                    city,
                    stateProvince
                },
                billingContact: {},
                browserInfo: {
                    colorDepth: screen.colorDepth,
                    javaEnabled: false,
                    language: "tr-TR",
                    screenHeight: screen.height,
                    screenWidth: screen.width,
                    timeZoneOffset: 0  // offset (dk) – isteğe bağlı
                },
                deliveryAddress: {},
                deviceFingerprint: fp.value,
                ipAddress: "0.0.0.0",
                locale: "tr_TR",
                processWithProfile: false,
                // Yalnızca mevcutsa imzalı token ekle
                ...(token ? { signedData: token } : {}),
                paymentDetails: [{
                    amount: deposit,
                    currency: "TRY",
                    hostUrl: btoa(`https://www.tesla.com/tr_TR/modely/order/payment_done/${rn ? rn : ""}/${vin}`),
                    isMobile: false,
                    metadata: { redirectMethod: "GET" },
                    paymentType: "CREDITCARD",
                    processWithProfile: false,
                    returnUrl: "https://static-assets-pay.tesla.com/v5/adyen_done.html?locale=tr_TR",
                    saveToProfile: true,
                    nameOnTheInstrument: cardHolderName.normalize("NFD")
                                                    .replace(/\p{Diacritic}/gu, "")
                                                    .replace(/ı/g, "i").toUpperCase(),
                    encryptedCardNumber: cse.encrypt({ ...genTime, number: cardNumber.replace(/\s+/g, "") }),
                    encryptedExpiryMonth: cse.encrypt({ ...genTime, expiryMonth: cardExpMonth }),
                    encryptedExpiryYear: cse.encrypt({ ...genTime, expiryYear: cardExpYear }),
                    encryptedSecurityCode: cse.encrypt({ ...genTime, cvc: cardCVV }),
                    paymentProcessor: "ADYEN",
                    type: "CREDITCARD",
                    lastFourDigits: cardNumber.replace(/\s+/g, "").slice(-4),
                    expirationMonth: cardExpMonth,
                    expirationYear: cardExpYear,
                    cardType: (() => {
                        switch (cardNumber[0]) {
                            case "4": return "VISA";
                            case "5": return "MASTERCARD";
                            case "6": return "DISCOVER";
                            default:  return "UNKNOWN";
                        }
                    })()
                }]
            })
        });
        if (!resp.ok) {
            const errText = await resp.text();
            console.error("Tesla Pay API hatası:", errText);
            return null;
        }
        const data = await resp.json();
        console.log("PayAPI yanıtı:", data);
        return data;
    }, { card: cardInfo, personal: personalInfo, token: paymentToken, vin: car.VIN, deposit: settings.orderAmountTRY, rn: RN });

    // Ödeme sonucu değerlendirme
    if (!paymentResult) {
        console.error("Ödeme API çağrısı başarısız oldu veya hata döndü!");
    } else {
        const payxResp = paymentResult.listOfPayXPaymentResponses ? paymentResult.listOfPayXPaymentResponses[0] : undefined;
        console.log(`💰 Ödeme kararı: ${paymentResult.decision || "Unknown"}`);
        if (payxResp?.responseMessage) {
            console.log(`PayX Mesajı: ${payxResp.responseMessage}`);
        }
        if (payxResp?.details?.url) {
            // 3D Secure doğrulaması gerekli, kullanıcı yönlendiriliyor
            console.log("✅ Ödeme işleme alındı, 3D Secure doğrulaması gerekiyor. Tarayıcıda doğrulama sayfası açıldı...");
            await page.goto(payxResp.details.url, { waitUntil: 'load' });
            console.log("Lütfen bankanızın 3D Secure sayfasında gerekli doğrulamayı yapın.");
            try {
                // 3DS tamamlandıktan sonra Tesla'ya yönlenmeyi bekle
                await page.waitForNavigation({ timeout: 120000 });
                console.log("3D Secure doğrulaması tamamlandı. Sipariş sonlandırılıyor...");
            } catch {
                console.log("3D Secure sayfasında bekleme süresi doldu veya işlem iptal edildi.");
            }
            console.log("✔️ Tarayıcı, incelemeniz için açık bırakılıyor. İşlem tamamlandıktan sonra tarayıcıyı kapatabilirsiniz.");
            return;  // Tarayıcıyı açık bırak
        } else if (paymentResult.decision === "Success" || payxResp?.decision === "ACCEPT") {
            console.log("✅ Ödeme işlemi başarıyla tamamlandı! (3D Secure gerekmedi)");
        } else if (paymentResult.decision) {
            console.error(`⚠️ Ödeme reddedildi veya onaylanmadı: ${paymentResult.decision}`);
        }
    }
    // Tarayıcıyı kapat (3DS gerekmediyse)
    await browser.close();
}

// Bir VIN için sipariş sürecini başlatır (ön sipariş ve ödeme)
async function initiateOrder(car) {
    console.log(`\n🚗 Sipariş süreci başlatılıyor: VIN [${car.VIN}]`);
    const orderUrl = `https://www.tesla.com/tr_TR/my/order/${car.VIN}`;

    try {
        // CAPTCHA çözümü al
        const hCaptchaTokenValue = await solveCaptcha(orderUrl);
        if (!hCaptchaTokenValue) {
            console.log(`❌ VIN [${car.VIN}] için Captcha çözülemedi, sonraki araca geçiliyor.`);
            return false;
        }

        // Sipariş payload'unu hazırla (Türkiye pazarı)
        const orderPayload = {
            Vin: car.VIN,
            hcaptchaToken: hCaptchaTokenValue,  // Doğru anahtar-değer (Captcha)
            market: "TR",        // Pazar = TR
            language: "tr",      // Dil = tr
            model: "my",
            deliveryLocationSelectionDetails: {
                locationId: settings.deliveryLocationId,
                pickUpType: "PICKUP_SERVICE_CENTER",
                locations: [{ 
                    trt: "Tesla Delivery Istanbul",   // Teslimat noktası adı (örn: İstanbul)
                    trt_id: settings.deliveryLocationId 
                }],
                version: "v2"
            },
            Payment: {
                PaymentType: "CREDITCARD",
                CurrencyCode: "TRY",         // Para birimi = TL
                CountryCode: "TR",           // Ülke kodu = TR
                PaymentAmount: 0,
                OrderAmount: settings.orderAmountTRY,
                PaymentSource: "RESERVATION",
                PaymentSourceSubType: "DEPOSIT_NON_REFUNDABLE",
                IsOffline: true
            },
            AccountDetails: {
                firstName: personalInfo.firstName,
                lastName: personalInfo.lastName,
                email: personalInfo.email,
                contactPreference: "EMAIL"
            },
            BillingInfoDetail: { ...personalInfo, country: "TR" },
            RegistrationDetail: { 
                isBillingSameAsRegistration: true,
                registrantType: "PRIVATE",
                ...personalInfo,
                country: "TR" 
            }
        };

        console.log("📨 Sipariş API isteği gönderiliyor...");
        const response = await axios.post(ORDER_API_URL, orderPayload, { headers: HEADERS });
        const orderResponse = response.data;

        if (orderResponse.returnUrl && orderResponse.returnUrl.includes("payment_done")) {
            console.log("✅ Ön sipariş API isteği başarılı! Ödeme aşamasına geçiliyor...");
            console.log("Dönen ödeme URL'i:", orderResponse.returnUrl);
            // Ödeme onayını tamamla (depozito ödemesi)
            await completePayment(orderResponse, car);
            return true;
        } else if (orderResponse.error) {
            console.error(`❌ Sipariş başarısız oldu. Hata: ${orderResponse.error}`);
        } else {
            console.error("❌ Beklenmeyen sipariş yanıtı:", orderResponse);
        }
    } catch (error) {
        const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error(`❌ Sipariş verme sırasında hata: ${errorMessage}`);
    }
    return false;
}

// Envanteri belirli aralıklarla kontrol eder ve yeni araç bulursa siparişi başlatır
async function pollInventory() {
    try {
        const { data } = await axios.get(TESLA_INVENTORY_URL, { headers: HEADERS });
        const total = data.total_matches_found ?? 0;
        console.log(`[${new Date().toLocaleTimeString()}] Envanter kontrolü... Bulunan araç adedi: ${total}`);

        if (data.results && data.results.length > 0) {
            for (const car of data.results) {
                if (!processedVins.has(car.VIN)) {
                    console.log(`🔥 Yeni araç bulundu! VIN: [${car.VIN}] | Fiyat: ₺${car.Price.toLocaleString('tr-TR')}`);
                    processedVins.add(car.VIN);
                    const orderPlaced = await initiateOrder(car);
                    if (orderPlaced) return true;  // Sipariş süreci tamamlandı, dur
                }
            }
        }
    } catch (error) {
        const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error(`❌ Envanter kontrolü sırasında hata: ${errorMessage}`);
    }
    return false;
}

// Ana döngü
async function main() {
    console.log("🚀 Tesla Sipariş Botu (Türkiye) başlatıldı...");
    while (true) {
        const finished = await pollInventory();
        if (finished) break;
        await new Promise(res => setTimeout(res, settings.pollIntervalMs));
    }
}

main();
