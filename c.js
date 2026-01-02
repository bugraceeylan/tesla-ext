(async () => {
    // --- 1) Kütüphane import’ları ---
    console.log("[1] Başlatılıyor: Kitaplıklar yükleniyor...");
    const {
      switchMap,
      bufferTime,
      filter: myfilter,
      concatMap,
      timer,
      exhaustMap,
      firstValueFrom,
      ReplaySubject,
      from: skypackFrom,
      retry: retryFun,
      map: mapFunc,
    } = await import("https://cdn.skypack.dev/rxjs");
    console.log("[1] RXJS yüklendi");
    const { webSocket: myWebSocket } = await import("https://cdn.skypack.dev/rxjs/webSocket");
    console.log("[1] rxjs/webSocket yüklendi");
    const { fromFetch } = await import("https://cdn.skypack.dev/rxjs/fetch");
    console.log("[1] rxjs/fetch yüklendi");
    const lodashLib = await import("https://cdn.skypack.dev/lodash");
    console.log("[1] lodash yüklendi");
    const { hCaptchaLoader } = await import("https://cdn.skypack.dev/@hcaptcha/loader");
    console.log("[1] hcaptcha loader yüklendi");
  
    // --- 2) Kullanıcı & Bölge Bilgileri ---
    console.log("[2] Kullanıcı ve bölge bilgileri ayarlanıyor...");
    const fullName      = "Rifat Kaçar";
    const firstName     = "Rifat";
    const lastName      = "Kaçar";
    const streetAddress = "Damrak 123, 1012 LP Amsterdam";
    const city          = "Amsterdam";
    const stateProvince = "Noord-Holland";
    const zipCode       = "1012 LP";
    const email         = "minionboob630@gmail.com";
    const phoneNumber   = "+31 6 12345678";
    const privateVatId  = "";
    console.log("[2] Bölge: NL_NL, kullanıcı bilgileri yüklendi");
  
    // --- 3) Bot & Filtre Ayarları ---
    console.log("[3] Bot ve filtre ayarları...");
    const inventoryPath        = "inventory";
    const bufferThreshold      = 100;
    const buttonId             = "hc-captcha-btn";
    const captchaSiteKey       = "8d3aee53-3b2b-414d-b043-a67de5b00328";
    // Sadece CSRF token’larını tutacak subject
    const csrf$                = new ReplaySubject(1);
    const paintFilterList      = [];
    const interiorFilterList   = [];
    const excludeWhiteInterior = false;
    console.log("[3] inventoryPath:", inventoryPath);
    console.log("[3] siteKey:", captchaSiteKey);
  
    // --- 4) No-Cache çerezi ---
    await cookieStore.set({ name: "NO_CACHE", value: "Y", domain: "tesla.com" });
    console.log("[4] NO_CACHE çerezi eklendi");
  
    // --- 5) hCaptcha render & token ---
    console.log("[5] hCaptcha loader bekleniyor...");
    await hCaptchaLoader({ sentry: false, render: "explicit" });
    console.log("[5] hCaptcha loader yüklendi");
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<button id="${buttonId}" style="display:none;"></button>`
    );
    console.log("[5] Captcha butonu DOM'a eklendi (ID:", buttonId, ")");
  
    const captchaId = hcaptcha.render(buttonId, { sitekey: captchaSiteKey });
    console.log("[5] captchaId:", captchaId);
  
    let captchaToken = { response: null };
    try {
      const t = await hcaptcha.execute(captchaId, { async: true });
      captchaToken.response = t.response;
      console.log("[5] İlk captchaToken alındı:", captchaToken.response);
    } catch (err) {
      console.error("[5] captchaToken alınırken hata:", err);
    }
    setInterval(async () => {
      try {
        const t = await hcaptcha.execute(captchaId, { async: true });
        captchaToken.response = t.response;
        console.log("[5] Yeni captchaToken:", captchaToken.response);
      } catch (err) {
        console.error("[5] Token yenileme hatası:", err);
      }
    }, 120_000);
  
    // --- 6) Başlangıç CSRF & Yenileme Akışı ---
    console.log("[6] İlk CSRF token'ı alınıyor...");
    const initRes = await fetch(`https://www.tesla.com/${inventoryPath}/api/v4/sesscheck`, {
      method:      "POST",
      credentials: "include"
    });
    const initData = await initRes.json();
    csrf$.next(initData);
    console.log("[6] İlk CSRF hazır:", initData);
  
    timer(60_000, 240_000).pipe(
      exhaustMap(() =>
        fromFetch(`https://www.tesla.com/${inventoryPath}/api/v4/sesscheck`, {
          method:      "POST",
          credentials: "include"
        }).pipe(retryFun(), switchMap(r => r.json()))
      )
    ).subscribe(data => {
      csrf$.next(data);
      console.log("[6] CSRF güncellendi:", data);
    });
  
    // --- 7) WebSocket Envanter Akışı ---
    console.log("[7] WebSocket akışı başlatılıyor...");
    const ws$ = myWebSocket({
      url: "ws://localhost:8000",
      deserializer: e => { try { return JSON.parse(e.data) } catch { return null } }
    });
    ws$.subscribe(msg => {
      console.log("[7] WS mesajı:", msg);
    });
  
    // --- 8) Gelen Verilerin Filtrelenmesi ---
    console.log("[8] Envanter filtreleme akışı oluşturuluyor...");
    const inv$ = ws$.pipe(
      retryFun(),
      bufferTime(bufferThreshold),
      myfilter(batch => batch.length > 0),
      mapFunc(batch => lodashLib.shuffle(batch).filter(v => v != null)),
      concatMap(arr => skypackFrom(arr)),
      myfilter(v => v.CountryCode === "NL"),
      myfilter(v => Array.isArray(v.PAINT) && v.PAINT.length > 0),
      myfilter(v => {
        const ok = v.TrimVariantCode.startsWith("RWD");
        if (!ok) console.log("[8] Trim filtresi geçmedi:", v.TrimVariantCode);
        return ok;
      }),
      myfilter(v => !interiorFilterList.includes(v.PAINT[0])),
      myfilter(v => !(excludeWhiteInterior && v.INTERIOR?.[0] === "PREMIUM_WHITE"))
    );
  
    // --- 9) Rezervasyon Akışı ---
    console.log("[9] Rezervasyon akışı dinleniyor...");
    inv$.subscribe(async vehicleData => {
      console.log("[9] Araç bulundu:", vehicleData.VIN);
  
      // Burada sadece CSRF subject’inden alıyoruz
      const { csrf_key, csrf_token } = await firstValueFrom(csrf$);
      console.log("[9] 🔐 Kullanılan CSRF başlıkları:", csrf_key, csrf_token);
  
      console.log("[9] 🔄 Rezervasyon isteği gönderiliyor...");
      const orderRes = await fetch(
        `https://www.tesla.com/inventory/api/v4/order`, {
          method:      "POST",
          credentials: "include",
          mode:        "cors",          // <-- CORS modu ekle

          headers: {
            "Csrf-Name":         csrf_key,
            "Csrf-Value":        csrf_token,
            "X-Requested-With":  "XMLHttpRequest",
            "Accept":            "application/json",
            "Content-Type":      "application/json",
            "Origin":            "https://www.tesla.com",
            "Referer":           window.location.href,
            "Accept-Language":   "nl-NL,en;q=0.9",
            "User-Agent": navigator.userAgent  // Use real browser UA

          },
          body: JSON.stringify({
            BrowserInfo: {
              Browser:           "Chrome",
              OS:                "Windows 10 64-bit",
              BrowserVersion:    "136.0.0.0",
              DeviceType:        "desktop",
              activitysessionId: crypto.randomUUID()
            },
            Vin:              vehicleData.VIN,
            isUsedInventory:  false,
            market:           "tr",
            language:         "tr_TR",
            model:            vehicleData.Model,
            VehiclePrice:     vehicleData.PurchasePrice,
            optionCodeData:   vehicleData.OptionCodeData,
            hcaptchaResponse: captchaToken.response,
            Payment: {
              PaymentType:           "CREDITCARD",
              CurrencyCode:          "EUR",
              PayorName:             fullName,
              BillingInfoDetail: {
                Street:       streetAddress,
                City:         city,
                StateProvince: stateProvince,
                ZipCode:      zipCode,
                PrivateVatId: privateVatId || null
              },
              OrderAmount:          Math.floor(vehicleData.PurchasePrice * 0.01),
              PaymentSourceSubType: "DEPOSIT_NON_REFUNDABLE"
            },
            AccountDetails: {
              FirstName:    firstName,
              LastName:     lastName,
              Email:        email,
              PhoneNumber:  phoneNumber,
              PrivateVatId: privateVatId || null
            }
          })
        }
      );
  
      console.log("[9] ✔️ Status:", orderRes.status);
      const text = await orderRes.text();
      console.log("[9] Cevap gövdesi:", text);
    });
  })();
  