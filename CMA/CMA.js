import { stocks } from '../machuom/machuom-stocks.js';

function updateStockQuantity(companyName, addedAmount) {
  const stock = stocks.find(s => s.name === companyName);
  if (!stock) {
    console.error(`Stock ${companyName} not found.`);
    return;
  }
  stock.quantity += addedAmount;
  console.log(`Updated ${companyName} quantity: ${stock.quantity}`);
}

// Example usage:
updateStockQuantity('companyA', 30); // companyA quantity changes from 120 to 150
updateStockQuantity('companyB', 20); // companyB quantity changes from 100 to 80