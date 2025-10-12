// Silencia avisos ruidosos durante os testes (ex.: JwtService em NODE_ENV !== 'production')
const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
console.warn('[jest] NODE_ENV =', process.env.NODE_ENV);

afterAll(() => {
  warnSpy.mockRestore();
});
