import { render, screen } from '../../../../testUtils/render';
import AddressSearch from './AddressSearch';

test('Address can be selected from suggestions', async () => {
  const handleAddressSelect = jest.fn();
  const { user } = render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');
  await user.type(searchInput, 'elielinaukio');

  expect(await screen.findByText('Elielinaukio 3', {}, { timeout: 30000 })).toBeInTheDocument();
  await user.click(screen.getByText('Elielinaukio 3'));

  expect(handleAddressSelect).toHaveBeenCalledWith([25496700, 6673224]);
});

test('Swedish address labels are returned when search term is in Swedish', async () => {
  const handleAddressSelect = jest.fn();
  const { user } = render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');
  await user.type(searchInput, 'elielplatsen');

  expect(await screen.findByText('Elielplatsen 1', {}, { timeout: 30000 })).toBeInTheDocument();
  expect(screen.getByText('Elielplatsen 2')).toBeInTheDocument();
  expect(screen.getByText('Elielplatsen 3')).toBeInTheDocument();
  expect(screen.getByText('Elielplatsen 5')).toBeInTheDocument();
});

test('Finnish address labels are returned when search term is in Finnish', async () => {
  const handleAddressSelect = jest.fn();
  const { user } = render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');
  await user.type(searchInput, 'elielinaukio');

  expect(await screen.findByText('Elielinaukio 1', {}, { timeout: 30000 })).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 2')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 3')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 5')).toBeInTheDocument();
});

test('Finnish address labels are returned when search term is incomplete and can be either Finnish or Swedish', async () => {
  const handleAddressSelect = jest.fn();
  const { user } = render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');
  await user.type(searchInput, 'eliel');

  expect(await screen.findByText('Elielinaukio 1', {}, { timeout: 30000 })).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 2')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 3')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 5')).toBeInTheDocument();
});

test('Finnish address labels are returned when search term is in Finnish and has trailing white space', async () => {
  const handleAddressSelect = jest.fn();
  const { user } = render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');
  await user.type(searchInput, 'elielinaukio ');

  expect(await screen.findByText('Elielinaukio 1', {}, { timeout: 30000 })).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 2')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 3')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 5')).toBeInTheDocument();
});

test('Finnish address label is returned when search term is in Finnish and has street number after street name', async () => {
  const handleAddressSelect = jest.fn();
  const { user } = render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');
  await user.type(searchInput, 'Elielinaukio 3');

  expect(await screen.findByText('Elielinaukio 3', {}, { timeout: 30000 })).toBeInTheDocument();
});
