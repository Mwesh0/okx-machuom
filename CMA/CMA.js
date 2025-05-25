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
