// Silencia avisos ruidosos durante os testes (ex.: JwtService em NODE_ENV !== 'production')
const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
console.warn('[jest] NODE_ENV =', process.env.NODE_ENV);

afterAll(() => {
  warnSpy.mockRestore();
});

if (process.env.CI) {
  // Atraso global apenas no CI para estabilizar seeds assíncronos em repositórios in-memory
  const ciDelayMs = Number(process.env.JEST_CI_BOOT_DELAY_MS ?? 400);

  // Espera antes de cada teste (roda antes dos beforeEach dos próprios testes)
  beforeEach(async () => {
    await new Promise(r => setTimeout(r, ciDelayMs));
  });
}
