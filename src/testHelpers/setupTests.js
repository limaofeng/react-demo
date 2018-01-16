import ReactEnzymeAdapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { JSDOM } from 'jsdom';

const exposedProperties = ['window', 'navigator', 'document'];

const jsdom = new JSDOM('<!doctype html><html><body><div id="root"><div></body></html>');
global.window = jsdom.window;
global.document = jsdom.document;
Object.keys(jsdom.window).forEach(property => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = jsdom.window[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

Enzyme.configure({ adapter: new ReactEnzymeAdapter() });
