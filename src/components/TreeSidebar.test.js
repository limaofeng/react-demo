import React from 'react';
import { mount } from 'enzyme';

import { TreeItem } from './TreeSidebar';

describe('Enzyme Shallow', () => {
  it('TreeItem title should be Todos', () => {
    const app = mount(<TreeItem title="第二级" layer={2} />);
    expect(app.find('.item-title').text()).to.equal('第二级');
  });
  /*
  it("App's title should be Todos", () => {
    const app = mount(
      <Tree>
        <TreeItemGroup title="第一级" layer={1}>
          <TreeItem title="第二级" layer={2} />
        </TreeItemGroup>
      </Tree>
    );
    expect(app.find('.item-title').text()).to.equal('Todos');
  }); */
});
