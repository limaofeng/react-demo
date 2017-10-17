import React from 'react';
import { mount } from 'enzyme';
import { TreeItem } from './TreeSidebar';

describe('TreeSidebar tests', () => {
  it('TreeItem title should be Todos', () => {
    const app = mount(<TreeItem title="Marquardt, Schmitt and Schmitt" layer={2} />);
    expect(app.find('.item-title').text()).toBe('Marquardt, Schmitt and Schmitt');
  });
});
