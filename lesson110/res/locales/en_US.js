import ens from 'react-intl/locale-data/en';

const en = ens.find(x => x.locale === 'en');

export default {
  ...en,

  'COMMON.HELLO': 'Hello',
  'COMMON.NAME': 'Name',
  'COMMON.PSWD': 'Password',
  'COMMON.LOGIN': 'Regist/Login',
  'COMMON.WELCOME': 'Welcome',
  'COMMON.LOGOUT': 'Logout',
};
