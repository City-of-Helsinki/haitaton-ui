// eslint-disable-next-line import/no-extraneous-dependencies
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/projects/:projectId', (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        id: 'haitaton-123',
        title: 'foo',
      })
    )
  ),
];
