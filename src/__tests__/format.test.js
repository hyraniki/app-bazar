import { formatBRL } from '../src/utils/format';[cite: 1]

describe('Testes da função formatBRL', () => {
  it('Deve formatar valores numéricos para o padrão monetário brasileiro', () => {
    expect(formatBRL(189.9)).toBe('R$ 189,90');
    expect(formatBRL(145)).toBe('R$ 145,00');
    expect(formatBRL(0)).toBe('R$ 0,00');
  });

  it('Deve tratar entradas em formato de string que contêm números', () => {
    expect(formatBRL('299.9')).toBe('R$ 299,90');
  });
});