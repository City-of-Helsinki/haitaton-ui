import { notifyConstraint } from './notifyConstraint';

describe('notifyConstraint', () => {
  const t = ((key: string) => `t(${key})`) as unknown as import('i18next').TFunction;
  it('emits selfIntersecting notification with correct keys', () => {
    const spy: jest.Mock = jest.fn();
    notifyConstraint(spy, t, 'selfIntersecting');
    expect(spy).toHaveBeenCalledTimes(1);
    const [open, options] = spy.mock.calls[0];
    expect(open).toBe(true);
    expect(options.label).toBe('t(map:notifications:selfIntersectingLabel)');
    expect(options.message).toBe('t(map:notifications:selfIntersectingText)');
  });
  it('emits outsideArea notification with correct keys', () => {
    const spy: jest.Mock = jest.fn();
    notifyConstraint(spy, t, 'outsideArea');
    const [, options] = spy.mock.calls[0];
    expect(options.label).toBe('t(map:notifications:drawingOutsideHankeAreaLabel)');
    expect(options.message).toBe('t(map:notifications:drawingOutsideHankeAreaText)');
  });
  it('allows overrides', () => {
    const spy: jest.Mock = jest.fn();
    notifyConstraint(spy, t, 'outsideArea', {
      labelKeyOverride: 'custom:label',
      messageKeyOverride: 'custom:message',
      autoCloseDuration: 1000,
      typeOverride: 'success',
    });
    const [, options] = spy.mock.calls[0];
    expect(options.label).toBe('t(custom:label)');
    expect(options.message).toBe('t(custom:message)');
    expect(options.autoCloseDuration).toBe(1000);
    expect(options.type).toBe('success');
  });
});
