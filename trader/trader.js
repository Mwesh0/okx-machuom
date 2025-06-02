import { adminAdress } from "../machuom/machuom-stocks.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

export const traderAdress = '';
export let qrCodes = JSON.parse(localStorage.getItem('qrCodes')) || [];
export const traderETF = [];
export const awaitingForLiquidity = [];
export let ammountOfLiquidity = 0; 
export let etfPrice = 1;
export const tradersCircle = JSON.parse(localStorage.getItem('tradersCircle')) || [];
export let productDetailsTemplate = `
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
  `

if (!localStorage.getItem('qrCodes')) {
  localStorage.setItem('qrCodes', JSON.stringify([]));
}
if (!localStorage.getItem('tradersCircle')) {
  localStorage.setItem('tradersCircle', JSON.stringify([]));
}

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
  }
  localStorage.setItem('qrCodes', JSON.stringify(qrCodes));
  console.log("Liquidity processed, updated QR Codes:", qrCodes);
}

window.addEventListener('DOMContentLoaded', () => {
  // Optionally log localStorage data on page load:
  console.log("Stored qrCodes:", JSON.parse(localStorage.getItem('qrCodes')));
  console.log("Stored tradersCircle:", JSON.parse(localStorage.getItem('tradersCircle')));
  
  function soatMuiltipleTraders() {
    const newProduct = document.querySelector('.New-product-select');
    const existProduct = document.querySelector('.existing-product-select');
    
    newProduct.addEventListener('click', () => {
      document.body.innerHTML = `
        <div class="new-product-form">
          ${productDetailsTemplate}
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
          tradersCircle.push(newQr)
          localStorage.setItem('tradersCircle', JSON.stringify(tradersCircle));
          console.log("QR Code added to tradersCircle:", tradersCircle);
        } else if(traderType.toLowerCase() === 'retailer'){
          qrCodes.push(newQr);
          localStorage.setItem('qrCodes', JSON.stringify(qrCodes));
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
      verifyQrCode();
      // Attach event listeners for "veryfy-Qr-button" as needed.
    });
  }
  
  soatMuiltipleTraders();
  
});

// Verify QR code: attach listener to the verify button after rendering the form
function verifyQrCode() {
  const verifyButton = document.querySelector('.veryfy-Qr-button');
  if (!verifyButton) {
    console.error("Verify button not found.");
    return;
  }
  verifyButton.addEventListener('click', () => {
    const qrCodeInput = document.querySelector('.exist-Qrcheck-input').value;
    if (!qrCodeInput) {
      console.error("Please enter a QR code to verify.");
      return;
    }
    
    // Get the tradersCircle from localStorage or in-memory array (assuming tradersCircle is defined globally)
    const storedTraders = JSON.parse(localStorage.getItem('tradersCircle')) || tradersCircle;
    const qrObject = storedTraders.find(qr => qr.id === qrCodeInput);
    
    if (qrObject) {
      console.log("QR Code verified:", qrObject);
      document.body.innerHTML = `
        <div class="qr-code-details">
          <div><strong>QR Code ID:</strong> ${qrObject.id}</div>
          <input type="text" class="object-name-input" placeholder="Object name" value="${qrObject.details.objectName || ''}">
          <input type="text" class="object-description-input" placeholder="Object description" value="${qrObject.details.objectDescription || ''}">
          <input type="text" class="object-type-input" placeholder="Object type" value="${qrObject.details.objectType || ''}">
          <input type="text" class="object-category-input" placeholder="Object category" value="${qrObject.details.objectCategory || ''}">
          <input type="number" class="object-price-input" placeholder="Object price ksh" value="${qrObject.details.objectPrice || ''}">
          <select class="trader-type-select">
            <option value="intemidiate" ${qrObject.traderType === 'intemidiate' ? 'selected' : ''}>intemidiate</option>
            <option value="retailer" ${qrObject.traderType === 'retailer' ? 'selected' : ''}>retailer</option>
          </select>
          <button class="Existing-item-Add">add item</button>
        </div>`;
      
      // Now attach listener to the new button (using the locally verified qrObject)
      attachExistingItemAddListener(qrObject);
    } else {
      console.error("QR Code not found in tradersCircle:", qrCodeInput);
    }
  });
}

// Guard function: checks whether a QR code is already in the qrCodes array.
function isDuplicate(qr) {
  return qrCodes.some(item => item.id === qr.id);
}

// Helper function: adds to qrCodes if not a duplicate; otherwise, logs a warning.
function addToQrCodesIfNotDuplicate(qr) {
  if (!isDuplicate(qr)) {
    qrCodes.push(qr);
    localStorage.setItem('qrCodes', JSON.stringify(qrCodes));
    console.log("Existing item added to qrCodes array:", qrCodes);
  } else {
    console.warn(`Duplicate QR Code ${qr.id} not added.`);
  }
}

// Attach the event listener to the "Existing-item-Add" button in the rendered form.
function attachExistingItemAddListener(qrObject) {
  const addItemBtn = document.querySelector('.Existing-item-Add');
  if (!addItemBtn) {
    console.error("Existing-item-Add button not found.");
    return;
  }
  addItemBtn.addEventListener('click', () => {
    // Gather updated details from the form
    const updatedQr = { ...qrObject };
    updatedQr.details.objectName = document.querySelector('.object-name-input')?.value;
    updatedQr.details.objectDescription = document.querySelector('.object-description-input')?.value;
    updatedQr.details.objectType = document.querySelector('.object-type-input')?.value;
    updatedQr.details.objectCategory = document.querySelector('.object-category-input')?.value;
    updatedQr.details.objectPrice = document.querySelector('.object-price-input')?.value;
    updatedQr.traderType = document.querySelector('.trader-type-select')?.value;
    
    if (!updatedQr.traderType) {
      console.error("Trader type not selected.");
      return;
    }
    
    if (updatedQr.traderType.toLowerCase() === 'intemidiate') {
      // For intemidiate, simply add/update in tradersCircle.
      tradersCircle.push(updatedQr);
      localStorage.setItem('tradersCircle', JSON.stringify(tradersCircle));
      console.log("Existing item added to tradersCircle:", tradersCircle);
    } else if (updatedQr.traderType.toLowerCase() === 'retailer') {
      // Remove from tradersCircle if it exists...
      const index = tradersCircle.findIndex(item => item.id === updatedQr.id);
      if (index > -1) {
        tradersCircle.splice(index, 1);
        localStorage.setItem('tradersCircle', JSON.stringify(tradersCircle));
        console.log(`QR Code ${updatedQr.id} removed from tradersCircle.`);
      }
      // Then add to qrCodes array.
      addToQrCodesIfNotDuplicate(updatedQr);
    } else {
      console.error("Unknown trader type selected:", updatedQr.traderType);
    }
  });
} 
