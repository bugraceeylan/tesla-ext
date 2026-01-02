const axios = require('axios');

const url = "https://www.tesla.com/inventory/api/v4/inventory-results?query=%7B%22query%22%3A%7B%22model%22%3A%22my%22%2C%22condition%22%3A%22new%22%2C%22options%22%3A%7B%7D%2C%22arrangeby%22%3A%22Savings%22%2C%22order%22%3A%22asc%22%2C%22market%22%3A%22US%22%2C%22language%22%3A%22en%22%2C%22super_region%22%3A%22north%20america%22%2C%22PaymentType%22%3A%22cash%22%2C%22paymentRange%22%3A70000%7D%2C%22offset%22%3A0%2C%22count%22%3A24%2C%22outsideOffset%22%3A0%2C%22outsideSearch%22%3Afalse%2C%22isFalconDeliverySelectionEnabled%22%3Atrue%2C%22version%22%3A%22v2%22%7D";
const headers = {
  'Pragma': 'no-cache',
  'Accept': '*/*',
  'Sec-Fetch-Site': 'same-origin',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Sec-Fetch-Mode': 'cors',
  'Cache-Control': 'no-cache',
  'Host': 'www.tesla.com',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',
  'Referer': 'https://www.tesla.com/en_US/inventory/new/my?arrangeby=plh&zip=&range=0',
  'Connection': 'keep-alive',
  'Cookie': './cookie.txt',

};

function escapeMarkdownV2(text) {
  const specialChars = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];
  for (const char of specialChars) {
    text = text.split(char).join(`\\${char}`);
  }
  return text;
}

async function sendTelegramMsgWithButton(msg, buttonText, buttonUrl) {
  const chatId = "5921826319";
  const token = "7579041856:AAE7mh3O3b-VIjaNjRGGGAqIJhk3rYLAFrI";
  const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  const payload = {
    chat_id: chatId,
    text: msg,
    parse_mode: 'MarkdownV2',
    reply_markup: {
      inline_keyboard: [
        [
          { text: buttonText, url: buttonUrl }
        ]
      ]
    }
  };

  try {
    await axios.post(telegramUrl, payload);
  } catch (error) {
    console.error("Telegram mesaj hatası:", error.message);
  }
}

async function fetchTeslaInventory() {
  try {
    const response = await axios.get(url, { headers });
    const data = response.data;

    if (data.total_matches_found > 0) {
      for (const car of data.results) {
        const priceNew = escapeMarkdownV2(`₺${car.InventoryPrice.toLocaleString('tr-TR')}`);
        const paint = escapeMarkdownV2(car.PAINT[0]);
        const interior = escapeMarkdownV2(car.INTERIOR[0]);
        const vinRaw = car.VIN;
        const vin = escapeMarkdownV2(vinRaw);
        const link = `https://www.tesla.com/en_US/my/order/${vinRaw}?titleStatus=new&redirect=no#overview`;

        const msg = `*ÜLKE EN US *\n`
          + `*Fiyat:* ${priceNew}\n`
          + `*Renk:* ${paint}\n`
          + `*İç Döşeme:* ${interior}\n`
          + `*VIN:* \`${vin}\`\n`
          + `*BANKA:* \`\u00d6DEMEYE RED\``;

        await sendTelegramMsgWithButton(msg, "🔗 Sipariş Linkini Aç", link);
      }
    } else {
      console.log("araç yok");
    }
  } catch (error) {
    console.error("Tesla isteği hatası:", error.message);
  }
}

fetchTeslaInventory();
