// config.js
export const config = {
    // 1. ADIM: KİŞİSEL BİLGİLER
    personalInfo: {
        firstName: "Adınız",
        lastName: "Soyadınız",
        email: "eposta@adresiniz.com",
        phone: "+905xxxxxxxxx",        // Uluslararası formatta (Türkiye için +90 ile başlayın)
        address: "Adresiniz",          // Sokak, Apartman vb.
        city: "Şehir",                 // Şehir (İl)
        postalCode: "Posta Kodu",      // Posta kodu
        privateVatId: "TC Kimlik Numaranız"  // T.C. Kimlik No
    },

    // 2. ADIM: KART BİLGİLERİ (String olarak girin)
    cardInfo: {
        cardNumber: "4546 7112 3696 7084",
        cardHolderName: "İsim Soyisim",
        cardExpMonth: "07",    // "01", "02", ..., "12"
        cardExpYear: "2029",   // Yıl 4 hane
        cardCVV: "123"
    },

    // 3. ADIM: TESLA ve CAPTCHA BİLGİLERİ
    tesla: {
        // **Bu cookie bilgisini botu çalıştırmadan hemen önce güncelleyin!**
        cookie: 'auth_session=8eeb854c5f; tesla_logged_in=Y; NO_CACHE=Y; teslaSSORefreshToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI5Skh4dlVBVVFfbDlBVXFhcHBrV2dLRDhRRSJ9.eyJpc3MiOiJodHRwczovL2F1dGgudGVzbGEuY29tIiwiYXVkIjoiaHR0cHM6Ly9hdXRoLnRlc2xhLmNvbS9vYXV0aDIvdjEvdG9rZW4iLCJpYXQiOjE3NTMxMTgzNzAsImRhdGEiOnsic3ViIjoiNGE2MTIzMGItNjkwZi00MzRmLTllZWEtMmJjZWU4YzkyNzAwIiwic2NwIjpbIm9mZmxpbmVfYWNjZXNzIiwib3BlbmlkIiwib3VfY29kZSIsImVtYWlsIiwicGhvbmUiXSwiYXpwIjoib3duZXJzaGlwIiwiYW1yIjpbInB3ZCJdLCJhdXRoX3RpbWUiOjE3NTMxMTgzNzB9fQ.fTnT2Q9yZ3o_4BAJX9MR9jafSrJPuWmSj_HGClNtScI5v-6x-iXVbpEv0k32cjS2DDVbK9nCQrsdjutAyp3ZfZOg6k604_X5ZhDtZXkaz8CBIlaiw_-0NMh5Xg_-ohKvNYRgplRSChLXbjYVQ_AaoMzTuOqQD02Sf_I9fr9A4K0RZjyg24o4o_M2tvc9n2DGUrK7Pjeb1L2s5gl9NnuiZrOVPLZuNq7j9nsdEV_dFSgookotQ2azSj0pn8ZSICTucg74jpRdSkgC_ClvdalWe5O3724Dk5djZigl6QUOUpazeXwAIJX_j7IaA-D3TUxSYHQ7Gep3LHqo4rRYXn3khA; tsla-cookie-consent=rejected; authTeslaWebToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjAyODg4OTk0IiwiYWNjb3VudElkIjoiMDRkYzc5NzAtMGU1ZC00Y2E0LTliNmMtYTY1YTFlZWFlOTg3IiwiZmVkZXJhdGlvbklkIjoiNGE2MTIzMGItNjkwZi00MzRmLTllZWEtMmJjZWU4YzkyNzAwIiwibWZhRW5hYmxlZCI6ZmFsc2UsInVzZXJDb3VudHJ5Q29kZSI6IlRSIiwiZW1haWwiOiJtZXJ0ZmVydGtlcnQxNUBnbWFpbC5jb20iLCJsb2dpblBob25lIjoiIiwiaWF0IjoxNzUzMTMyNTMzLCJleHAiOjE3NTMxMzI2NTN9.KdNjfMlPh6jvSTVKFpMD1DLjDRtqszpIZMXK3T6vhkw; teslaSSOIdToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI5Skh4dlVBVVFfbDlBVXFhcHBrV2dLRDhRRSJ9.eyJpc3MiOiJodHRwczovL2F1dGgudGVzbGEuY29tIiwic3ViIjoiNGE2MTIzMGItNjkwZi00MzRmLTllZWEtMmJjZWU4YzkyNzAwIiwiYXVkIjoib3duZXJzaGlwIiwiZXhwIjoxNzUzMTMyODMzLCJpYXQiOjE3NTMxMzI1MzMsImF1dGhfdGltZSI6MTc1MzExODM3MCwiYW1yIjpbInB3ZCJdLCJ1cGRhdGVkX2F0IjoxNzUwMjU3MTQ5LCJlbWFpbCI6Im1lcnRmZXJ0a2VydDE1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOmZhbHNlLCJvdV9jb2RlIjoiRVUiLCJsb2NhbGUiOiJ0ci1UUiJ9.RjRV-si9HF43soSraNwwKJeh_z7PlY_vJA8kTHYI5y7104bKDoUOKqKzekiHFyAzYi2fg9_wTyLTiz8GVAGmY0ZGMAjBGeMmPqAs0T7mTQ-n7tgKGCDg8L5BQ0foJwjhiO736XTGrwXEolrZpPVpmi745BDweB3SZ55esPirXhcH9YPea0Y4zKjQ-dhkJjY82B5N5sTyGix9U_C6M2LvyNxrCHqw9AnBGlpGqBJgeX7_hEecE4EGKNzXZZidMn1cK1kg9zxKrxYB0MXTcrUHBVrdtMhpEdyNN0zvM7s2JxunWjL_Y2SiSsMtBNPVcK49E2nXl4GG_-5Sm0e4Ua2rIA; coin_auth_session=19e7d35cb756427558e9639100e22e08; optimizelyEndUserId=oeu1753133889586r0.48625608015113275; optimizelySession=1753133890627; bm_ss=ab8e18ef4e; bm_so=F87B689903692E97B7FC8BFB38667ACEE270EA20FF410BB72F1CB87B56214303~YAAQT48UAlJQrBSYAQAA9aAWMgR2TGJFt2dLMaLDcbk7tIvPA4UbHG764O2reKRllj0X4PHMgXKg5Sz7dy2Bei7hKd5n+q4zUupx5pyhnYlwgOahXSBTPWzXPsIlGFmjSbmId9oEXQ1wemQOMjZA2Jfree8SZbgoz0Z6rZ5gEbSiszsM1wNej1o5xQpK3IIfBSUuh5TQlLL8Ehq9GysyfM1ENVlyBQL2ztjJ0i8u5S6nbvUoPMVgCuWVcJFUvjzvi/AaY2GgVrZd94a9/hT1JwkkYsP75QouXoFIH8LkeeuNgM0uB9waiJMvW+gOTB0es1n9Vo2XA8BDtFtEGltIEc8nXa1vy4fTiUtzY3rqvZeMQeplVsnCvpJ5K9f97SNxmut051aLSA0Kq1iVtSF3Ut/dGQ311jOdzi45VJP7U/5VAbjBNk6JOPNx84SQ3vCRmvIoIgdsfuI7EqTFYg==; bm_lso=F87B689903692E97B7FC8BFB38667ACEE270EA20FF410BB72F1CB87B56214303~YAAQT48UAlJQrBSYAQAA9aAWMgR2TGJFt2dLMaLDcbk7tIvPA4UbHG764O2reKRllj0X4PHMgXKg5Sz7dy2Bei7hKd5n+q4zUupx5pyhnYlwgOahXSBTPWzXPsIlGFmjSbmId9oEXQ1wemQOMjZA2Jfree8SZbgoz0Z6rZ5gEbSiszsM1wNej1o5xQpK3IIfBSUuh5TQlLL8Ehq9GysyfM1ENVlyBQL2ztjJ0i8u5S6nbvUoPMVgCuWVcJFUvjzvi/AaY2GgVrZd94a9/hT1JwkkYsP75QouXoFIH8LkeeuNgM0uB9waiJMvW+gOTB0es1n9Vo2XA8BDtFtEGltIEc8nXa1vy4fTiUtzY3rqvZeMQeplVsnCvpJ5K9f97SNxmut051aLSA0Kq1iVtSF3Ut/dGQ311jOdzi45VJP7U/5VAbjBNk6JOPNx84SQ3vCRmvIoIgdsfuI7EqTFYg==^1753187001754; bm_s=YAAQT48UAvJRrBSYAQAAdckWMgNc1FgdmKAArd/FeISeIqx20NScyqJ5cjqjLfpOk/Tnfxad6QuXl5/bNr9EDmFE+vh7byofBm/WKiyuvNItF0SuvRZfuiYJkKWdzw4ih0oxgzWXE06dch7uh5Ki+ZG/JRZZdFGOHTA23SjdBaR0eGd/t7ZI1Pfbg/sUtrhrgqV5uUgNKCtKJskw2vVYYlV5S+lW6P24L+yzcYD5xJRSW5ILjq4KoBtUMxPZnyMw8xMe069iVfMFd886qfIWPqoCoxdfMCbh6i/MbOSDWJOzh0rIYJG0bBQIXUTsUrOGQwB+MNm/jMSfY06T5Od9db1nib2I3szrxFtmud/ibOYAYiSWe0Ue/qXlaM0OMp5aNTwpu746RWdvQ9OhIEvGUFB4KI7Tnu04ZmSi6j/FV4VTwGb2dzu62OlrVQC4oO8SAMDzadX8hD7bVfwIlA0AOIYrSg0zIcnujvlntI3WJtiNMaxsFhC5gnbVGvLVLPBi2lJJFi+tms8noJd9uMh+XYEpy/WEpoBPyUheb9KBL+5FIwRg+M4jY9GmB526xDexGA49; bm_sz=59E958E07126D559B0635752C3BFBD3D~YAAQT48UAvNRrBSYAQAAdckWMhyi6RlMajeVfHdoIpQNvyou+u32nrH200PoNIDMyzzbV5srCl4/rTRUg7A/UVwZZ1i7efQX8TaH7US7yh9KaeKDmGZHotuxvr58xDb5KwYfvM0xs4zhCazZ8cfCcW6cygRdBvoO640KQ/Va8BwO75uLZnYxmnMdpS3pa8HQhUNGV3vRogxeWJ7YCcb2ENG3WdLRuk65FisXWdGPa8lfzIK6w/cdy3PpRsglRlhdCWDvj0yDRO6zMAJ4VRDen/KHBTJnLsaQy3HdJ8iznGd0hwxtw3vvLymyca1D2qAopphKf90/yeyJhQj3RfPxexDE98+AZkh91hGaqFfjzsQsWFDiwiJOSKl3H+vi0xpgKEk/TviLxQ789xN3lBCLFJuM0+E=~3749427~4536385; _abck=368CA328B57229A26CC8FECFEBA26B32~0~YAAQT48UAv5RrBSYAQAAq8oWMg7M7P0LE2AZ8NxxQ+GJBzLTncxl2kPkvq6+cbXhP8icGnwdfvoTcVlh9PTkxAbgXhJ8Q3CQaqFgqHGMLkgKGaxN+fjDt4KF8Z986y9GgW8TkPCr+r3dNrjgC0qrNf7lu75FBSIxusZropmjwAAQ8QSR4BlZY7K0aRAEi0QCGLhaHysPflziHo1TTElYdQeCdGpkv9iYjFcDnnwnAuM7PWx26nT7Oy/W0qFp5AsO3bHxVdqpHhFvTr2jGuvGbqvxsZXZS3LS7J+2COc+wp+v4AZud6znN+sh8uLVtdypm/0P7qUXvSl8OjpncpdVIpIN2+JY2xuKBDaVNrfMQerbdqeRE7wYNg1ZluNhWC/JaqYYqqO9TrLSqqtcX0HeHFUTGdBuzpPbpzvB9AcKnwNuovxmMMJyY6niLgaYDlSJ2vD9goKTh8j5Q9ZXWAa554A4AL0lcckTe5CygN7p2vFpwHA8en4XDbkEaAnjI57TTLnCwRZaHstieECytsnl1s4lBJh5pHb0+/7mPHZnsmeNSjh7ZwTMLch1P2ReZ6Wk5daqiGtQQ2CXq8/yA2nB1hk9B7qxzY5e/Xuej6/gowl9vpm2O1+/zeDp4MtCnA6L3gTE5XLCU6DCQkUnYhmFJE9cVTGYVRpUxo1sI2d0xbntyuIbu4Dfr4wTckNSirzDzwqFJiw+5LVYLpBgDAOag2PhBzncANtQ7ifB6MD3fPW2bGhtdOI1OWb1JqyB9SJWe/5JX92XO0xhEsqctrYL9THsSK8R243IXarvfwRtHgCG+qsC8ggKgetzmbi7QuX7HcfkX6uCjEUy763XLyLH~-1~-1~1753190601',
        hCaptchaSiteKey: 'eede822a-c29e-46fa-8d88-ad9e06da386e'  // Tesla Türkiye hCaptcha sitekey
    },
    captcha: {
        apiKey: 'f41cba8b36ed07702e7510d111eef9ec' , // 2Captcha API key
        proxy: '72.10.160.90:5985'

    },

    // 4. ADIM: BOT AYARLARI
    settings: {
        pollIntervalMs: 12000,            // Envanter kontrol aralığı (ms)
        deliveryLocationId: 114518485,    // Tesla Teslimat Merkezi ID'si (Türkiye için güncelleyin)
        orderAmountEUR: 250,             // Hollanda için depozito (EUR) - test modu
        orderAmountTRY: 175000,          // Türkiye için depozito (TRY)
        headless: false                  // Browser görünümü: false => görünür (3DS için önerilir), true => arkaplanda
    }
};
