const axios = require('axios');

const url = "https://www.tesla.com/inventory/api/v4/inventory-results?query=%7B%22query%22%3A%7B%22model%22%3A%22my%22%2C%22condition%22%3A%22new%22%2C%22options%22%3A%7B%7D%2C%22arrangeby%22%3A%22Savings%22%2C%22order%22%3A%22asc%22%2C%22market%22%3A%22TR%22%2C%22language%22%3A%22tr%22%2C%22super_region%22%3A%22emea%22%7D%2C%22offset%22%3A0%2C%22count%22%3A24%2C%22outsideOffset%22%3A0%2C%22outsideSearch%22%3Afalse%2C%22isFalconDeliverySelectionEnabled%22%3Atrue%2C%22version%22%3A%22v2%22%7D";

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
  'Referer': 'https://www.tesla.com/tr_TR/inventory/new/my?arrangeby=plh&zip=&range=0',
  'Connection': 'keep-alive',
'Cookie': 'oxpOriUrl=https%3A%2F%2Fwww.tesla.com%2Ftr_tr%2Fteslaaccount; bm_ss=ab8e18ef4e; ak_bmsc=DEE274A34FF428DFAAF67989A1F98C6C~000000000000000000000000000000~YAAQD2ZWuBxxhyeYAQAAxBn/LRy5vIK+MadZ8zUoUsBcKRcRc1VTK7SOhMSDultN4ktaWPRgUOOHUC3cz56I+dL5OkVpe7IPGFsPG5yzuzRU2Ft2ksOENYQ3UwQj2sIYNnV2xIH7JLyxpn9ooVuAc9KYoqsKs1QsInluuhhNpBjx1dgb6UZAaUI2IxSKSlKHfvAusTjUqElfdU2HQuPJv9ZzUm+g4xW0qy36lrmpShGTYIaq8bVaHvKfS78EGzzxt8BlrEEQbXOi5qENFvPbsR4CdNm5wvPDCYpnUhoiPVl4gEbalGavQAfHhrY+dpFbTQiXB3XM1PKCGAAPdfbKSO8y8rTC4HZJS23RNhYA7kan9hyffVFMHcH5H3jRfG1B776ow2zsVL4=; auth_session=8eeb854c5f; tesla_logged_in=Y; NO_CACHE=Y; authTeslaWebToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjAyODg4OTk0IiwiYWNjb3VudElkIjoiMDRkYzc5NzAtMGU1ZC00Y2E0LTliNmMtYTY1YTFlZWFlOTg3IiwiZmVkZXJhdGlvbklkIjoiNGE2MTIzMGItNjkwZi00MzRmLTllZWEtMmJjZWU4YzkyNzAwIiwibWZhRW5hYmxlZCI6ZmFsc2UsInVzZXJDb3VudHJ5Q29kZSI6IlRSIiwiZW1haWwiOiJtZXJ0ZmVydGtlcnQxNUBnbWFpbC5jb20iLCJsb2dpblBob25lIjoiIiwiaWF0IjoxNzUzMTE4MzcxLCJleHAiOjE3NTMxMTg0OTF9.5JGB9wSplBH-0n-kaE8PGl-0gEkpjw-6G-83-GAe12U; teslaSSORefreshToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI5Skh4dlVBVVFfbDlBVXFhcHBrV2dLRDhRRSJ9.eyJpc3MiOiJodHRwczovL2F1dGgudGVzbGEuY29tIiwiYXVkIjoiaHR0cHM6Ly9hdXRoLnRlc2xhLmNvbS9vYXV0aDIvdjEvdG9rZW4iLCJpYXQiOjE3NTMxMTgzNzAsImRhdGEiOnsic3ViIjoiNGE2MTIzMGItNjkwZi00MzRmLTllZWEtMmJjZWU4YzkyNzAwIiwic2NwIjpbIm9mZmxpbmVfYWNjZXNzIiwib3BlbmlkIiwib3VfY29kZSIsImVtYWlsIiwicGhvbmUiXSwiYXpwIjoib3duZXJzaGlwIiwiYW1yIjpbInB3ZCJdLCJhdXRoX3RpbWUiOjE3NTMxMTgzNzB9fQ.fTnT2Q9yZ3o_4BAJX9MR9jafSrJPuWmSj_HGClNtScI5v-6x-iXVbpEv0k32cjS2DDVbK9nCQrsdjutAyp3ZfZOg6k604_X5ZhDtZXkaz8CBIlaiw_-0NMh5Xg_-ohKvNYRgplRSChLXbjYVQ_AaoMzTuOqQD02Sf_I9fr9A4K0RZjyg24o4o_M2tvc9n2DGUrK7Pjeb1L2s5gl9NnuiZrOVPLZuNq7j9nsdEV_dFSgookotQ2azSj0pn8ZSICTucg74jpRdSkgC_ClvdalWe5O3724Dk5djZigl6QUOUpazeXwAIJX_j7IaA-D3TUxSYHQ7Gep3LHqo4rRYXn3khA; teslaSSOIdToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI5Skh4dlVBVVFfbDlBVXFhcHBrV2dLRDhRRSJ9.eyJpc3MiOiJodHRwczovL2F1dGgudGVzbGEuY29tIiwic3ViIjoiNGE2MTIzMGItNjkwZi00MzRmLTllZWEtMmJjZWU4YzkyNzAwIiwiYXVkIjoib3duZXJzaGlwIiwiZXhwIjoxNzUzMTE4NjcwLCJpYXQiOjE3NTMxMTgzNzAsImFtciI6WyJwd2QiXSwiYXV0aF90aW1lIjoxNzUzMTE4MzcwLCJ1cGRhdGVkX2F0IjoxNzUzMTE4MzcwLCJlbWFpbCI6Im1lcnRmZXJ0a2VydDE1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOmZhbHNlLCJvdV9jb2RlIjoiRVUiLCJsb2NhbGUiOiJ0ci1UUiJ9.i3OuqLoriLnu80xKGv2BU4L0rG3w1K7bEWfZW21NIi3h-1VW8841qJ44Ra_QJieO7dzVPgQrdcJ3qqbP7dz5TMBeYCT5c-_9nZsS16yv77lYWNJGy6NU1PbYgHvtJNWoBLy9rlpqzr030ISwYkrg25JeHAcpXqzY8HX56YNt-41NGtxeRvUfLVWYfzKxf7ouA80YlTMAO-fFRWftb4kMn_YEx6TpH6H0y2HSjGdOuyEubJeH7lyKuG5rQpsbMfzRtUTL8d8a0dv7retT7fbx0VWUuGjEZ2oHIiUAEeJzY9IQvVWpujThSIhyfzVn4VdjQxzOHGoQcwk11tsIs_k3gg; bm_sv=B6C4A2D9959D475A923E2D898F547A41~YAAQD2ZWuN1yhyeYAQAAIpH/LRzJvS3s9fRbB0HeBxu6+3pew8NojJFcchqJivp96xGR7qahdxgI1e4m+eu7mZs36YlAozKoV+ZZvEs1LgPP/Y11TCcujKKcBrRNHyDcBmNIhUYbzOvLco5WRLE0cGDwq1e+2FeTC42MaBnPEgeIAYW4iKhhhElvGn/R0+J4z49GU/nw8HoW+YuQZ5PCfyCYvTotwYTW06jgDp1+11Lp3J0HZ6QgGgrKmbQOrnN3~1; tsla-cookie-consent=rejected; bm_lso=E361B851A8093B0906BBAA5BE517ECE327EF56B0F0B0D396679E3BB02E7C85DD~YAAQD2ZWuG93hyeYAQAATW4ALgQCTFGIcvd4p+WHoIC6d7j51Czc0RcDKkHDjMsPMm71QUr4dZmaY1kfe8YnGWBwiTZuUR97F57Y8wqN2oaFctfYFiq2N0F/LGVzGk1KsmKHcV2pyoel7nTr9WvRDAv2Gr3YhZh1vrl6HlCYbTGWzaFF50Ca+DHg2/zGXdYcGggZu/FKu4RLnjYQ4ogXGfDB1WO3T6vbw/gLMIe8UVb6KHnj768HsMK7aEL4+URuZzaGKlC7Qnp9uimKZV7PAWr11+TuJHtPBkvSbRKKjR92lTt5ndttY7aAU9hYBmZPT/5PMGYI74+auKskympM44RO01g2YMitrVXiyQ1oBgUReEyavOBaW70R3G0tjSvu6g1Iv7wIhRnmHYaKO7e4kKrbSfFWspQALcdBrfa8xxNJDDhWrXZIo69/ycaC00zga0A9UEZ+iTxygeNq8w==^1753118438298; bm_s=YAAQD2ZWuN95hyeYAQAAmtsALgOHMwxvh1iL425Gb3YYuTZgCzCdJILAoPNbMuRdXbYI1YR+JMliDayXSYIU9jRIXBwNev50BVgUHNPETkFU4zNySkkUoi80dW2j88QoV1tIACJqfADS8X9sn7FZEkRDMrmfuaL86/MFLW/x+OJmVnr2gScARwvjDWNamQrU6IWOI/xWYnepS1T9t2A6O3YEbk3/Jp3d6ciXAXs9Vx203CHuBgqLrsELw/9dkx9wQSRq2h00UrPoDvl4PFHKR24zr9uM2uKnIvfe1Y8sbddSVJHV9IWydQsn3qlHdjwSt3a0hCsLSCGsE6tnhmt0mI6AO7KX2exjKgZBX6MP/bgLgA1yrroR9FtzP5+lVXmeRk4CmWSxXmVKndIX6dZWRr2crcg+m/u0E+ETCSBA1al1jcFVifrzar5zIMTadfe8cM7pICnSgFAPNAgfcmuYdO/UQYUEwZ99FuzUzhDF27lNwEJSb3wVkqr5KXbAjD1jmowSL2vCqNW+Jl3CKwAJV89ZeofbYlZ85IsP+/xwnMTffrnfAzZ+AZ3wUaRTTlk+fjI0; bm_so=2B9F266D3265FE6098DDE9ADA27936926F58643477DB957875975CD6ED02015A~YAAQD2ZWuOB5hyeYAQAAmtsALgSeJF1SlJ2qwgNDirlAmU73PANNXqHmn7MF/pdg71WurUX1IZthSrY7vMwb5xwHQ7kLj1FhpkDbhDaqgFsKIhagaDeXryAGGZx4RjKNCb+7ehFlVLNAIsLMz3GnYXGW63m6SLUJanbLnhnKij+LNakETrXiuIgK/hfaXW0JzGXFKF70cnPkPNYsw+6H93RLNmP24MdhMVtuG2Ocx6VVtn0TRSI4cqismMdanGkCx/in7zXBWYTeHiPdSJorSuJWt16QCxm4Wb/juORPVO9amcYexBXMOXKEIXebh077qfEm+sK2l+qeXxQcRVPkZJWV1BhnqxP/2iCK2iedfDHbbu0E0IWb00UtWtGwknUchStfa8fCe4TzJuozMHoBKcYZdHUu6xD8iJiFQqJCfv9MJ6s+/QVi35uMo39M20VofkcGpSkQuBxF0myrmw==; bm_sz=FBD856478CD95A8DBB4FCA74838E3809~YAAQD2ZWuOF5hyeYAQAAmtsALhwMxKRQw4gOuEdh/rMT7VYS8diAKAxLHypAj2s85WdT6NP5XaTBQTnB+MEB/y3oKsGpx6+ZBZBWsBi38O0VTKgDAMaYjUokHfj2pOG6clz9Iqz5MtHoKWWRNvmKRoWO+OmiD8+c5Pf1JXsWcif9KPGJDDB/ppbsUgmD3T7ogTxZY8ZI55VFkLhpr8Clb1iQDyLeWp54892OgOXDO4+I0x4LSDMC9mUE4HUeVWrBzoNSBt/s2HI/ngaCl8N4q3lJL9hFyUjmGUMuwELuDKRWpUvgHri2KA+KDnNOFqIio0SzRFZUwHlT91RPsGGWsKCCYn16wvawlCuoO6Xm9Iwcvta0VlzDvVQTzhlljxk+tuh/mQ3ioWzY73MWKvaNWWbS2e9N6y4MYEFyxYQR4oTFgJdAtfH3gzQfUrIonB+1NIEHOo/srEWCEWunkNCXciwpw9l5hfyZRwf5~4535606~4536113; _abck=368CA328B57229A26CC8FECFEBA26B32~0~YAAQD2ZWuOR5hyeYAQAAbdwALg4hpAlbhjGX4FDMBkAvJ3XSKN/SUEPgtLCFZNl7Ve1Qsrd9k3wsSUNOECWavJu/9nfXmgJWrre5zi1/qL0inscgAqTU/+xHd4jqtgSJiIO7adHMEeAJnY82N7hDQewsKn9Aps4krFC08GlZLLOMtuH91jsFrcC8v4OrjoZvlCO9x3LpCgQBJPruDEEHBHmDsLMwXS6bL22QkMOM/FlR3CMijtJ8GZBnrgolGD3bb2YjsjaotivEdoQn3lcBzLi7TyK+ATwG1o+CPYMBI3Okw+TTQta2c1KfaaBUBhGxkyAQl4lx3Qf7nIfO6rXBqNtfCTJzRFoAiGASlgOLlWZBGCKgnnNpJlw7Zb9ir9N888KiYrK4hv9S8iQUD/oaCOQ6P8eDe+kewvDO/EjnKxGDuIfq1opecAxfSwSNchRK/j46G25c6Bl3dryTsTP22LwEarcm5k5msCXuLffSZola6kc0n2Up3sC8fA4fi8cMRhgIFHG+zEaUhn7ZOwUVSMmSRunvuDMHYaZr0D2rwlaP6+PHyzXQDV6bTbRbwtprqSgKc1H1ai/8rGfr3rNtwFXcfO1bwluCpEomaWC1myYvk+PS/lBDfPW3JqP2X3XrMMbntC/69+PnNV2yE4ZtjfbZeXbZ2QbUIZuxDxJR9QVqt4Whl/YeR7/33MaaJCs9bB7rlP4jquosoVb0/PF63JC6cd+C2fT8TXVRk48jrmJ4ineLzE9Hcd+7J00axuI51RxPHuLq/78d2zjeJkomcofovMAWYRNW7uuRHo5Q1D7GnTaTp1l9yclJsfGvN3odlSuJzfRHBzv1PiPEayeyooKP2fyvgmD3YNkkjbGN0p9Z4EJWKwTq~-1~-1~1753121960'

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
        const link = `https://www.tesla.com/tr_TR/my/order/${vinRaw}?titleStatus=new&redirect=no#overview`;
        console.log("araç bulundu");

        const msg = `*🇹🇷🇹🇷🇹🇷🇹🇷🇹🇷🇹🇷🇹🇷🇹🇷\n`
          + `*🇹🇷Fiyat:* ${priceNew}\n`
          + `*🇹🇷Renk:* ${paint}\n`
          + `*🇹🇷İç Döşeme:* ${interior}\n`
          + `*🇹🇷VIN:* \`${vin}\`\n`
          + `*🇹🇷🇹🇷🇹🇷🇹🇷🇹🇷🇹🇷🇹🇷🇹🇷🇹🇷🇹🇷🇹🇷`;

        await sendTelegramMsgWithButton(msg, "🔗 Sipariş Linkini Aç", link);
      }
    } else {
      console.log("araç yok");
    }
  } catch (error) {
    console.error("Tesla isteği hatası:", error.message);
  }
}
setInterval(fetchTeslaInventory, 12000);


fetchTeslaInventory();
