import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_CHAT_SECRET;
console.log("Using secret key:", SECRET_KEY);
export const encryptText = (plainText) => {
  console.log("Encrypting text:", plainText);
  console.log("Secret key:", SECRET_KEY);
  console.log("Encrypted text:", CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString());
  return CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
};

export const decryptText = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    console.log("Decrypted bytes:", bytes.toString(CryptoJS.enc.Utf8));
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
};
