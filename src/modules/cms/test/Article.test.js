import Renderer from '../../../testHelpers/Renderer';
import Routes from '../../../testHelpers/Routes';

describe('User UI works', () => {
  const renderer = new Renderer(
    {},
    {
      currentUser: {
        id: '1',
        nickName: '系统管理员 - 1',
        profile: { name: null, mobile: '15900422486', __typename: 'LoginProfile' },
        roles: ['admin'],
        token: {
          accessToken: '7/c88249923c98f18fa2576a821e0d7e24',
          refreshToken: '7/f07edce024056cf0a3359463ec99654d',
          tokenCreationTime: 1507201688000,
          reExpiresIn: 1800,
          expiresIn: 120,
          __typename: 'Token'
        },
        __typename: 'LoginUser'
      }
    }
  );
  let app;
  let content;

  it('User page renders on mount', () => {
    app = renderer.mount(Routes);
    renderer.history.push('/articles');
    content = app.find('.page-content');
    console.log(content.children(), content, content.find('menuTree').length);
    expect(content.exists());
  });
});
