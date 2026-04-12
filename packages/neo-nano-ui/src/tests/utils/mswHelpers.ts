import { http, HttpResponse, JsonBodyType } from 'msw';
import { SetupServer } from 'msw/node';

export const mockRequest = (server: SetupServer) => <T extends JsonBodyType>(
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