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

// ETF type constants
export const ETF_TYPES = {
  ENERGY: 'energy',
  TECHNOLOGY: 'technology',
  HEALTHCARE: 'healthcare',
};

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
]

 // Function to create an ETF
export function createETF(eligibleStocks) {
  const requiredStocks = eligibleStocks
  const companies = requiredStocks.companies;
  const ETFname = requiredStocks.name;
  
  // Build a lookup map for constant-time access
  const stockMap = Object.fromEntries(stocks.map(s => [s.name, s]));
  
  // Verify availability
  const allAvailable = companies.every(name => {
    const stock = stockMap[name];
    return stock && stock.quantity >=requiredStocks;
  });

  if (!allAvailable) {
    console.error('Not enough stocks to create an ETF.');
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
    existingETF.quantity ++ 
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
