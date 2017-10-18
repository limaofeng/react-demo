import ReactEnzymeAdapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { jsdom } from 'jsdom';

const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('<!doctype html><html><body><div id="root"><div></body></html>');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach(property => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
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
