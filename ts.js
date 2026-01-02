(async () => {
	console.log("[S] BY BUGRA BABA GURURLA SUNAR.... [S]");
	const {
		switchMap: switchMap,
		bufferTime: bufferTime,
		filter: myfilter,
		concatMap: concatMap,
		timer: timer,
		exhaustMap: exhaustMap,
		firstValueFrom: firstValueFrom,
		ReplaySubject: ReplaySubject,
		from: skypackFrom,
		retry: retryFun,
		map: mapFunc,
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

	  console.log("[U] Kullanıcı Yükleniyor...");
	  const customerId    = "kullanıcı";
	  const fullName      = "Mehmet Çiftçi";
	  const firstName     = "Mehmet";
	  const lastName      = "Çiftçi";
	  const streetAddress = "Kartaltepe Mahallesi İncirli Caddesi No:106/A Bakırköy/İstanbul";
	  const city          = "İstanbul";
	  const stateProvince = "Bakırköy";
	  const zipCode       = "34145";
	  const email         = "Selvi.kadiroglu@outook.com";
	  const phoneNumber   = "5455458558";
	  const privateVatId  = "19075985396";
	const distance = 403;
	console.log("[2] ✔️ Kullanıcı bilgileri:", {
		fullName, email, phoneNumber, city, stateProvince, zipCode
	  });
	const paintFilterList = [];
	const interiorFilterList = [];
	const excludeWhiteInterior = false;
	console.log("[3] Bot / filtre ayarları...");

	let inventoryPath = "inventory";
	let isFirstRun = [null] == "";
	const bufferThreshold = 100;
	const buttonId = "fuck-hcaptcha";
	const captchaSiteKey = "eede844a-d24a-36fc-5d22-bd9d06dd356d";
	const replaySubject = new ReplaySubject(1);
	try {
		await cookieStore.set({ name: "NO_CACHE", value: "Y", domain: "tesla.com" });
		console.log("[4] ✔️ NO_CACHE çerezi eklendi");
	  } catch (e) {
		console.error("[4] ✖️ Çerez ekleme hatası:", e);
	  }

	  console.log("[5] hCaptcha loader başlatılıyor...");
	  try {
		await hCaptchaLoader({ sentry: false, render: "explicit" });
		console.log("[5] ✔️ hCaptcha loader yüklendi");
	  } catch (e) {
		console.error("[5] ✖️ hCaptcha loader hatası:", e);
		return;
	  }
console.log("====== [C] CAPTCHA LOAD =====");
document.body.insertAdjacentHTML(
    "afterbegin",
    `<button id="${buttonId}" style="display:none;"></button>`
  );
  console.log("[5] ✔️ Captcha butonu DOM’a eklendi (ID:", buttonId, ")");
	
	  console.log("[6] CSRF sesscheck akışı başlatılıyor...");
	  const csrf$ = new ReplaySubject(1);
	  try {
		// İlk sesscheck
		const initRes = await fetch(`https://www.tesla.com/${inventoryPath}/api/v4/sesscheck`, {
		  method: "POST", credentials: "include"
		});
		const initData = await initRes.json();
		csrf$.next(initData);
		console.log("[6] ✔️ İlk CSRF alındı:", initData);
	  } catch (e) {
		console.error("[6] ✖️ İlk CSRF hatası:", e);
	  }



		const sess$ = timer(0, 240 * 1000).pipe(
			exhaustMap(() =>
				fromFetch(`https://www.tesla.com/${inventoryPath}/api/v4/sesscheck`, {
					method: "POST",
					credentials: "include",
				}).pipe(
					retryFun(),
					switchMap(response => response.json())
				)
			)
		);
	sess$.subscribe({
		next: data => {
		  replaySubject.next(data);
		  console.log("[6] 🔄 CSRF yenilendi:", data);
		},
		error: err => console.error("[6] ✖️ CSRF yenileme akışı hatası:", err)
	});

	console.log("[7] WebSocket bağlanılıyor...");
	const ws$ = myWebSocket({
		url: "ws://localhost:8000",
		deserializer: e => {
		  try {
			return JSON.parse(e.data);
		  } catch {
			return null;
		  }
		}
	  });    ws$.subscribe({
        next: msg => {
            replaySubject.next(msg);
        },
        error: err => console.error("❌ WS Hatası:", err),
        complete: () => console.log("🔒 WS Oturumu kapandı")
    });
	console.log("[8] Envanter filtreleme akışı oluşturuluyor...");

    const inv$ = ws$.pipe(
		retryFun(),
		bufferTime(bufferThreshold),
		myfilter(buf => buf.length > 0),
	  
		// 1) Karıştır
		mapFunc(batch =>
		  lodashLib.shuffle(batch)
			.filter(v => v != null)              // NULL’leri at
		),
	  
		// 2) Önceliğe göre sırala
		mapFunc(shuffled =>
		  lodashLib.sortBy(shuffled, v => {
			const code = Array.isArray(v.PAINT) ? v.PAINT[0] : '';
			const idx  = paintFilterList.indexOf(code);
			return idx === -1 ? Infinity : idx;
		  })
		),
	  
		// 3) Tek tek araç objesine dönüştür
		concatMap(sortedArray => skypackFrom(sortedArray)),
	  
		myfilter(v => v.CountryCode === 'TR'),
		myfilter(v => Array.isArray(v.PAINT) && v.PAINT.length > 0),
		myfilter(v =>
		  v.TrimVariantCode.startsWith('RWD_NV36') 
		),
		myfilter(v => !interiorFilterList.includes(v.PAINT[0])),
		myfilter(v => !(excludeWhiteInterior && v.INTERIOR?.[0] === 'PREMIUM_WHITE'))
	  );
	  console.log("[9] Rezervasyon abonesi oluşturuluyor...");

	inv$.subscribe({
		next: async (vehicleData) => {
			console.log("\n--- [9] Yeni araç bulundu:", vehicleData.VIN, vehicleData.PAINT[0]);

			const getCsrfHeaders = async () => {
				console.log("[9] 🔐 CSRF başlıkları:", getCsrfHeaders);
				const { csrf_key: csrfName, csrf_token: csrfValue } =
					await firstValueFrom(replaySubject);

				return {
					["Csrf-Name"]: csrfName,
					["Csrf-Value"]: csrfValue,
				};
				
			};
			const reserveVehicle = async () => {
				var locationCheckState, orderStatusCheckState, responseCheckState;
				const pickupLocations = [
					{
						service_id: "410805",
						title: "Tesla Ankara",
						distance: 152,
						driving_time: 0,
						non_customer_location: "0",
						trt_id: 410805,
						gmaps_url: "",
						city: "Ankara",
						province: "Ankara",
						country_code: "TR",
						map_address: "6 1817. Sk.Ankara, Ankara 06370",
						address_line_1: "6 1817. Sk.",
						address_line_2: "Ergazi",
						address_description: "",
						country: "Turkey",
						postal_code: "06370",
						store_hours: "",
						common_name: "",
						timezone: {
							dstOffset: 0,
							rawOffset: 10800,
							timeZoneId: "Europe/Istanbul",
							timeZoneName: "Turkey Time",
						},
						location_type: ["Delivery", "Service", "Store"],
						metro_area: "",
						latitude: "39.9535097",
						longitude: "32.707103",
						IsAtLocation: 1 === "1",
						IsFactoryGated: false,
						Bucket: 7,
					}
				];
				locationCheckState = 20;
				while (locationCheckState < 33)
					switch (locationCheckState) {
						case 22:
							locationCheckState = 33;
							{
								return {
									error: `No available pickup locations for ${vehicleData.VIN}! Skipping...`,
								};
							}
							break;
						case 20:
							locationCheckState =
								!Array.isArray(pickupLocations) || pickupLocations.length == 0
									? 22
									: 33;
							break;
						case 13:
							locationCheckState = pickupLocations.length != 0 ? 22 : 33;
							break;
					}
				vehicleData.LOCS = pickupLocations.map((location) => ({
					trt: location.title || location.common_name,
					trt_id: location.trt_id || +location.service_id,
					transportFee: 0,
					transportFeeCurrency: "TRY",
					location_type: location.location_type,
					lat: parseFloat(location.latitude),
					lng: parseFloat(location.longitude),
					province: location.province || location.city,
				}));
				const captchaId = hcaptcha.render(buttonId, {
					sitekey: captchaSiteKey,
				});
				try {
					const { response: captchaToken } = await hcaptcha.execute(captchaId, {
						async: true,
					});
					console.log("[5] 🔄 captchaToken yenilendi:", captchaToken.response);

					const { LOCS: locations } = vehicleData;
					const selectedLocation =
						locations[Math.floor(Math.random() * locations.length)];
					const orderResponse = await fetch(
						`https://www.tesla.com/${inventoryPath}/api/v4/order`,
						{
							method: "POST",
							headers: {
								...(await getCsrfHeaders()),

								["X-Requested-With"]: "XMLHttpRequest",
								Accept: "application/json",
								["Content-Type"]: "application/json",
							},
							body: JSON.stringify({
								BrowserInfo: {
									Browser: "Chrome",
									OS: "Windows 10 64-bit",
									BrowserVersion: "136.0.0.0",
									DeviceType: "desktop",
									trafficSource: {},
									trafficSourceHistory: [],
									isInventorySwapEnabled: NaN === NaN,
									numberOfTimesPaymentFailed: 0,
									activitysessionId: crypto.randomUUID(),
									isPublicReferred: null === undefined,
									isDm: [0] == "",
								},
								Vin: vehicleData.VIN,
								isUsedInventory: NaN === NaN,
								market: vehicleData.CountryCode,
								language: vehicleData.Language,
								model: vehicleData.Model,
								useExisting: [0] == "",
								VehiclePrice: vehicleData.PurchasePrice,
								optionCodeData: vehicleData.OptionCodeData,
								SaveWithProfile: null == undefined,
								RegistrationDetail: {
									RegistrantType: null,
									RegistrationAddress: {
										CountryCode: vehicleData.CountryCode,
									},
								},
								Payment: {
									PaymentAmount: 0,
									PaymentType: "CREDITCARD",
									CurrencyCode: vehicleData.CurrencyCode,
									CountryCode: vehicleData.CountryCode,
									PayorName: fullName,
									BillingInfoDetail: {
										CountryCode: vehicleData.CountryCode,
										Street: streetAddress,
										City: city,
										StateProvince: stateProvince,
										ZipCode: zipCode,
										Address2: "",
										PickupLocation: 0,
										RegistrationType: null,
										PrivateVatId: null,
										IsFromSavedProfile: NaN === NaN,
									},
									PaymentSource: "RESERVATION",
									PayorIDNumber: null,
									VerificationPhone: null,
									VerificationSMSCode: null,
									AgreementSave: null,
									RedirectPaymentName: "CREDITCARD",
									IsOffline: null == undefined,
									OrderAmount: 175000,
									PaymentSourceSubType: "DEPOSIT_NON_REFUNDABLE",
									LastFourDigits: null,
									isV3Payment: NaN !== NaN,
								},
								Accessories: {},
								InstallationAccessoriesItems: {},
								InstallerExperienceShown: false,
								AccountDetails: {
									FirstName: firstName,
									LastName: lastName,
									CCFirstName: ccFirstName,
									CCLastName: ccLastName,
									Email: email,
									PhoneNumber: phoneNumber,
									PrivateVatId: privateVatId,
									Password: "",
									CompanyName: null,
									VatId: null,
									CompanyNumber: null,
									LocalName: "",
									MiddleName: "",
									PhoneCountry: vehicleData.CountryCode,
									CompanyId: null,
									CompanyAddress1: null,
									CompanyAddress2: null,
									CompanyCity: null,
									CompanyPostalCode: null,
									CompanyCountryCode: null,
									IdentificationType: "",
									IdentificationNumber: null,
									CompanyState: null,
									CompanyCounty: null,
									OfficeType: null,
									BranchName: null,
									BranchId: null,
									CompanyDistrict: null,
									CompanyProvince: null,
									TaxOfficeName: null,
									NonResidentPerson: false,
									NonResidentCompany: 1 === "1",
									PrivateRegistrationCountry: null,
									BusinessRegistrationCountry: null,
									RequestedTaxableInvoice: null,
									UseOfTaxableInvoice: null,
									AccountType: "private",
								},
								UserLocation: {
									latitude: "",
									longitude: "",
								},
								hasVehicleHistoryReport: 1 === "1",
								flexOptions: [],
								Configs: {
									config: {
										currencyCode: vehicleData.CurrencyCode,
									},
								},
								isSwap: false,
								registrationZipCode: "",
								DeliveryDetails: {
									PostalCode: "",
									Latitude: "",
									Longitude: "",
									error: null,
									city: "",
									countryCode: "",
									countryName: "",
									latitude: "",
									longitude: "",
									postalCode: "",
									transportFee: {
										distance: distance,
										fee: 0,
									},
									StateProvince: selectedLocation.province,
									stateProvince: selectedLocation.province,
								},
								deliveryLocationSelectionDetails: {
									locationId: selectedLocation.trt_id,
									locationStateProvince: selectedLocation.province,
									locations: locations.map((location) =>
										lodashLib.omit(location, ["lat", "lng", "province"])
									),
									locationDetails: {
										latitude: selectedLocation.lat,
										longitude: selectedLocation.lng,
									},
									distanceMove: distance,
									pickUpType: "PICKUP_SERVICE_CENTER",
									distanceType: "km",
									estimatedTransportationFee: 0,
									registrationRestrictionStates: [],
									registrationZipCode: "",
									registrationState: "",
									range: null,
									version: "v2",
									onSiteSale: 1 === "1",
								},
								hcaptchaToken: captchaToken,
								optionCodes: "",
								isManualAddress: null === undefined,
							}),
							credentials: "include",
						}
					);
					orderStatusCheckState = 18;
					while (orderStatusCheckState < 32)
						switch (orderStatusCheckState) {
							case 31:
								orderStatusCheckState = orderResponse.status != 403 ? 27 : 32;
								break;
							case 27:
								orderStatusCheckState = 32;
								{
									return {
										error: "IP address blocked by Akamai.",
									};
								}
								break;
							case 18:
								orderStatusCheckState = orderResponse.status == 403 ? 27 : 32;
								break;
						}
					const orderResult = await orderResponse.json();
					responseCheckState = 13;
					while (responseCheckState < 39)
						switch (responseCheckState) {
							case 29:
								responseCheckState = 39;
								{
									return {
										...orderResult,
										error:
											"Akamai aborted requested due to multiple failed attempts at passing sec_cpt challange.",
									};
								}
								break;
							case 13:
								responseCheckState = orderResponse.status == 428 ? 29 : 39;
								break;
							case 34:
								responseCheckState = orderResponse.status != 428 ? 29 : 39;
								break;
						}
					return orderResult;
				} finally {
					captchaId.remove(captchaId);
				}
			};
			await navigator.locks.request("buy-op", async (lock) => {
				lockState = 26;
				while (lockState < 38)
					switch (lockState) {
						case 26:
							lockState = !isFirstRun ? 11 : 38;
							break;
						case 11:
							lockState = 38;
							return;
						case 37:
							lockState = isFirstRun ? 11 : 38;
							break;
					}
				const [paintCode] = vehicleData.PAINT;
				console.log(
					`⌛⌛⌛ ${paintCode}(${vehicleData.VIN}) REZERVE EDİLİYOR ⌛⌛⌛`
				);
				const reservationResult = await reserveVehicle();
				reservationCheckState = 35;
				while (reservationCheckState < 36)
					switch (reservationCheckState) {
						case 7:
							reservationCheckState = 36;
							{
								console.log(
									`❌❌❌ ${paintCode} (${vehicleData.VIN}) REZERVE EDİLEMEDİ ❌❌❌ ----->`,
									reservationResult
								);
								return;
							}
							break;
						case 35:
							reservationCheckState = reservationResult.error ? 7 : 36;
							break;
					}
				successState = 13;
				while (successState < 39)
					switch (successState) {
						case 13:
							successState = reservationResult.referenceNumber ? 29 : 39;
							break;
						case 29:
							successState = 39;
							{
								isFirstRun = false;
								const {
									sessionToken: sessionToken,
									userId: userId,
									...cleanResult
								} = reservationResult;
								console.log(
									`✅✅✅${paintCode} (${vehicleData.VIN}) REZERVE EDİLDİ ✅✅✅ ----->`,
									cleanResult
								);
								console.log(`---> VIN: ${vehicleData.VIN}`);
								console.log(`---> RN: ${reservationResult.referenceNumber}`);
								console.log(
									`---> Token: ${
										reservationResult.pgwSignedTokenResponse ||
										reservationResult.token
									}`
								);
								 console.log("Rezervasyon detayı:", {
                                        ...reservationResult,
                                        CUSTOMER: customerId,
                                        EMAIL: email,
                                        RN: reservationResult.referenceNumber,
                                        VIN: vehicleData.VIN,
                                        TOKEN: reservationResult.pgwSignedTokenResponse || reservationResult.token,
                                      });
							}
							break;
					}
				var lockState, reservationCheckState, successState;
			});
		},
	});
})();