import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_CHAT_SECRET;

export const encryptText = (plainText) => {
  return CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
};

export const decryptText = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
};
