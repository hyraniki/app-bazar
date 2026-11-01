import CryptoJS from 'crypto-js';

/**
 * Funções de criptografia do app.
 *
 * Sobre o exemplo com `react-native-hash` (JSHash): esse pacote depende de
 * código nativo e só funciona em um "development build" feito com EAS Build —
 * NÃO funciona dentro do Expo Go nem do Snack. Por isso usamos `crypto-js`,
 * que é 100% JavaScript e funciona em qualquer lugar sem configuração extra.
 */

// Hash de senha (SHA-256) — irreversível, abordagem correta para senhas.
// Nunca guardamos a senha em texto puro nem de forma reversível.
export function hashPassword(password) {
  return CryptoJS.SHA256(password).toString();
}

export function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

// Criptografia reversível (AES) — usada para dados que precisam ser lidos de
// volta depois, como o histórico de pedidos.
// NOTA: em produção essa chave não deveria ficar fixa no código-fonte.
const SECRET_KEY = 'bazar-da-shirley-secret-key-2024';

export function encryptData(data) {
  const json = JSON.stringify(data);
  return CryptoJS.AES.encrypt(json, SECRET_KEY).toString();
}

export function decryptData(cipherText) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const text = bytes.toString(CryptoJS.enc.Utf8);
    if (!text) return null;
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}
