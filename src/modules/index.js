import Feature from './connector';

import cms from './cms';
import user from './user';

import main from './../containers/MainContainer';

export default new Feature(user, main, cms);
