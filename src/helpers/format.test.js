import { ellipsis, lowercase, uppercase } from './Format';

describe('ellipsis', () => {
  it('string ellipsis', () => {
    expect(ellipsis('出现省略号吧，是不是', 12)).toBe('出现省略号吧...');
  });
});

describe('lowercase', () => {
  it('string lowercase', () => {
    expect(lowercase('to LowerCase', 12)).toBe('to lowercase');
  });
});

describe('uppercase', () => {
  it('string uppercase', () => {
    expect(uppercase('to uppercase', 12)).toBe('TO UPPERCASE');
  });
});
