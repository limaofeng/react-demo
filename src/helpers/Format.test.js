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
  it('test ellipsis', () => {
    expect(ellipsis('出现省略号吧，是不是', 12)).toBe('出现省略号吧...');
  });

  it('test lowercase', () => {
    expect(lowercase('to LowerCase')).toBe('to lowercase');
  });

  it('test uppercase', () => {
    expect(uppercase('to uppercase')).toBe('TO UPPERCASE');
  });

  it('test fileSize', () => {
    expect(fileSize(1023)).toBe('1023 bytes');
    expect(fileSize(1024)).toBe('1 KB');
    expect(fileSize(1024 * 1024)).toBe('1 MB');
  });

  it('test format date', () => {
    const data = new Date('1985-03-04 12:12:12');
    expect(date(data, 'yyyy-MM-dd HH:mm:ss')).toBe('1985-03-04 12:12:12');
  });

  it('test format number', () => {
    expect(number('1000', '0.00')).toBe('1000.00');
  });

  it('test string htmlEncode', () => {
    expect(htmlEncode('<div><span>Kelly</span> Harber</div>')).toBe(
      '&lt;div&gt;&lt;span&gt;Kelly&lt;/span&gt; Harber&lt;/div&gt;'
    );
  });

  it('test string htmlDecode', () => {
    expect(htmlDecode('&lt;div&gt;&lt;span&gt;Kelly&lt;/span&gt; Harber&lt;/div&gt;')).toBe(
      '<div><span>Kelly</span> Harber</div>'
    );
  });

  it('test string capitalize', () => {
    expect(capitalize('Alivia Rapid')).toBe('Alivia rapid');
  });

  it('test url parseQueryString', () => {
    expect(parseQueryString('?name=Jayce&adrees=Kiehnton')).toEqual({ adrees: 'Kiehnton', name: 'Jayce' });
  });
});
