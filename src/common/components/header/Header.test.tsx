import React from 'react';
import { render, cleanup, screen } from '../../../testUtils/render';
import Header from './Header';
import useUser from '../../../domain/auth/useUser';

const mockedUseUser = useUser as jest.Mock<any>;
jest.mock('../../../domain/auth/useUser');

describe('Header', () => {
  beforeEach(() => {
    const mockedUser = {
      profile: {
        name: 'Test User',
      },
    };
    mockedUseUser.mockImplementation(() => ({ data: mockedUser }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('it should render correct links', () => {
    render(<Header />);

    expect(screen.getByText('Hankkeet yleisillä alueilla')).toBeInTheDocument();
    expect(screen.getByText('Luo uusi hanke')).toBeInTheDocument();
    expect(screen.getByText('Omat hankkeet')).toBeInTheDocument();
    expect(screen.getByText('Työohjeet')).toBeInTheDocument();
  });

  test('it should display user name', () => {
    render(<Header />);

    expect(screen.getAllByText('Test User')).toHaveLength(2);
  });
});
