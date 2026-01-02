(async () => {
    console.log("[S] Başlatılıyor: TR Coinorder Bot");
    const {
      switchMap, bufferTime, filter: myfilter,
      concatMap, timer, exhaustMap,
      firstValueFrom, ReplaySubject,
      from: skypackFrom, retry: retryFun,
      map: mapFunc
    } = await import("https://cdn.skypack.dev/rxjs");
    console.log("[I] RXJS yüklendi");
  
    const { webSocket: myWebSocket } = await import("https://cdn.skypack.dev/rxjs/webSocket");
    console.log("[I] rxjs/webSocket yüklendi");
  
    const { fromFetch } = await import("https://cdn.skypack.dev/rxjs/fetch");
    console.log("[I] rxjs/fetch yüklendi");
  
    const lodashLib = await import("https://cdn.skypack.dev/lodash");
    console.log("[I] lodash yüklendi");
  
    const { hCaptchaLoader } = await import("https://cdn.skypack.dev/@hcaptcha/loader");
    console.log("[I] hcaptcha loader yüklendi");
  
    // --- Kullanıcı ve Bot Ayarları ---
    const customerId    = "kullanıcı";
    const fullName      = "Mehmet Çiftçi";
    const firstName     = "Rifat";
    const lastName      = "Kaçar";
    const streetAddress = "Kartaltepe Mahallesi İncirli Caddesi No:106/A Bakırköy/İstanbul";
    const city          = "İstanbul";
    const stateProvince = "Bakırköy";
    const zipCode       = "34145";
    const email         = "minionboob630@gmail.com";
    const phoneNumber   = "5455458558";
    const privateVatId  = "19075985396";
    const distance      = 403;
  
    console.log("[U] Kullanıcı bilgileri yüklendi:", {
      fullName, email, phoneNumber, city, stateProvince, zipCode
    });
  
    let isFirstRun = true;
    const buttonId       = "hc-captcha-btn";
    const captchaSiteKey = "eede844a-d24a-36fc-5d22-bd9d06dd356d";
    const orderPath      = "coinorder";        // <-- coinorder endpoint’i
    const bufferThreshold= 100;
    const replaySubject  = new ReplaySubject(1);
  
    // --- NO_CACHE Çerezi ---
    try {
      await cookieStore.set({ name: "NO_CACHE", value: "Y", domain: "tesla.com" });
      console.log("[4] ✔️ NO_CACHE çerezi eklendi");
    } catch (e) {
      console.error("[4] ✖️ Çerez ekleme hatası:", e);
    }
  
    // --- hCaptcha ---
    console.log("[5] hCaptcha loader başlatılıyor...");
    try {
      await hCaptchaLoader({ sentry: false, render: "explicit" });
      console.log("[5] ✔️ hCaptcha loader yüklendi");
    } catch (e) {
      console.error("[5] ✖️ hCaptcha loader hatası:", e);
      return;
    }
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<button id="${buttonId}" style="display:none;"></button>`
    );
    console.log("[5] ✔️ Captcha butonu DOM’a eklendi (ID:", buttonId, ")");
  
    const captchaId = hcaptcha.render(buttonId, { sitekey: captchaSiteKey });
    let latestCaptcha = null;
    async function refreshCaptcha() {
      try {
        const { response } = await hcaptcha.execute(captchaId, { async: true });
        latestCaptcha = response;
        console.log("[5] 🔄 Captcha yenilendi:", latestCaptcha);
      } catch (err) {
        console.error("[5] ✖️ Captcha yenileme hatası:", err);
      }
    }
    await refreshCaptcha();
    setInterval(refreshCaptcha, 2 * 60_000);
  
    // --- CSRF sesscheck (coinorder) ---
    console.log("[6] CSRF sesscheck başlatılıyor...");
    async function doSessCheck() {
      try {
        const res = await fetch(
          `https://www.tesla.com/${orderPath}/api/v4/sesscheck`,
          { method: "POST", credentials: "include" }
        );
        const data = await res.json();
        replaySubject.next(data);
        console.log("[6] CSRF güncellendi:", data);
      } catch (e) {
        console.error("[6] ✖️ CSRF sesscheck hatası:", e);
      }
    }
    await doSessCheck();
    timer(0, 4 * 60 * 1000).pipe(
      exhaustMap(() => fromFetch(
        `https://www.tesla.com/${orderPath}/api/v4/sesscheck`,
        { method: "POST", credentials: "include" }
      ).pipe(
        retryFun(),
        switchMap(r => r.json())
      ))
    ).subscribe(data => replaySubject.next(data));
  
    // --- WebSocket (local) ---
    console.log("[7] WebSocket bağlanılıyor...");
    const ws$ = myWebSocket({ url: "ws://localhost:8000",
      deserializer: e => { try { return JSON.parse(e.data) } catch { return null } }
    });
    ws$.subscribe({
      next: m => replaySubject.next(m),
      error: e => console.error("❌ WS Hatası:", e),
      complete: () => console.log("🔒 WS kapandı")
    });
  
    // --- Envanterden filtreleme & sipariş akışı ---
    console.log("[8] Envanter filtreleme akışı kuruluyor...");
    const inv$ = ws$.pipe(
      retryFun(),
      bufferTime(bufferThreshold),
      myfilter(buf => buf.length > 0),
      mapFunc(batch => lodashLib.shuffle(batch).filter(v => v)),
      concatMap(arr => skypackFrom(arr)),
      myfilter(v => v.CountryCode === "TR"),
      myfilter(v => Array.isArray(v.PAINT) && v.PAINT.length),
      myfilter(v => v.TrimVariantCode.startsWith("RWD_NV36"))
    );
  
    inv$.subscribe(async vehicleData => {
      console.log(`\n--- [9] Araç bulundu: ${vehicleData.VIN} / ${vehicleData.PAINT[0]}`);
  
      // CSRF başlıkları
      const { csrf_key, csrf_token } = await firstValueFrom(replaySubject);
      console.log("[9] 🔐 CSRF:", csrf_key, csrf_token);
  
      // Sipariş isteği
      console.log("[9] 🔄 Rezervasyon isteği gönderiliyor...");
      const orderRes = await fetch(
        `https://www.tesla.com/${orderPath}/api/v4/order`, {
          method:      "POST",
          credentials: "include",
          mode:        "cors",
          headers: {
            "Csrf-Name":        csrf_key,
            "Csrf-Value":       csrf_token,
            "X-Requested-With": "XMLHttpRequest",
            "Accept":           "application/json",
            "Content-Type":     "application/json",
            "Origin":           "https://www.tesla.com",
            "Referer":          window.location.href,
            "Accept-Language":  "tr-TR,tr;q=0.9,en;q=0.8",
            "Sec-Fetch-Site":   "same-origin",
            "Sec-Fetch-Mode":   "cors",
            "Sec-Fetch-Dest":   "empty",
            "Sec-CH-UA":        navigator.userAgent, 
            "User-Agent":       navigator.userAgent
          },
          body: JSON.stringify({
            BrowserInfo: {
              Browser:        "Chrome",
              OS:             "Windows 10 64-bit",
              BrowserVersion: "136.0.0.0",
              DeviceType:     "desktop",
              activitysessionId: crypto.randomUUID()
            },
            Vin:                 vehicleData.VIN,
            isUsedInventory:     false,
            market:              "TR",
            language:            "tr_TR",
            model:               vehicleData.Model,
            VehiclePrice:        vehicleData.PurchasePrice,
            optionCodeData:      vehicleData.OptionCodeData,
            hcaptchaResponse:    latestCaptcha,
            Payment: {
              PaymentType:      "CREDITCARD",
              CurrencyCode:     vehicleData.CurrencyCode,
              PayorName:        fullName,
              BillingInfoDetail: {
                Street:         streetAddress,
                City:           city,
                StateProvince:  stateProvince,
                ZipCode:        zipCode,
                PrivateVatId:   privateVatId
              },
              OrderAmount:      Math.floor(vehicleData.PurchasePrice * 0.1),  // %10 depozito örnek
              PaymentSourceSubType: "DEPOSIT_NON_REFUNDABLE"
            },
            AccountDetails: {
              FirstName:   firstName,
              LastName:    lastName,
              Email:       email,
              PhoneNumber: phoneNumber,
              PrivateVatId
            },
            DeliveryDetails: {
              StateProvince: stateProvince,
              transportFee: { distance }
            }
          })
        }
      );
  
      console.log(`[9] ✔️ Status: ${orderRes.status}`);
      if (orderRes.status === 200) {
        const result = await orderRes.json();
        console.log("✅ Rezervasyon başarılı:", result);
      } else if (orderRes.status === 403 || orderRes.status === 412) {
        const text = await orderRes.text();
        console.error(`❌ Hata ${orderRes.status}:`, text);
      } else {
        console.warn(`⚠️ Beklenmeyen durum ${orderRes.status}`);
      }
    });
  })();
  