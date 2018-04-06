import zhs from 'react-intl/locale-data/zh';

const zh = zhs.find(x => x.locale === 'zh');

export default {
  ...zh,

  'COMMON.HELLO': '你好',
  'COMMON.APPNAME': '代办事项',
  'COMMON.NAME': '用户名',
  'COMMON.PSWD': '密码',
  'COMMON.LOGIN': '登陆/注册',
  'COMMON.WELCOME': '欢迎',
  'COMMON.LOGOUT': '注销',
  'COMMON.ADD': '新增',
  'COMMON.DONE': '完成',
  'COMMON.USER': '用户',
  'COMMON.CONTENT': '内容',
  'COMMON.OPERATE': '操作',
  'COMMON.UNDONE': '未完成',
  'COMMON.HOME': '主页',

  'INFO.EMPTY': '用户名或密码为空',
  'INFO.NOTMATCH': '用户名密码不匹配',
};
