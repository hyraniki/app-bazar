import AsyncStorage from '@react-native-async-storage/async-storage';[cite: 1]
import { saveSession, getSession, KEYS } from '../src/utils/storage';[cite: 1]

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

describe('Testes de AsyncStorage - Sessão', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve salvar o nome do usuário na sessão com a chave correta', async () => {
    const testUsername = 'shirley_admin';
    await saveSession(testUsername);[cite: 1]
    
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(KEYS.SESSION, testUsername);[cite: 1]
  });

  it('deve recuperar o usuário da sessão corretamente', async () => {
    const testUsername = 'shirley_admin';
    AsyncStorage.getItem.mockResolvedValueOnce(testUsername);

    const result = await getSession();[cite: 1]
    
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(KEYS.SESSION);[cite: 1]
    expect(result).toBe(testUsername);
  });
});