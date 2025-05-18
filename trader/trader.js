import { adminAdress } from "../machuom/machuom-stocks.js";

export const traderAdress = ''
export let qrCodes = [];
export const traderETF = [];

export function generateQrcode(adminAdress, traderAdress) {
  const codeId = 'mac' + Math.floor(Math.random() * 1000000);

  const qrObject = {
    id: codeId,
    adresses:{
      adminAdress: adminAdress,
      consumerAdress: '',
      traderAdress: traderAdress,
    },
    details: {
      objectName:'',
      objectDescription:'',
      objectType:'',
      objectCategory:'',
      objectPrice: productPrice,
    },
    reward:50,
    consumerAdress: '',
    status: 'active',
    createdAt: new Date(),
    rewardSent: false,
  };
  qrCodes.push(qrObject);
}

function calculateLiquidity(productPrice){
  const liquidity = productPrice * 0.01;
  return liquidity;
};
