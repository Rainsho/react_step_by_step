import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// import 'babel-polyfill';

global.performance = {
  now: () => Date.now(),
};
configure({ adapter: new Adapter() });
