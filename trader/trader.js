import { adminAdress } from "../machuom/machuom-stocks.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

export const traderAdress = '';
export let qrCodes = [];
export const traderETF = [];
const awaitingForLiquidity = [];
let ammountOfLiquidity = 0; 
let etfPrice = 1;
const tradersCircle = [];


window.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.querySelector('.generate-item-Qr');

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
  ammountOfLiquidity += liquidityInput;
  // Add the new QR code to the array
  awaitingForLiquidity.push(qrObject);
  return qrObject;
}

export function markLiquidityAsPaid() {
  // Process each QR code waiting for liquidity
  while (awaitingForLiquidity.length > 0) {
    const qrObj = awaitingForLiquidity.shift(); // Remove one from awaitingForLiquidity
    qrObj.liquidityProvided = true; 
    ammountOfLiquidity = 0// Mark as liquidity paid
    qrCodes.push(qrObj);                        // Add to main QR codes array
  }
  console.log("Liquidity processed, updated QR Codes:", qrCodes);
}

window.addEventListener('DOMContentLoaded', () => {
  
  function soatMuiltipleTraders() {
    const newProduct = document.querySelector('.New-product-select');
    const existProduct = document.querySelector('.existing-product-select');
    
    newProduct.addEventListener('click', () => {
      document.body.innerHTML = `
        <div class="new-product-form">
          <input type="text" class="object-name-input" placeholder="Object name">
          <input type="text" class="object-description-input" placeholder="Object description">
          <input type="text" class="object-type-input" placeholder="Object type">
          <input type="text" class="object-category-input" placeholder="Object category">
          <input type="number" class="object-price-input" placeholder="Object price ksh">
          <select class="trader-type-select">
            <option value="intemidiate">intemidiate</option>
            <option value="retailer">retailer</option>
          </select>
          <button class="generate-item-Qr">add item</button>
        </div>
      `;
      // Attach an event listener to the new "add item" button.
      const addItemBtn = document.querySelector('.generate-item-Qr');
      if (!addItemBtn) {
        console.error("generate-item-Qr button not found after updating DOM.");
        return;
      }
      addItemBtn.addEventListener('click', () => {
        const priceValue = parseFloat(document.querySelector('.object-price-input')?.value);
        if (isNaN(priceValue)) {
          console.error("Invalid product price. Please enter a numerical value.");
          return;
        }
        // Get the trader type selection
        const traderType = document.querySelector('.trader-type-select')?.value;
        if (!traderType) {
          console.error("Trader type not selected.");
          return;
        }
        // Generate a new QR code (using dummy consumer address '')
        const newQr = generateQrcode(adminAdress, traderAdress, '', priceValue);
        console.log("QR Code generated:", newQr);
        // Add to the appropriate array based on the trader type
        if(traderType.toLowerCase() === 'intemidiate'){
          tradersCircle.push(newQr);
          console.log("QR Code added to tradersCircle:", tradersCircle);
        } else if(traderType.toLowerCase() === 'retailer'){
          qrCodes.push(newQr);
          console.log("QR Code added to qrCodes array:", qrCodes);
        } else {
          console.error("Unknown trader type selected:", traderType);
        }
      });
    });
    
    existProduct.addEventListener('click', () => {
      document.body.innerHTML = `
        <div class="existing-product-form">
          <input type="text" class="exist-Qrcheck-input" placeholder="Qr code">
          <button class="veryfy-Qr-button">Verify</button>
        </div>
      `;
      // Attach event listeners for "veryfy-Qr-button" as needed.
    });
  }
  
  soatMuiltipleTraders();
});