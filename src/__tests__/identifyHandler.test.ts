import { identifyHandler } from '../handlers/identifyHandler';

const makeEvent = (body: object) => ({
  requestContext: { http: { path: '/identify' } },
  body: JSON.stringify(body)
} as any);

describe('identifyHandler', () => {
  it('returns 400 for missing cpf', async () => {
    const res = await identifyHandler(makeEvent({}));
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for invalid cpf', async () => {
    const res = await identifyHandler(makeEvent({ cpf: '123' }));
    expect(res.statusCode).toBe(400);
  });
  it('returns success for valid cpf', async () => {
    const res = await identifyHandler(makeEvent({ cpf: '52998224725' }));
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.message).toBe('CPF validation successful');
    expect(body.cpf).toBe('52998224725');
    expect(body.status).toBe('validated');
  });
});
