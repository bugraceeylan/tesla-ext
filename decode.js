// Bu script Tesla envanterini izler ve uygun bir araç bulunursa otomatik rezervasyon yapar.
(async () => {
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
    const { webSocket: myWebSocket } = await import(
            "https://cdn.skypack.dev/rxjs/webSocket"
    );
    const { fromFetch: fromFetch } = await import(
            "https://cdn.skypack.dev/rxjs/fetch"
    );
    const lodashLib = await import("https://cdn.skypack.dev/lodash");
    const { hCaptchaLoader: hCaptchaLoader } = await import(
            "https://cdn.skypack.dev/@hcaptcha/loader"
    );
    const customerId = "kullanıcı";
    const fullName = "Rifat Kaçar";
    const firstName = "Rifat";
    const lastName = "Kaçar";
    const ccFirstName = "Rifat";
    const ccLastName = "Kaçar";
    const streetAddress = "Başak mahallesi mevlana Celaleddin rumi caddesi misstanbul evleri sitesi 3.ada e4 blok no:11 başakşehir/istanbul";
    const city = "İstanbul";
    const stateProvince = "Başakşehir";
    const zipCode = "34480";
    const email = "minionboob630@gmail.com";
    const phoneNumber = "5359325054";
    const privateVatId = "37414959518";
    const distance = 403;
    const paintFilterList = [];
    const interiorFilterList = [];
    const excludeWhiteInterior = false;
    let inventoryPath = "inventory";
    let isFirstRun = true;
    const bufferThreshold = 100;
    const buttonId = "fuck-hcaptcha";
    const captchaSiteKey = "eede844a-d24a-36fc-5d22-bd9d06dd356d";
    const replaySubject = new ReplaySubject(1);
    await cookieStore.set({
            name: "NO_CACHE",
            value: "Y",
            domain: "tesla.com",
    });
    console.log("Still waiting for hCaptcha...");

    await hCaptchaLoader({
            sentry: false,
            render: "explicit",
    });
    console.log("Successfully loaded hCaptcha loader...");
    document.body.insertAdjacentHTML(
            "afterbegin",
            `<button id="${buttonId}" style="display: none;"></button>`
    ),
    console.log("====== BOT AKTİF =====");

    // 1) Periyodik olarak CSRF token yenileniyor (sesscheck çağrısı).
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
                    console.log("👍 CSRF token güncellendi");
            },
            error: err => console.error("sesscheck hatası:", err)
    });

    // 2) WebSocket bağlantısı ile envanter akışı alınıyor.
    const ws$ = myWebSocket({
            url: "ws://localhost:8000",
            deserializer: e => {
                    try {
                            return JSON.parse(e.data);
                    } catch {
                            return null;
                    }
            }
    });
    ws$.subscribe({
            next: msg => {
                    replaySubject.next(msg);
            },
            error: err => console.error("❌ WS Hatası:", err),
            complete: () => console.log("🔒 WS Oturumu kapandı")
    });

    // 3) Envanter verilerini filtreleyip işleme al.
    const inv$ = ws$.pipe(
            retryFun(),
            bufferTime(bufferThreshold),
            myfilter(buf => buf.length > 0),
            // 1) Karıştır (rasgele sırala)
            mapFunc(batch =>
                    lodashLib.shuffle(batch)
                            .filter(v => v != null) // NULL değerleri at
            ),
            // 2) Önceliğe göre sırala (boya öncelik listesine göre)
            mapFunc(shuffled =>
                    lodashLib.sortBy(shuffled, v => {
                            const code = Array.isArray(v.PAINT) ? v.PAINT[0] : '';
                            const idx = paintFilterList.indexOf(code);
                            return idx === -1 ? Infinity : idx;
                    })
            ),
            // 3) Tek tek araç objesine dönüştür
            concatMap(sortedArray => skypackFrom(sortedArray)),
            myfilter(v => v.CountryCode === 'NL'),
            myfilter(v => Array.isArray(v.PAINT) && v.PAINT.length > 0),
            myfilter(v =>
                    v.TrimVariantCode.startsWith('RWD_NV36')
            ),
            myfilter(v => !interiorFilterList.includes(v.PAINT[0])),
            myfilter(v => !(excludeWhiteInterior && v.INTERIOR?.[0] === 'PREMIUM_WHITE'))
    );

    inv$.subscribe({
            next: async (vehicleData) => { // Yeni bulunan araç için rezervasyon işlemi
                    const getCsrfHeaders = async () => {
                            const { csrf_key: csrfName, csrf_token: csrfValue } =
                                    await firstValueFrom(replaySubject);
                            return {
                                    ["Csrf-Name"]: csrfName,
                                    ["Csrf-Value"]: csrfValue,
                            };
                    };
                    // Bir aracı rezerve etmek için Tesla API çağrılarını yapar
                    const reserveVehicle = async () => {
                            // Sabit teslimat noktası (örnek: Tesla Ankara bayisi)
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
                                            IsAtLocation: false,
                                            IsFactoryGated: false,
                                            Bucket: 7,
                                    }
                            ];

                            if (!Array.isArray(pickupLocations) || pickupLocations.length === 0) {
                                    return { error: `No available pickup locations for ${vehicleData.VIN}! Skipping...` };
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
                            // hCaptcha çözümü için görünmez bir buton oluştur ve otomatik çöz
                            const captchaId = hcaptcha.render(buttonId, {
                                    sitekey: captchaSiteKey,
                            });
                            try {
                                    const { response: captchaToken } = await hcaptcha.execute(captchaId, {
                                            async: true,
                                    });
                                    const { LOCS: locations } = vehicleData;
                                    const selectedLocation = locations[Math.floor(Math.random() * locations.length)];
                                    // Rezervasyon isteğini Tesla API'sine gönder
                                    const orderResponse = await fetch(`https://www.tesla.com/${inventoryPath}/api/v4/order`, {
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
                                                            isInventorySwapEnabled: false,
                                                            numberOfTimesPaymentFailed: 0,
                                                            activitysessionId: crypto.randomUUID(),
                                                            isPublicReferred: false,
                                                            isDm: false,
                                                    },
                                                    Vin: vehicleData.VIN,
                                                    isUsedInventory: false,
                                                    market: vehicleData.CountryCode,
                                                    language: vehicleData.Language,
                                                    model: vehicleData.Model,
                                                    useExisting: false,
                                                    VehiclePrice: vehicleData.PurchasePrice,
                                                    optionCodeData: vehicleData.OptionCodeData,
                                                    SaveWithProfile: true,
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
                                                                    IsFromSavedProfile: false,
                                                            },
                                                            PaymentSource: "RESERVATION",
                                                            PayorIDNumber: null,
                                                            VerificationPhone: null,
                                                            VerificationSMSCode: null,
                                                            AgreementSave: null,
                                                            RedirectPaymentName: "CREDITCARD",
                                                            IsOffline: true,
                                                            OrderAmount: 175000,
                                                            PaymentSourceSubType: "DEPOSIT_NON_REFUNDABLE",
                                                            LastFourDigits: null,
                                                            isV3Payment: true,
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
                                                            NonResidentCompany: false,
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
                                                    hasVehicleHistoryReport: false,
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
                                                            locations: locations.map((location) => lodashLib.omit(location, ["lat", "lng", "province"])),
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
                                                            onSiteSale: false,
                                                    },
                                                    hcaptchaToken: captchaToken,
                                                    optionCodes: "",
                                                    isManualAddress: false,
                                            }),
                                            credentials: "include",
                                    });
                                    if (orderResponse.status === 403) {
                                            return { error: "IP address blocked by Akamai." };
                                    }
                                    const orderResult = await orderResponse.json();
                                    if (orderResponse.status === 428) {
                                            return { ...orderResult, error: "Akamai aborted request due to multiple failed attempts at passing sec_cpt challenge." };
                                    }
                                    return orderResult;
                            } finally {
                                    hcaptcha.remove(captchaId);
                            }
                    };

                    // Aynı anda birden fazla rezervasyon girişimini önlemek için Web Locks API kullan
                    await navigator.locks.request("buy-op", async (lock) => {
                            // Eğer daha önce başarılı bir rezervasyon yapıldıysa yeni denemeleri atla
                            if (!isFirstRun) {
                                    return;
                            }
                            const [paintCode] = vehicleData.PAINT;
                            console.log(`⌛⌛⌛ ${paintCode}(${vehicleData.VIN}) REZERVE EDİLİYOR ⌛⌛⌛`);
                            const reservationResult = await reserveVehicle();
                            // Rezervasyon başarısız olursa hata bilgisini logla
                            if (reservationResult.error) {
                                    console.log(`❌❌❌ ${paintCode} (${vehicleData.VIN}) REZERVE EDİLEMEDİ ❌❌❌ ----->`, reservationResult);
                                    return;
                            }
                            // Rezervasyon başarılı olursa bilgileri logla ve RN/signed token al
                            if (reservationResult.referenceNumber) {
                                    isFirstRun = false;
                                    const { sessionToken: sessionToken, userId: userId, ...cleanResult } = reservationResult;
                                    console.log(`✅✅✅ ${paintCode} (${vehicleData.VIN}) REZERVE EDİLDİ ✅✅✅ ----->`, cleanResult);
                                    console.log(`---> VIN: ${vehicleData.VIN}`);
                                    console.log(`---> RN: ${reservationResult.referenceNumber}`);
                                    console.log(`---> Token: ${reservationResult.pgwSignedTokenResponse || reservationResult.token}`);
                                    console.log("Rezervasyon detayı:", {
                                            ...reservationResult,
                                            CUSTOMER: customerId,
                                            EMAIL: email,
                                            RN: reservationResult.referenceNumber,
                                            VIN: vehicleData.VIN,
                                            TOKEN: reservationResult.pgwSignedTokenResponse || reservationResult.token,
                                    });
                            }
                    });
            },
    });
})();
