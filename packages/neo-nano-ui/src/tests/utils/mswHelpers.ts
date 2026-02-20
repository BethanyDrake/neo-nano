import { server } from '@/vitest.setup';
import { http, HttpResponse, JsonBodyType } from 'msw';

export const mockRequest = <T extends JsonBodyType>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  response: T,
  status: number = 200,
)=> {
  server.use(
    http[method](url, async () => {
      return HttpResponse.json(response, { status });
    }),
  );
};