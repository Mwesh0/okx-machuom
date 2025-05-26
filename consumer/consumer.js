import { traderETF, qrCodes} from '../trader/trader.js';
import {etfList, adminETF } from "../machuom/machuom-stocks.js";

export let consumerAdress;
export let consumerBalance = 0;
export let consumerETFs = [];

 // Wait until the DOM is fully loaded
    window.addEventListener('DOMContentLoaded', () => {
      const scanButton = document.querySelector('.scan-qr-button');
      if (!scanButton) {
        console.error("Scan QR button not found.");
        return;
      }
      
      scanButton.addEventListener('click', () => {
        const codeId = document.querySelector('.qr-code-input').value;
        const consumerAdress = document.querySelector('.consumer-adress-input').value;
  
        if (!codeId || !consumerAdress) {
          console.error("Please enter both the QR code ID and your consumer address.");
          return;
        }
  
        try {
          const result = scanQrcode(codeId, consumerAdress);
          console.log("QR Code successfully scanned:", result);
        } catch (error) {
          console.error("Error scanning QR Code:", error.message);
        }
      });
    });

//award sector based ETF
export function awardETFFromQRCode(qrObject) {
  const objectCategory = qrObject.details.objectCategory;
  const reward = qrObject.reward;

  etfList.forEach(etf => {
    if (etf.type === objectCategory) {
      // Calculate reward shares
      const consumerReward = reward * 0.5;
      const traderReward = reward * 0.4;
      const adminReward = reward * 0.1;

      // Award consumer ETF: accumulate quantity if same type already awarded
      const existingConsumerETF = consumerETFs.find(item => item.type === etf.type);
      if (existingConsumerETF) {
        existingConsumerETF.quantity += consumerReward;
      } else {
        consumerETFs.push({ ...etf, quantity: consumerReward });
      }

      // Award trader ETF: accumulate quantity if same type already awarded
      const existingTraderETF = traderETF.find(item => item.type === etf.type);
      if (existingTraderETF) {
        existingTraderETF.quantity += traderReward;
      } else {
        traderETF.push({ ...etf, quantity: traderReward });
      }
      // Award admin ETF: accumulate quantity if same type already awarded
      const existingAdminETF = adminETF.find(item => item.type === etf.type);
      if (existingAdminETF) {
        existingAdminETF.quantity += adminReward;
      } else {
        adminETF.push({ ...etf, quantity: adminReward });
      }
    }
  });
}

export function scanQrcode(codeId, consumerAdress){
  const qrCode = qrCodes.find(qr => qr.id === codeId);
  if (!qrCode) {
    throw new Error('QR code not found');
  }
  if (qrCode.status !== 'active') {
    throw new Error('QR code is not active');
  }
  if (qrCode.consumerAdress) {
    throw new Error('QR code already scanned by another consumer');
  } else {
    qrCode.consumerAdress = consumerAdress;
  }

  qrCode.status = 'scanned';
  qrCode.rewardSent = true;

  
  awardETFFromQRCode(qrCode);
  return qrCode;
}