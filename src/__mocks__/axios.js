// eslint-disable-next-line import/no-extraneous-dependencies
import mockAxios from 'jest-mock-axios';

export default {
  ...mockAxios,
  create: jest.fn(() => ({
    ...mockAxios,
    defaults: {
      headers: {
        post: {},
      },
    },
  })),
};
