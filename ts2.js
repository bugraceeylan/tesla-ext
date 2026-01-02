(async () => {
	// 1. Import RxJS, WebSocket, fetch, lodash, hCaptcha
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
	  map: mapFunc
	} = await import("https://cdn.skypack.dev/rxjs");
	const { webSocket: myWebSocket } = await import("https://cdn.skypack.dev/rxjs/webSocket");
	const { fromFetch } = await import("https://cdn.skypack.dev/rxjs/fetch");
	const lodashLib = await import("https://cdn.skypack.dev/lodash");
	const { hCaptchaLoader } = await import("https://cdn.skypack.dev/@hcaptcha/loader");
  
	// 2. User & bot configuration
	const customerId = "kullanıcı";
	const fullName = "İsim Soyisim";
	const firstName = "İsim";
	const lastName = "Soyisim";
	const ccFirstName = "KrediKartıİsim";
	const ccLastName = "LrediKartiSoyisim";
	const streetAddress = "Kullanıcı Adresi";
	const city = "İlçe";
	const stateProvince = "İl";
	const zipCode = "PostaKodu";
	const email = "Kullanıcı Mail";
	const phoneNumber = "CepNumarası";
	const privateVatId = "TCKN";
	const distance = 403;
	const paintFilterList = [];
	const interiorFilterList = [];
	const excludeWhiteInterior = false;
	let inventoryPath = "inventory";
	let isFirstRun = [null] == "";
	const bufferThreshold = 100;
	const buttonId = "fuck-hcaptcha";
	const captchaSiteKey = "eede822a-c29e-46fa-8d88-ad9e06da386e";
  
	// 3. Prepare replay subject
	const replaySubject = new ReplaySubject(1);
	await cookieStore.set({ name: "NO_CACHE", value: "Y", domain: "tesla.com" });
  
	console.log("Still waiting for hCaptcha...");
	await hCaptchaLoader({ sentry: false, render: "explicit" });
	console.log("Successfully loaded hCaptcha loader...");
	document.body.insertAdjacentHTML(
	  "afterbegin",
	  `<button id="${buttonId}" style="display: none;"></button>`
	);
	console.log("====== BOT AKTİF =====");
  
	// 4. WebSocket listener → log & push to replaySubject
	const ws$ = myWebSocket("ws://localhost:8000");
	ws$.subscribe({
	  next: msg => {
		replaySubject.next(msg);
  
		if (
		  msg.Model === "my" &&
		  msg.CountryCode === "TR" &&
		  msg.IsAtLocation === true
		) {
		  console.log("🚀 Model Y bulundu, rezervasyon tetikleniyor!");
		}
	  },
	  error: err => console.error("❌ WS Hatası:", err),
	  complete: () => console.log("🔒 WS bağlantısı kapandı")
	});
  
	// 5. date_time_fix polling with safe JSON/text parse
	timer(0, 240 * 1000)
	.pipe(
	  exhaustMap(() =>
		fromFetch("http://localhost:8181/date_time_fix", {
		  method: "GET",
		  // selector ile body’yi sadece bir kez okuyup parse ediyoruz
		  selector: async res => {
			const text = await res.text();
			try {
			  return JSON.parse(text);
			} catch {
			  return text;
			}
		  }
		})
	  )
	)
	.subscribe(payload => {
	  replaySubject.next(payload);
	});
  
	// 6. Main pipeline: buffer, filter, shuffle, sort, filter variants
	replaySubject
	  .pipe(
		bufferTime(bufferThreshold),
		myfilter(items => items.length > 0),
		mapFunc(list => lodashLib.shuffle(list)),
		concatMap(shuffled => skypackFrom(shuffled)),
		myfilter(({ TrimVariantCode }) => TrimVariantCode === "RWD_NV36"),
		myfilter(({ PAINT: [paintCode] }) =>
		  paintFilterList.length ? paintFilterList.includes(paintCode) : true
		),
		myfilter(({ INTERIOR: [interior] }) =>
		  !(excludeWhiteInterior && interior === "PREMIUM_WHITE")
		)
	  )
	  .subscribe({
		next: async vehicleData => {
		  console.log("🚗 İşlenecek araç geldi:", vehicleData.VIN);
  
		  const getCsrfHeaders = async () => {
			const { csrf_key: csrfName, csrf_token: csrfValue } =
			  await firstValueFrom(replaySubject);
			return { ["Csrf-Name"]: csrfName, ["Csrf-Value"]: csrfValue };
		  };
  
		  // 8. reserveVehicle function
		  const reserveVehicle = async () => {
			const pickupLocations = [
			  {
				service_id: "410805",
				title: "Tesla Ankara",
				distance: 152,
				driving_time: 0,
				non_customer_location: "0",
				trt_id: 410805,
				city: "Ankara",
				province: "Ankara",
				country_code: "TR",
				postal_code: "06370",
				latitude: "39.9535097",
				longitude: "32.707103"
			  }
			];
  
			// Location check
			let locState = !pickupLocations.length ? 22 : 33;
			if (locState === 22) {
			  return { error: `No pickup locations for ${vehicleData.VIN}` };
			}
			vehicleData.LOCS = pickupLocations.map(loc => ({
			  trt: loc.title,
			  trt_id: +loc.service_id,
			  transportFee: 0,
			  transportFeeCurrency: "TRY",
			  lat: parseFloat(loc.latitude),
			  lng: parseFloat(loc.longitude),
			  province: loc.province
			}));
  
			// hCaptcha
			const captchaId = hcaptcha.render(buttonId, { sitekey: captchaSiteKey });
			try {
			  const { response: captchaToken } = await hcaptcha.execute(captchaId, {
				async: true
			  });
  
			  const orderResponse = await fetch(
				`https://www.tesla.com/${inventoryPath}/api/v4/order`,
				{
				  method: "POST",
				  credentials: "include",
				  headers: {
					...(await getCsrfHeaders()),
					"X-Requested-With": "XMLHttpRequest",
					Accept: "application/json",
					"Content-Type": "application/json"
				  },
				  body: JSON.stringify({
					Vin: vehicleData.VIN,
					market: vehicleData.CountryCode,
					language: vehicleData.Language,
					model: vehicleData.Model,
					VehiclePrice: vehicleData.PurchasePrice,
					optionCodeData: vehicleData.OptionCodeData,
					Payment: {
					  PaymentType: "CREDITCARD",
					  PaymentSource: "RESERVATION",
					  OrderAmount: 175000,
					  PaymentSourceSubType: "DEPOSIT_NON_REFUNDABLE"
					},
					hcaptchaToken: captchaToken,
					DeliveryDetails: {
					  distance: distance,
					  StateProvince: vehicleData.LOCS[0].province
					},
					deliveryLocationSelectionDetails: {
					  locationId: vehicleData.LOCS[0].trt_id,
					  version: "v2"
					}
				  })
				}
			  );
			  return await orderResponse.json();
			} finally {
			  hcaptcha.remove(captchaId);
			}
		  };
  
		  // 9. navigator.locks reservation flow
		  await navigator.locks.request("buy-op", async lock => {
			const res = await reserveVehicle();
			if (res.error) {
			  console.log("❌ Rezervasyon Hatası:", res.error);
			  return;
			}
			console.log("✅ Rezervasyon başarılı:", res.referenceNumber);
			console.log(
			  "Token:",
			  res.pgwSignedTokenResponse || res.token
			);
		  });
		},
		error: err => console.error("❌ Pipeline Hatası:", err)
	  });
  })();
  