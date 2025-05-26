 
export const adminAdress =''
export const adminETF = [];

 // Core stock data
export const stocks = 
[
  { id: 1, name: 'companyA', quantity: 120 },
  { id: 2, name: 'companyB', quantity: 100 },
  { id: 3, name: 'companyC', quantity: 150 },
  // Additional companies as needed
];

  export const etfList = [];

// Simple ETF factory
export function factorycreateETF(_ETFname) {
  return {
    id: Date.now(),
    type: _ETFname,
    quantity: 1
  };
}

export const eligibleStocks = 
[
  {
    required: 100,
    companies: ['companyA', 'companyB', 'companyC'],
    name:'energy ETF'
  },
  {
    required: 50,
    companies: ['companyD', 'companyE' , 'companyF'],
    name:'technology ETF'
  },
  {
    required: 75,
    companies: ['companyG', 'companyH', 'companyI'],
    name:'healthcare ETF'
  }
]

 // Function to create an ETF
export function createETF(eligibleStocks) {
  const stockMap = Object.fromEntries(stocks.map(s => [s.name, s]));
  const requiredStocks = eligibleStocks
  const companies = requiredStocks.companies;
  const ETFname = requiredStocks.name;
   
  // Verify availability
  const allAvailable = companies.every(name => {
    const stock = stockMap[name];
    return stock && stock.quantity >=requiredStocks.required;
  });

  if (!allAvailable) {
    console.error('Not enough stocks to create an ETF.');
    return null;
  } else {
     // Deduct shares
     companies.forEach(name => {
     stockMap[name].quantity -= requiredStocks.required;
     });
  }

  // Create and return the new ETF
  return factorycreateETF(ETFname) ;
}
console.log(etfList);

export function addOrAccumulateETF(newETF) {
  const existingETF = etfList.find(etf => etf.type === newETF.type);
  if (existingETF) {
    // If found, increase the ETF's quantity, or perform other accumulation logic
    existingETF.quantity += newETF.quantity;
  } else {
    etfList.push(newETF);
  }
}

export function createAddEtf(){
  // Process all eligible stocks to create ETFs and add them to etfList.
  eligibleStocks.forEach(eligible => {
  const newETF = createETF(eligible);
  if (newETF) {
    addOrAccumulateETF(newETF);
  }
});

console.log(etfList);
}

// ... [existing code above remains unchanged]

export function createETFsByName(etfName, quantity) {
  // Find the eligible configuration by matching the ETF name (case sensitive)
  const eligible = eligibleStocks.find(e => e.name === etfName);
  if (!eligible) {
    console.error(`Eligible configuration for ETF "${etfName}" not found.`);
    return;
  }
  
  for (let i = 0; i < quantity; i++) {
    // Attempt to create one ETF at a time
    const newETF = createETF(eligible);
    if (!newETF) {
      console.error(`Conditions not met to create ETF at iteration ${i + 1}.`);
      break;
    } else {
      addOrAccumulateETF(newETF);
    }
  }
  console.log("Final ETF list:", etfList);
}

 /*document.querySelector('.create-etf-button').addEventListener('click', () => {
  const etfName = document.querySelector('.etf-name-input').value;
  const quantity = parseInt(document.querySelector('.etf-quantity-input').value);
      if (!etfName || isNaN(quantity)) {
        console.error("Invalid ETF name or quantity.");
        return;
      }
      createETFsByName(etfName, quantity);
    });
*/

