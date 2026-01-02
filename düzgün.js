(async () => {
    // 1) Gerekli kütüphaneleri import et
    const {
      timer,
      exhaustMap,
      retry: retryFun,
      switchMap,
      bufferTime,
      filter: myFilter,
      concatMap,
      firstValueFrom,
      ReplaySubject,
      from: fromRx,
      map: mapFunc
    } = await import("https://cdn.skypack.dev/rxjs");
    const { webSocket } = await import("https://cdn.skypack.dev/rxjs/webSocket");
    const { fromFetch } = await import("https://cdn.skypack.dev/rxjs/fetch");
    const _ = await import("https://cdn.skypack.dev/lodash");
    const { hCaptchaLoader } = await import("https://cdn.skypack.dev/@hcaptcha/loader");
  
    // 2) Genel ayarlar
    const inventoryPath = "inventory";
    const bufferThreshold = 100;
    const paintFilterList = [];
    const interiorFilterList = [];
    const excludeWhiteInterior = false;
    const buttonId = "hcaptcha-btn";
    const captchaSiteKey = "eede822a-c29e-46fa-8d88-ad9e06da386e";
  
    // CSRF token’larını tutacak ReplaySubject
    const replay$ = new ReplaySubject(1);
  
    // NO_CACHE cookie’si
    await cookieStore.set({ name: "NO_CACHE", value: "Y", domain: "tesla.com" });
  
    // hCaptcha’yı yükle ve gizli butonu ekle
    await hCaptchaLoader({ render: "explicit" });
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<button id="${buttonId}" style="display:none;"></button>`
    );
    console.log("Still waiting for hCaptcha...");
  
    // 3) CSRF token güncellemesi için sesscheck akışı
    const sess$ = timer(0, 240_000).pipe(
      exhaustMap(() =>
        fromFetch(`https://www.tesla.com/${inventoryPath}/api/v4/sesscheck`, {
          method: "POST",
          credentials: "include"
        }).pipe(
          retryFun(),
          switchMap(res => res.json())
        )
      )
    );
  
    sess$.subscribe({
      next: data => {
        replay$.next(data);
        console.log("👍 CSRF token güncellendi");
      },
      error: err => console.error("sesscheck hatası:", err)
    });
  
    console.log("====== BOT AKTİF =====");
  
    // 4) WebSocket üzerinden envanter akışı
    const inv$ = webSocket("ws://localhost:8000").pipe(
      retryFun(),
      bufferTime(bufferThreshold),
      myFilter(arr => arr.length > 0),
      mapFunc(arr => _.shuffle(arr)),
      concatMap(arr => fromRx(arr)),
      myFilter(v => v.TrimVariantCode === "RWD_NV36"),
      myFilter(v => !paintFilterList.length || paintFilterList.includes(v.PAINT[0])),
      myFilter(v => !excludeWhiteInterior || v.INTERIOR[0] !== "PREMIUM_WHITE")
    );
  
    inv$.subscribe({
      next: async vehicleData => {
        // CSRF header’larını al
        const { csrf_key, csrf_token } = await firstValueFrom(replay$);
        const headers = {
          "Csrf-Name": csrf_key,
          "Csrf-Value": csrf_token,
          "Content-Type": "application/json"
        };
  
        // hCaptcha çözümü al
        const captchaId = hcaptcha.render(buttonId, { sitekey: captchaSiteKey });
        const { response: captchaToken } = await hcaptcha.execute(captchaId, { async: true });
        hcaptcha.remove(captchaId);
  
        console.log(`⌛ Rezervasyon başlatılıyor: VIN=${vehicleData.VIN}`);
  
        // Reserve isteği
        const res = await fetch(
          `https://www.tesla.com/${inventoryPath}/api/v4/reserve/${vehicleData.InventoryID}`,
          {
            method: "POST",
            credentials: "include",
            headers,
            body: JSON.stringify({
              Vin: vehicleData.VIN,
              hcaptchaToken: captchaToken
            })
          }
        );
        const result = await res.json();
  
        if (result.referenceNumber) {
          console.log(`✅ Rezervasyon başarılı: VIN=${vehicleData.VIN} RN=${result.referenceNumber}`);
        } else {
          console.error(`❌ Rezervasyon başarısız:`, result);
        }
      },
      error: err => console.error("Envanter akışı hatası:", err)
    });
  })();