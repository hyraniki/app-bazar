import AsyncStorage from '@react-native-async-storage/async-storage';
import { hashPassword, verifyPassword, encryptData, decryptData } from './crypto';

/**
 * AsyncStorage funcionando como "banco de dados" local do app, com 3 tabelas:
 *  - USERS: usuários cadastrados (usuário + hash da senha)
 *  - SESSION: usuário atualmente logado
 *  - ORDERS: histórico de pedidos finalizados (criptografado com AES)
 */
export const KEYS = {
  USERS: '@bazar:users',
  SESSION: '@bazar:session',
  ORDERS: '@bazar:orders',
};

/* ------------------------- Usuários (cadastro) ------------------------- */

export async function getUsers() {
  const raw = await AsyncStorage.getItem(KEYS.USERS);
  if (!raw) return [];
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : [];
}

/**
 * Cadastra um novo usuário, salvando a senha já com hash SHA-256
 * (nunca em texto puro).
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function registerUser(username, password) {
  const clean = username.trim().toLowerCase();
  const users = await getUsers();

  if (users.some((u) => u.username === clean)) {
    return { success: false, message: 'Esse usuário já existe.' };
  }

  const passwordHash = hashPassword(password);
  const updated = [...users, { username: clean, passwordHash }];
  await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(updated));

  return { success: true, message: 'Cadastro realizado com sucesso!' };
}

/**
 * Verifica se usuário + senha batem com algum cadastro salvo.
 * @returns {Promise<boolean>}
 */
export async function validateLogin(username, password) {
  const clean = username.trim().toLowerCase();
  const users = await getUsers();
  const found = users.find((u) => u.username === clean);
  if (!found) return false;
  return verifyPassword(password, found.passwordHash);
}

/* ------------------------------ Sessão ------------------------------ */

export async function saveSession(username) {
  await AsyncStorage.setItem(KEYS.SESSION, username);
}

export async function getSession() {
  return AsyncStorage.getItem(KEYS.SESSION);
}

export async function clearSession() {
  await AsyncStorage.removeItem(KEYS.SESSION);
}

/* ------------------------------ Pedidos ------------------------------ */

export async function saveOrder(order) {
  const existing = await getOrders();
  const updated = [...existing, order];
  const encrypted = encryptData(updated);
  await AsyncStorage.setItem(KEYS.ORDERS, encrypted);
  return updated;
}

export async function getOrders() {
  const encrypted = await AsyncStorage.getItem(KEYS.ORDERS);
  if (!encrypted) return [];
  const data = decryptData(encrypted);
  return Array.isArray(data) ? data : [];
}