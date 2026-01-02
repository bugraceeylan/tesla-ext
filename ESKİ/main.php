<?php

// $url = "https://www.tesla.com/coinorder/api/v4/inventory-results?query=%7B%22query%22%3A%7B%22model%22%3A%22my%22%2C%22condition%22%3A%22new%22%2C%22options%22%3A%7B%7D%2C%22arrangeby%22%3A%22Price%22%2C%22order%22%3A%22asc%22%2C%22market%22%3A%22TR%22%2C%22language%22%3A%22tr%22%2C%22super_region%22%3A%22north%20america%22%2C%22lng%22%3A%22%22%2C%22lat%22%3A%22%22%2C%22zip%22%3A%22%22%2C%22range%22%3A0%7D%2C%22offset%22%3A0%2C%22count%22%3A24%2C%22outsideOffset%22%3A0%2C%22outsideSearch%22%3Afalse%2C%22isFalconDeliverySelectionEnabled%22%3Atrue%2C%22version%22%3A%22v2%22%7D";

$url = "https://www.tesla.com/inventory/api/v4/inventory-results?query=%7B%22query%22%3A%7B%22model%22%3A%22my%22%2C%22condition%22%3A%22new%22%2C%22options%22%3A%7B%7D%2C%22arrangeby%22%3A%22Savings%22%2C%22order%22%3A%22asc%22%2C%22market%22%3A%22US%22%2C%22language%22%3A%22en%22%2C%22super_region%22%3A%22north%20america%22%2C%22PaymentType%22%3A%22cash%22%2C%22paymentRange%22%3A70000%7D%2C%22offset%22%3A0%2C%22count%22%3A24%2C%22outsideOffset%22%3A0%2C%22outsideSearch%22%3Afalse%2C%22isFalconDeliverySelectionEnabled%22%3Atrue%2C%22version%22%3A%22v2%22%7D";

$headers = [
    'Pragma: no-cache',
    'Accept: */*',
    'Sec-Fetch-Site: same-origin',
    'Accept-Language: en-US,en;q=0.9',
    'Accept-Encoding: gzip, deflate, br',
    'Sec-Fetch-Mode: cors',
    'Cache-Control: no-cache',
    'Host: www.tesla.com',
    'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',
    'Referer: https://www.tesla.com/nl_NL/inventory/new/my?arrangeby=plh&zip=&range=0',
    'Connection: keep-alive',
    'Cookie: auth_session=40d50f9764; tesla_logged_in=Y; NO_CACHE=Y; teslaSSORefreshToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI5Skh4dlVBVVFfbDlBVXFhcHBrV2dLRDhRRSJ9.eyJpc3MiOiJodHRwczovL2F1dGgudGVzbGEuY29tIiwiYXVkIjoiaHR0cHM6Ly9hdXRoLnRlc2xhLmNvbS9vYXV0aDIvdjEvdG9rZW4iLCJpYXQiOjE3NTI3ODc0OTIsImRhdGEiOnsic3ViIjoiOTliMTMzODMtN2I0Yi00M2VkLWFmZDUtZTI2OTM4MTJhMTRiIiwic2NwIjpbIm9mZmxpbmVfYWNjZXNzIiwib3BlbmlkIiwib3VfY29kZSIsImVtYWlsIiwicGhvbmUiXSwiYXpwIjoib3duZXJzaGlwIiwiYW1yIjpbInB3ZCJdLCJhdXRoX3RpbWUiOjE3NTI3ODc0OTF9fQ.rXII1tkwa628Own3gdqFOoCi6Hb3o5mU-c2N4Ku0VLIHYqhB4viwKzrz0SRI-FosOQdCiIfGCvSP2154i7b0fhJCB10yPDep93k-K2D7hrd9zlUwNVlJnros5T9HEJ_OWWhQquq2Qtcc2u-RVWEoP6-rmMMJ6K5TtAhVeR0xwdFTxYPqnOGdUQ1Z4d8nfFU6cUfmTD-ut7iR39adzxJVAA27MFDtWRLUyDC_BZv2hiT-r5weLYYQgVOMSphW90cGjOzfruJxOWXKi-IXVM6PLYsvvcazpbYMQ0Hk2l6qX8GL3sOtw8RK53WsGHcJ9oW8gC--g573KeYFs3xU4J5_KQ; tsla-cookie-consent=rejected; coin_auth_session=0cb5ff4f2e2119d87025538225553c98; buy_flow_locale=en_US; bm_ss=ab8e18ef4e; cua_sess=27bd88f91fb87654049977542cb22daf; ak_bmsc=55380472D9B1AD2146BDA853E59C6852~000000000000000000000000000000~YAAQ7LCvw48pNhOYAQAAQn3uHRy+CTQeNZcPBZpnvBRvphyFXWpSIMgjwQqz7MdDZ4QyK5HjqmY6QKlRLehPLaFe8iAp408eFWQqe0r2otdn4mo21h/pRb7JITv3sfNo3/v7EKhuV2E4e+J+l/uV6f0mPub1AjXNbm4A5L6hVj8vFObd4fXUPZLgLfe/Bvk17dLD7lagZOAErgJdC+t9XzAc7LyISefJycBa9h8y2Od/xJ0nxSTnZLiC77+2KhXtaWJNMgAwMblJCOE6jpUFNMN30YFilDP3HSGwOG6b2Qkz7cyaqKsKKg9/3wC9eVgdaSaGO4VI4KQRsvBeAZ9VDLNAI0mQ/tmCeYiyfqxL6t3FaROUOUU2GogMFDZtnVLXQ+0E05Zo; _csrf=rZQ9LiGId34q9EZJLdi7-Cu8; teslaLoginState=bc41e495-f0f2-48c3-a126-b044d1d8cbc6; authTeslaWebToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjAyOTk4OTk0IiwiYWNjb3VudElkIjoiMWQ0M2NlYzMtZmUwMS00MDEwLTg1NGYtMDQ5NTYxMmNmNTEwIiwiZmVkZXJhdGlvbklkIjoiOTliMTMzODMtN2I0Yi00M2VkLWFmZDUtZTI2OTM4MTJhMTRiIiwibWZhRW5hYmxlZCI6ZmFsc2UsInVzZXJDb3VudHJ5Q29kZSI6IlRSIiwiZW1haWwiOiJzYXJhaGFsYW5pMDlAZ21haWwuY29tIiwibG9naW5QaG9uZSI6IiIsImlhdCI6MTc1Mjg0OTIwMSwiZXhwIjoxNzUyODQ5MzIxfQ.CKkZn9e5aTR7FDQ5YLaZKQoBYQFjqknrXN8qgyA-unI; teslaSSOIdToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI5Skh4dlVBVVFfbDlBVXFhcHBrV2dLRDhRRSJ9.eyJpc3MiOiJodHRwczovL2F1dGgudGVzbGEuY29tIiwic3ViIjoiOTliMTMzODMtN2I0Yi00M2VkLWFmZDUtZTI2OTM4MTJhMTRiIiwiYXVkIjoib3duZXJzaGlwIiwiZXhwIjoxNzUyODQ5NTAxLCJpYXQiOjE3NTI4NDkyMDEsImF1dGhfdGltZSI6MTc1Mjc4NzQ5MSwiYW1yIjpbInB3ZCJdLCJ1cGRhdGVkX2F0IjoxNzUxNjQxNTA0LCJlbWFpbCI6InNhcmFoYWxhbmkwOUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwib3VfY29kZSI6IkVVIiwibG9jYWxlIjoidHItVFIifQ.Bq1kjKGLzSFqrWLTPe0_89VmszoSneaTXNS1621FaJf6qaByhmYwzDWz8Pwid_UtTZ490PfWfrUYy7ZZEn6MygGan5PBcutDh40M0arwxGyKuqRAnQOXD6ybwLGtAwuz6Vh04zvRwZLiYPmy48ZjdBPur9UEipGjxro88qGSQWaj5bJnUm_Amt3d_Y_CWE0mabLbdvzQ4aaB8FkuONNIBjIcBS_uBor9H8Z05qUcExfXlckNpjcH9fu7RKdYhqD35shvWODyKNh1iWUeTes5eGVVun-mLdpLOWwSCcp5ZkOu8Dq8x08EEv0GDBJGB9Z-FAYP58oiHLASCCR0QfmoEQ; bm_sv=152B4A4139EA24F5D4D14EABA0AE68BE~YAAQ9LCvw81G1guYAQAAbPP1HRwmagLzUiEOGO5AH/aGic0Bcs/0jx9m+Fe4FbjWXs2fc1efx8KN9Gz+YpacsihOMYLbBakEGf6roF7Hpy3ICsCR+6K5mx0LZPQMYkhDR54R/9uW5I6nmMyoPWiMb8XTIi9dsvCGmMnU1jElv0kuWy53RYsTOrnISVrlH9qih+2RghtmLLwlJrY4cjoteC8+WsZxSLs4ds8K41cF1F8lW2X5c751MPZhDO9Dyd8n~1; bm_so=49EA750189E423B82CCC8DE970C1F20EC4F5E75FC52BB90A78CBCC0BDE6027ED~YAAQHrGvw2pRiAmYAQAAWRMSHgRLSsKoIzXhjw6enPlJohbf76LcxE21PPgv7TR9DcFOiu/1ifK/tiDXwpEA8m/oL3d+PWomssJU6Y3+SSTN0ll3e+fXVcG/utIyAdyXwb7rXhC24V5ErAONiQJUpkzNeXNKaIuJQbGKGKOTNg19Ndrr3XD9Tp6Ck/Q19drC0corRTAafqu1D4QCm3jaY8hInRMVdBzxHTmKDXzYWGVyrtQ7/diNH7lEEXCh+1WNOHbtyJ+8xHJQngx2t4cDHvnwCoeS92K5+XwPSjjhgVLAa+9wIRmowSgZjdit+Rm+OwQArWxg0eH6+Q6FmFCRV6S1q0/M3Ezo2hkg65nyFyyTOFMkwqrA4Oz5dWmRLtv9B6xifLuTnULO33kz6Z6F/aceFkY7dgmO7fQvFP3Y0abFnuiysN2CCKV5Lzjhyo2IXEhpOnPEgTX5QZw=; bm_lso=49EA750189E423B82CCC8DE970C1F20EC4F5E75FC52BB90A78CBCC0BDE6027ED~YAAQHrGvw2pRiAmYAQAAWRMSHgRLSsKoIzXhjw6enPlJohbf76LcxE21PPgv7TR9DcFOiu/1ifK/tiDXwpEA8m/oL3d+PWomssJU6Y3+SSTN0ll3e+fXVcG/utIyAdyXwb7rXhC24V5ErAONiQJUpkzNeXNKaIuJQbGKGKOTNg19Ndrr3XD9Tp6Ck/Q19drC0corRTAafqu1D4QCm3jaY8hInRMVdBzxHTmKDXzYWGVyrtQ7/diNH7lEEXCh+1WNOHbtyJ+8xHJQngx2t4cDHvnwCoeS92K5+XwPSjjhgVLAa+9wIRmowSgZjdit+Rm+OwQArWxg0eH6+Q6FmFCRV6S1q0/M3Ezo2hkg65nyFyyTOFMkwqrA4Oz5dWmRLtv9B6xifLuTnULO33kz6Z6F/aceFkY7dgmO7fQvFP3Y0abFnuiysN2CCKV5Lzjhyo2IXEhpOnPEgTX5QZw=^1752851159173; bm_s=YAAQHrGvw/BRiAmYAQAAWzUSHgNIK72C23jINFu+IKtP+lGp3hAmUqL+yt4ta5EL4YqdZZJaItbB5vI3QigfYLt6LGaaNFbpZFZnAbVHJD7MsB5sQU4fctltbPsQzjJsgXOfmoE+WUcWrbfVfnt5wrEY1aliX1oo3yVVAbSrA6on4Lg3gT5pfN25/IxHbZugndDHlb/kX0Ynerh6q94SQx9EAkZxMciUxo8HLxVCnO5NMDp1teheOgkE8wr9W7TEEGzNm3v46sr2tNW4BWPM0EphZ7Zx1EN9RcX+p96CvT9/rrc5okAISHiGXdvuUcDhYwWJ3ZFzwFZZh9a879NkxNAFFX8/oV1CfslUd/YiALb6bCMSHnndJykvJEW0BJTYepYVnrczrbhIQ2GKFPSjapnLeYvP3s8AGxbyKyqixbJpO5KRd+WmIhg9ZOOLcSoNG7dwMO9irLzlx7d/OXK5YZjWMAIO0BuWYvBIZTh1BWy7LaPw33BK362547fjCAhXNvlgT0gOE3XDZ6fL2KXFQPid94pjTJghO8rdZINCeBZQJMizs7QOF+aH+G0JkPE=; bm_sz=CEDBD02CB80777421FF334ED4403EA9F~YAAQHrGvw/FRiAmYAQAAWzUSHhySzgKafCr1WeVykEwwp10J2QxcSSRBfbqhOuzxggNmEfwILR5WRO2OMDkfZPR/6K/t8V6rbcgSvBk8V8gY9SaIT5EstqTex2cKU1lRnqfHhoUYIMkoxXrC2hvvDVmjwQF+IexHyh9BmFbiMLotPJJzl748CM9dUu53bvzasz/p9R23lw/QhoILxZVNo6xBzt+vlPuC8a4tkOcBmjMk4CsWaRBtlJNcrNoFqXuWaz1bpOnMYGSZMzzFWcXJk+q2LHvmMz7K0G65MHELe1qbco9eMLOMZfl9TZpbTB+v24t/rZEcXHyCYy8G3zqPBLk/zf54wUKT1fqmkVx4qsOCVP7IytblhrdBpmNlyz5ZMVCFFM7CNVyZwzu1WIhOmRalQdX0tm1L79Lo5ad2G4J3iplF2+3ijGqbhhbV5wBWlH9LtLX8n9pV00MD3drF1J2z89dKibcuHzXLVLpnVK5zrDELmg4vs1B389zDARLg9DtpwOm+TjOoHbJFzK2iqpJmtAF9E1w=~3488069~3553332; _abck=C39E61C899B79F26EE241C5E7A4A4F20~0~YAAQHrGvw/JRiAmYAQAAyjUSHg7Y3/IVsF7qtyOUkmW2rGofcU5J0YuPxxMMg3tApSKGEqubfjYv88hvU6OYSAGfSnsQOzxvXjwSqQAaSM9HBgMXAsjWmsCyasOPuuuoi4G9x5L4vHm/knaknoulyh/6p1euomZ/Zb6mZ07RnLoo3tu28NfetnlATreYoQfvmzXiRWpbhOJbMyXjXs0pXIYzehCW2S9x1Kp1jTXO4Abvbl43OD2LOjkY5W+0CX/eklJ4owaai7duoFMZrcWhZApnGJidCp/5Ko0E3p2KRG3ER/sTq3qPfI3lPKXIXQpq0ckvTZ9jiAQVWH4MAs809pkpHan6RkXij5kO6Y3Azd2CrzoSla/ACrdiX3Cod4Z85hsK8wcsbjrC1Spxa7JlQeSEB1SJ/SLrbnZTbUDj2O51/Fh5Cb5PIgj9+YeydwfrvOeKs9cBfKN2jTEoFiUiUdEq2w+aYnSHFHQRPE+A9sZhXjOgPl1xkeTdBBnNtaq9qqbg0mMqpJp7uFAPdLoJKYKp56PZ6Tax0dzG2Cr/mrnAMUIdL1Rwjy3eST+4PZlAR7AtiUTtIgtXlEiIu3BuK39DpOdlMGHhw1k4YRJCxRqDTv6Jl2UMzCvX36WWSyxvX+leedCq3/tlyVJh3uma/xxen08jrfQ42tbD2DiXBLTIlsMr/pzTzGCSTyiL94fhcrT8RHIj0SrRAYNixypbgOTNAWBlMz+3cEM4s/SwpCjEGN94WgvGWatFGPOSvGs8yeIm5fkZ2eRVF/E5vW2Ph5uo8JB/EfLiLuXJRcJ7dSwdM0DbZk5hvXN/naFzcHa0OajbOKfrPP709KHREckq39asJvQK4qQe7whCd9Zsn4mijRKDUURwEpin++Lap332791PVesxzSTd7oleVuaxaGn3Zf6tTALNUQ==~-1~-1~1752851813'
];

// cURL başlat
$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_ENCODING, ''); // --compressed karşılığı

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo 'cURL Hatası: ' . curl_error($ch);
    exit;
}

curl_close($ch);

$data = json_decode($response, true);
// var_dump($data);

if ($data['total_matches_found'] > 0) {
    foreach ($data['results'] as $car) {
        $price = escapeMarkdownV2('$' . $car['PurchasePrice']);
        $priceNew = escapeMarkdownV2('₺' . number_format($car['InventoryPrice'], 0, ',', '.')); // TRY için ₺ ve formatlama

        $interior = escapeMarkdownV2($car['INTERIOR'][0]);
        $paint = escapeMarkdownV2($car['PAINT'][0]);
        $vin = escapeMarkdownV2($car['VIN']);
        $vinRaw = $car['VIN']; // link için escape'siz

        $link = "https://www.tesla.com/nl_NL/my/order/{$vinRaw}?titleStatus=new&redirect=no#overview";

        $msg = "*🚗 Tesla Bulundu*\n"
             . "*💰 Fiyat:* $priceNew\n"
             . "*🎨 Renk:* $paint\n"
             . "*🪑 İç Döşeme:* $interior\n"
             . "*🔑 VIN:* `$vin`";

        sendTelegramMsgWithButton($msg, "🔗 Sipariş Linkini Aç", $link);
    }
} else {
        echo 'araç yok';

}

function escapeMarkdownV2($text) {
    $special_chars = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];
    foreach ($special_chars as $char) {
        $text = str_replace($char, '\\' . $char, $text);
    }
    return $text;
}

function sendTelegramMsg($msg) {
    $chatId = "YOUR_TELEGRAM_CHAT_ID";
    $token = "YOUR_TELEGRAM_TOKEN";

    $url = "https://api.telegram.org/bot$token/sendMessage";

    $data = [
        'chat_id' => $chatId,
        'text' => $msg
    ];

    file_get_contents($url . '?' . http_build_query($data));
}

function sendTelegramMsgWithButton($msg, $buttonText, $buttonUrl) {
    $chatId = "5921826319";
    $token = "7579041856:AAE7mh3O3b-VIjaNjRGGGAqIJhk3rYLAFrI";
    $url = "https://api.telegram.org/bot$token/sendMessage";

    $data = [
        'chat_id' => $chatId,
        'text' => $msg,
        'parse_mode' => 'MarkdownV2',
        'reply_markup' => json_encode([
            'inline_keyboard' => [
                [
                    ['text' => $buttonText, 'url' => $buttonUrl]
                ]
            ]
        ])
    ];

    $options = [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($data),
    ];

    $ch = curl_init();
    curl_setopt_array($ch, $options);
    curl_exec($ch);
    curl_close($ch);
}