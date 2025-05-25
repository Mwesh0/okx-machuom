import { adminAdress } from "../machuom/machuom-stocks.js";
import { v4 as uuidv4 } from 'uuid';

export const traderAdress = ''
export let qrCodes = [];
export const traderETF = [];

export function generateQrcode(adminAdress, traderAdress, consumerAdress, productPrice) {
  const codeId = 'machuom_' + uuidv4();
  const productPriceInput = productPrice
  const LiquidityInput = calculateLiquidity(productPrice);
  
  const qrObject = {
    id: codeId,
    adresses:{
      adminAdress: adminAdress,
      consumerAdress: consumerAdress,
      traderAdress: traderAdress,
    },
    details: {
      objectName:'',
      objectDescription:'',
      objectType:'',
      objectCategory:'',
      objectPrice: productPriceInput,
    },
    reward: calculateReward(etfPrice, LiquidityInput),
    consumerAdress: '',
    status: 'active',
    createdAt: new Date(),
    rewardSent: false,
    liquidity: LiquidityInput,
  };
  qrCodes.push(qrObject);

  return qrObject;
}

export function calculateLiquidity(productPrice){
  const liquidity = productPrice * 0.01;
  return liquidity;
};

export function calculateReward(etfPrice, liquidity) {
  const liquidityValue = liquidity;
  const etfPrice = etfPrice
  liquidityValue/etfPrice;
  return liquidityValue / etfPrice;
};