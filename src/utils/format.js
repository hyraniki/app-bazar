export function formatBRL(value) {
  const num = typeof value === 'number' ? value : parseFloat(value) || 0;
  return `R$ ${num.toFixed(2).replace('.', ',')}`;
}
