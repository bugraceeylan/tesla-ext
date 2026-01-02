// tesla_payment_node.js
import fetch from 'node-fetch';
import { createCipheriv, randomBytes } from 'crypto';
import { config } from './config.js';

const {
  vin,
  rn,
  token,
  cardInfo,
  billingInfo
} = config;

function encryptCardData(data) {
  const iv = randomBytes(16);
  const key = Buffer.from(config.adyenKey, 'hex');
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return { encrypted, iv: iv.toString('base64') };
}

function normalizeName(name) {
  return name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ı/g, 'i')
    .toUpperCase();
}

async function pay() {
  console.log('🔐 Ödeme bilgileri hazırlanıyor...');

  const cardNumber = cardInfo.number.replace(/\s+/g, '');
  const genTime = new Date().toISOString();
  const nameOnCard = normalizeName(cardInfo.holder);

  const encCardNumber = encryptCardData(cardNumber).encrypted;
  const encMonth = encryptCardData(cardInfo.expMonth).encrypted;
  const encYear = encryptCardData(cardInfo.expYear).encrypted;
  const encCVC = encryptCardData(cardInfo.cvv).encrypted;

  const paymentPayload = {
    billingAddress: {
      addressLine1: billingInfo.address,
      addressLine2: '',
      countryCode: 'TR',
      zipCode: billingInfo.zip,
      city: billingInfo.city,
      stateProvince: billingInfo.state
    },
    browserInfo: {
      colorDepth: 24,
      javaEnabled: false,
      language: 'tr-TR',
      screenHeight: 1080,
      screenWidth: 1920,
      timeZoneOffset: 0,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    },
    deviceFingerprint: 'DpqwU4zEdN0050000000000000xZXdueIoxW0042670530c...',
    ipAddress: '0.0.0.0',
    locale: 'tr_TR',
    processWithProfile: false,
    signedData: token,
    paymentDetails: [{
      amount: 175000,
      currency: 'TRY',
      hostUrl: Buffer.from(`https://www.tesla.com/tr_TR/modely/order/payment_done/${rn}/${vin}`).toString('base64'),
      isMobile: false,
      metadata: { redirectMethod: 'GET' },
      paymentType: 'CREDITCARD',
      processWithProfile: false,
      returnUrl: 'https://static-assets-pay.tesla.com/v5/adyen_done.html?locale=tr_TR',
      saveToProfile: true,
      nameOnTheInstrument: nameOnCard,
      encryptedCardNumber: encCardNumber,
      encryptedExpiryMonth: encMonth,
      encryptedExpiryYear: encYear,
      encryptedSecurityCode: encCVC,
      paymentProcessor: 'ADYEN',
      type: 'CREDITCARD',
      lastFourDigits: cardNumber.slice(-4),
      expirationMonth: cardInfo.expMonth,
      expirationYear: cardInfo.expYear,
      cardType: cardNumber.startsWith('4') ? 'VISA' : cardNumber.startsWith('5') ? 'MASTERCARD' : 'UNKNOWN'
    }]
  };

  console.log('📤 Ödeme isteği gönderiliyor...');
  const res = await fetch('https://static-assets-pay.tesla.com/api/payments/v4', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify(paymentPayload),
    credentials: 'include'
  });

  if (!res.ok) {
    console.error('❌ Ödeme hatası:', await res.text());
    return;
  }

  const data = await res.json();
  console.log('✅ Ödeme sonucu:', data);
}

pay().catch(console.error);
