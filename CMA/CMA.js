import { stocks } from '../machuom/machuom-stocks.js';
//onclicks
document.querySelector('.add-stocks-button').addEventListener('click',updateStockQuantity);

function updateStockQuantity() {
  const companyName = document.querySelector('.company-name-input').value
  const addedAmount =  parseFloat(document.querySelector('.added-amount-input').value);
  const stock = stocks.find(s => s.name === companyName);
  if (!stock) {
    console.error(`Stock ${companyName} not found.`);
    return;
  } else {
    stock.quantity += addedAmount;
    console.log(`Updated ${companyName} quantity: ${addedAmount} shares added.`);
  }
}
