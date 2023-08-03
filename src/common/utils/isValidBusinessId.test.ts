import isValidBusinessId from './isValidBusinessId';

test('Should return true with valid business id', () => {
  expect(isValidBusinessId('2182805-0')).toBeTruthy();
  expect(isValidBusinessId('7126070-7')).toBeTruthy();
  expect(isValidBusinessId('1164243-9')).toBeTruthy();
  expect(isValidBusinessId('3227510-5')).toBeTruthy();
  expect(isValidBusinessId('3362438-9')).toBeTruthy();
  expect(isValidBusinessId('7743551-2')).toBeTruthy();
  expect(isValidBusinessId('8634465-5')).toBeTruthy();
  expect(isValidBusinessId('0407327-4')).toBeTruthy();
  expect(isValidBusinessId('7542843-1')).toBeTruthy();
  expect(isValidBusinessId('6545312-3')).toBeTruthy();
});

test('Should return false with invalid business id', () => {
  expect(isValidBusinessId('21828053-0')).toBeFalsy();
  expect(isValidBusinessId('712600-7')).toBeFalsy();
  expect(isValidBusinessId('7126070.7')).toBeFalsy();
  expect(isValidBusinessId('12345678')).toBeFalsy();
  expect(isValidBusinessId('0407327-')).toBeFalsy();
  expect(isValidBusinessId('3362438-4')).toBeFalsy();
  expect(isValidBusinessId('0100007-1')).toBeFalsy();
});
