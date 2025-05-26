import { adminAdress } from "../machuom/machuom-stocks.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

export const traderAdress = '';
export let qrCodes = [];
export const traderETF = [];
let etfPrice = 1;

window.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.querySelector('.generate-item-Qr');
  if (!generateButton) {
    console.error("generate-item-Qr button not found.");
    return;
  }

  generateButton.addEventListener('click', () => {
    const productPriceValue = parseFloat(document.querySelector('.object-price-input').value);
    if (isNaN(productPriceValue)) {
      console.error("Invalid product price. Please enter a numerical value.");
      return;
    }

    const newQr = generateQrcode(adminAdress, traderAdress, '', productPriceValue);
    console.log("QR Code generated:", newQr);
    console.log("QR Codes array:", qrCodes);
  });
});


// Example implementation for calculateLiquidity: 1% of product price.
export function calculateLiquidity(productPrice) {
  return productPrice * 0.01;
}

// Example implementation for calculateReward:
export function calculateReward(etfPrice, liquidity) {
  if (etfPrice === 0) {
    console.error("ETF Price is zero - cannot calculate reward.");
    return 0;
  }
  return liquidity / etfPrice;
}

//counter error


export function generateQrcode(adminAddress, traderAddress, consumerAddress, productPrice) {
  const codeId = 'machuom_' + Math.random().toString(36).substring(2, 8) + '_' + uuidv4();
  const liquidityInput = calculateLiquidity(productPrice);
  const reward = calculateReward(etfPrice, liquidityInput);
  
  const qrObject = {
    id: codeId,
    adresses: {
      adminAdress: adminAddress,
      consumerAdress: consumerAddress, // remains empty initially
      traderAdress: traderAddress,
    },
    details: {
      objectName: document.querySelector('.object-name-input').value,
      objectDescription: document.querySelector('.object-description-input').value,
      objectType: document.querySelector('.object-type-input').value,
      objectCategory: document.querySelector('.object-category-input').value,
      objectPrice: document.querySelector('.object-price-input').value,
    },
    reward: reward,
    consumerAdress: '',
    status: 'active',
    createdAt: new Date(),
    rewardSent: false,
    liquidity: liquidityInput,
    liquidityProvided: false,
  };
  // Add the new QR code to the array
  qrCodes.push(qrObject);
  return qrObject;
}

