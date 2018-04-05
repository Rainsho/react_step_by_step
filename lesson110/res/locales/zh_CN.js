import zhs from 'react-intl/locale-data/zh';

const zh = zhs.find(x => x.locale === 'zh');

export default {
  ...zh,

  'COMMON.HELLO': '你好',
};
