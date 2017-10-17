import { ellipsis, lowercase, uppercase, fileSize } from './Format';

describe(' format utils ', () => {
  it('string ellipsis', () => {
    expect(ellipsis('出现省略号吧，是不是', 12)).toBe('出现省略号吧...');
  });

  it('string lowercase', () => {
    expect(lowercase('to LowerCase')).toBe('to lowercase');
  });

  it('string uppercase', () => {
    expect(uppercase('to uppercase')).toBe('TO UPPERCASE');
  });

  it('file size', () => {
    expect(fileSize(2000)).toBe('TO UPPERCASE');
  });
});
