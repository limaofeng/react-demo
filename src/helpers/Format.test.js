import {
  ellipsis,
  lowercase,
  uppercase,
  fileSize,
  htmlEncode,
  htmlDecode,
  capitalize,
  date,
  number,
  parseQueryString
} from './Format';

describe('format utils', () => {
  it('ellipsis', () => {
    expect(ellipsis('出现省略号吧，是不是', 12)).toBe('出现省略号吧...');
  });

  it('lowercase', () => {
    expect(lowercase('to LowerCase')).toBe('to lowercase');
  });

  it('string uppercase', () => {
    expect(uppercase('to uppercase')).toBe('TO UPPERCASE');
  });

  it('file size', () => {
    expect(fileSize(1023)).toBe('1023 bytes');
    expect(fileSize(1024)).toBe('1 KB');
    expect(fileSize(1024 * 1024)).toBe('1 MB');
  });

  it('date', () => {
    const data = new Date('1985-03-04 12:12:12');
    expect(date(data, 'yyyy-MM-dd HH:mm:ss')).toBe('1985-03-04 12:12:12');
  });

  it('number', () => {
    expect(number('1000', '0.00')).toBe('1000.00');
  });

  it('htmlEncode', () => {
    expect(htmlEncode('<div><span>Kelly</span> Harber</div>')).toBe(
      '&lt;div&gt;&lt;span&gt;Kelly&lt;/span&gt; Harber&lt;/div&gt;'
    );
  });

  it('htmlDecode', () => {
    expect(htmlDecode('&lt;div&gt;&lt;span&gt;Kelly&lt;/span&gt; Harber&lt;/div&gt;')).toBe(
      '<div><span>Kelly</span> Harber</div>'
    );
  });

  it('capitalize', () => {
    expect(capitalize('Alivia Rapid')).toBe('Alivia rapid');
  });

  it('parseQueryString', () => {
    expect(parseQueryString('?name=Jayce&adrees=Kiehnton')).toEqual({ adrees: 'Kiehnton', name: 'Jayce' });
  });
});
