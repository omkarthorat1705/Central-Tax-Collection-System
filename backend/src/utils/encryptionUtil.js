const CryptoJS = require("crypto-js");

const SECRET_KEY = "CTCS_ENTERPRISE_SECRET_KEY";

const encryptValue = (value) => {
  if (!value) return null;

  return CryptoJS.AES.encrypt(
    value,
    SECRET_KEY
  ).toString();
};

const decryptValue = (value) => {
  if (!value) return null;

  const bytes = CryptoJS.AES.decrypt(
    value,
    SECRET_KEY
  );

  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encryptValue,
  decryptValue,
};