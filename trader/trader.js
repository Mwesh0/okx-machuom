import { adminAdress } from "../machuom/machuom-stocks.js";
import { v4 as uuidv4 } from 'uuid';

export const traderAdress = ''
export let qrCodes = [];
export const traderETF = [];

export function generateQrcode(adminAdress, traderAdress) {
  const codeId = 'machuom_' + uuidv4();
  const productPrice = productPrice
  const liquidity = liquidity;
  
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
      objectPrice: productPrice,
    },
    reward: calculateReward(),
    consumerAdress: '',
    status: 'active',
    createdAt: new Date(),
    rewardSent: false,
    liquidity: liquidity,
  };
  qrCodes.push(qrObject);

  return qrObject;
}

export function calculateLiquidity(productPrice){
  const liquidity = productPrice * 0.01;
  return liquidity;
};

export function calculateReward(){
  const liquidityValue = liquidity;
  const etfPrice = etfPrice
  liquidityValue/etfPrice;
  return Number(reward);
};