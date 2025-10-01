import { validateCPF } from '../services/cpfValidator';

describe('CPF Validator', () => {
  it('valid known cpf should pass', () => {
    expect(validateCPF('52998224725')).toBe(true);
  });
  it('invalid cpf should fail', () => {
    expect(validateCPF('12345678901')).toBe(false); // CPF realmente inválido
  });

  it('rejects non-digit characters', () => {
    expect(validateCPF('529.982.247-25')).toBe(false);
  });
});
