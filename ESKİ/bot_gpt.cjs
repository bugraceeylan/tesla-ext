// // ===================================================================================
// // TESLA REZERVASYON BOTU - HOLLANDA (Bölüm 1/2)
// // ===================================================================================

// // --- BİLGİLERİNİ BU BÖLÜME YAPIŞTIR ---
// const config = { /* Adım 1'de oluşturduğun config.js dosyasının içeriğini buraya kopyala */ };
// // ------------------------------------

// console.log("===== BOT AKTİF EDİLİYOR =====");

// const { fetch: originalFetch } = window;
// window.fetch = async (...args) => {
//     let [resource, configBody] = args;
    
//     if (typeof resource === 'string' && resource.includes('/api/v1/order')) {
//         console.log('[fetch intercept] Sipariş isteği yakalandı!');
//         let body = JSON.parse(configBody.body);

//         body.AccountDetails = { ...body.AccountDetails, firstName: config.firstName, lastName: config.lastName, email: config.email, phoneNumber: config.phoneNumber };
//         body.BillingAddress = { ...body.BillingAddress, addressLine1: config.addressLine1, city: config.city, stateProvince: config.stateProvince, zipCode: config.zipCode, countryCode: config.market };
//         body.DeliveryDetails = { ...body.DeliveryDetails, addressLine1: config.addressLine1, city: config.city, stateProvince: config.stateProvince, zipCode: config.zipCode, countryCode: config.market };
//         body.RegistrationDetails = { ...body.RegistrationDetails, registrationType: "INDIVIDUAL" };
        
//         console.log('[fetch intercept] Kişisel bilgiler değiştirildi. İstek gönderiliyor...');
//         configBody.body = JSON.stringify(body);
//     }
    
//     const response = await originalFetch(resource, configBody);

//     if (typeof resource === 'string' && resource.includes('/api/v1/order')) {
//         const clonedResponse = response.clone();
//         clonedResponse.json().then(data => {
//             if (data.response && data.response.referenceNumber) {
//                 console.clear();
//                 console.log("✅✅✅ REZERVASYON BAŞARILI! ✅✅✅");
//                 console.log("ÖDEME İÇİN AŞAĞIDAKİ BİLGİLERİ KOPYALAYIP BİR SONRAKİ