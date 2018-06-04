import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import 'rxjs-compat';

import epics from './epics';

const epicMiddleware = createEpicMiddleware(epics);
const mockStore = configureMockStore([epicMiddleware]);

describe('epics test', () => {
  let store;

  beforeEach(() => {
    store = mockStore();
  });

  afterEach(() => {
    epicMiddleware.replaceEpic(epics);
  });

  it('find count', async () => {
    store.dispatch({ type: 'FIND_COUNT' });

    await new Promise(res => setTimeout(res, 1000));

    expect(store.getActions()).toEqual([
      { type: 'FIND_COUNT' },
      { type: 'RECEIVE_COUNT', payload: 99 },
    ]);
  });
});
