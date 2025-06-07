import { consumerAdress } from "../consumer/consumer.js";
import { adminAdress } from "../machuom/machuom-stocks.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

export const traderAdress = '';
export let qrCodes = JSON.parse(localStorage.getItem('qrCodes')) || [];
export const traderETF = [];
export const awaitingForLiquidity = [];
export let ammountOfLiquidity = 0; 
export let etfPrice = 1;
export const tradersCircle = JSON.parse(localStorage.getItem('tradersCircle')) || [];

export let productDetailsTemplate = 
`
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

//traders
function createTraderObject() {
  const productPriceValue = document.querySelector('.object-price-input').value;
  const traderObject = {
    traderType: document.querySelector('.trader-type-select').value,
    traderAdress: traderAdress,
    ownLiquidityInput: productPriceValue*0.01, // 1% of the product price
    reward: productPriceValue/etfPrice,
    liquidityProvided: false,
    rewardSent: false,
    createdAt: new Date(),
  },
  details = {
    objectName: document.querySelector('.object-name-input').value,
    objectDescription: document.querySelector('.object-description-input').value,
    objectType: document.querySelector('.object-type-input').value,
    objectCategory: document.querySelector('.object-category-input').value,
    objectPrice: productPriceValue,
  };
  traderObject.details = details;
  return traderObject;
};

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

// Example implementation for calculateReward:
export function calculateCumulativeReward(qrObject) {
  let ammountOfReward = 0;
  qrObject.tradersobject.forEach(trader => {
    if (!trader.rewardSent) {
      ammountOfReward +=trader.reward ;
      trader.rewardSent = true; // Mark as sent
    }
  })
  return ammountOfReward;
}

function cumulativeLiquidity(qrObject) {
  qrObject.tradersobject.forEach(trader => {
    if (!trader.liquidityProvided) {
      ammountOfLiquidity += trader.ownLiquidityInput;
      trader.liquidityProvided = true; // Mark as provided
    }
  })
  return ammountOfLiquidity;
}

export function generateQrcode(adminAddress, traderAddress, consumerAddress) {
  const traderObject = createTraderObject();
  const codeId = 'machuom_' + Math.random().toString(36).substring(2, 8) + '_' + uuidv4();
  
  const qrObject = {
    id: codeId,
    adresses: {
      adminAdress: adminAddress,
      consumerAdress: consumerAddress, // remains empty initially
      traderAdress: traderAddress,
    },
    reward: 0,
    consumerAdress: '',
    status: 'active',
    createdAt: new Date(),
    rewardSent: false,
    liquidity: 0,
    tradersobject:[]
  };
  qrObject.tradersobject.push(traderObject);

  qrObject.liquidity = cumulativeLiquidity(qrObject);
  qrObject.reward = calculateCumulativeReward(qrObject);

  // Add the new QR code to the array
  awaitingForLiquidity.push(qrObject);
  console.log('awaiting for liquidity array',awaitingForLiquidity)
  console.log('qr codes',qrCodes)
  console.log('traders circle',tradersCircle)
  return qrObject;
}

export function markLiquidityAsPaid() {
  // Process each QR code waiting for liquidity
  while (awaitingForLiquidity.length > 0) {
    const qrObj = awaitingForLiquidity.shift(); // Remove one from awaitingForLiquidity

    const exactTrader = qrObj.tradersobject.find(trader => 
      trader.traderAdress === qrObj.traderAdress)

    if (exactTrader.traderType === 'intermediate') {
      exactTrader.liquidityProvided = true;
      tradersCircle.push(qrObj);
      /*check and return edited */
      localStorage.setItem('tradersCircle', JSON.stringify(tradersCircle));
    } else if (exactTrader.traderType === 'retailer') {
      exactTrader.liquidityProvided = true;
      localStorage.getItem('tradersCircle');
      tradersCircle.splice(tradersCircle.indexOf(qrObj), 1); 
      qrCodes.push(qrObj);
      localStorage.setItem('qrCodes', JSON.stringify(qrCodes));
    }    
  } return tradersCircle || qrCodes;
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
        const newQr = generateQrcode(adminAdress, traderAdress, consumerAdress);
        console.log("QR Code generated:", newQr);
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
      // For intemidiate, update in tradersCircle:
      const index = tradersCircle.findIndex(item => item.id === updatedQr.id);
      if (index > -1) {
        // Replace the old version with the new updated version.
        tradersCircle.splice(index, 1, updatedQr);
        console.log(`QR Code ${updatedQr.id} updated in tradersCircle.`);
      } else {
        // Not already present, so add.
        tradersCircle.push(updatedQr);
        console.log(`QR Code ${updatedQr.id} added to tradersCircle.`);
      }
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

document.addEventListener('DOMContentLoaded', () => {
  const deleteLocalStorageButton = document.querySelector('.delete-Local-Storage');

  deleteLocalStorageButton.addEventListener('click', () => {
    localStorage.removeItem('qrCodes');
    localStorage.removeItem('tradersCircle');
    qrCodes = [];
    tradersCircle = [];
    console.log("Local storage cleared. qrCodes and tradersCircle are now empty.");
  }); 
});

function displayAwaitingForLiquidity() {
  const awaitingList = document.querySelector('.awaiting-list');
  awaitingList.innerHTML = ''; // Clear existing content

  awaitingForLiquidity.forEach(qr => {
    const listItem = document.createElement('li');
    listItem.textContent = `QR Code ID: ${qr.id}, Object Name: ${qr.details.objectName}`;
    awaitingList.appendChild(listItem);
  });
}
