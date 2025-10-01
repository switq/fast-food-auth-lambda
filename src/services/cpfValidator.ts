export function validateCPF(cpf: string): boolean {
  // expect only digits
  if (!cpf || cpf.length !== 11 || !/^[0-9]{11}$/.test(cpf)) return false;

  // disallow all equal digits
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const digits = cpf.split('').map((d) => parseInt(d, 10));

  for (let t = 9; t < 11; t++) {
    let sum = 0;
    for (let i = 0; i < t; i++) {
      sum += digits[i] * (t + 1 - i);
    }
    const expected = (sum * 10) % 11 % 10;
    if (digits[t] !== expected) return false;
  }

  return true;
}
