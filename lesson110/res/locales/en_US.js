import ens from 'react-intl/locale-data/en';

const en = ens.find(x => x.locale === 'en');

export default {
  ...en,

  'COMMON.HELLO': 'Hello',
};
