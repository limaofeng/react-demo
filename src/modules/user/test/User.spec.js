import Renderer from '../../../testHelpers/Renderer';
import Routes from '../../../testHelpers/Routes';

describe('User UI works', () => {
  const renderer = new Renderer({});
  let app;
  let content;

  it('User page renders on mount', () => {
    app = renderer.mount(Routes);
    renderer.history.push('/login');
    content = app.find('#root');
    expect(content.exists());
  });
});
