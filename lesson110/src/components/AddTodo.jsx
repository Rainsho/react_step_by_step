import React from 'react';
import { injectIntl } from 'react-intl';

const AddTodo = ({ intl, addTodo, everySaga, latestSaga }) => {
  let $el = null;
  return (
    <div>
      <input
        type="text"
        ref={(el) => {
          $el = el;
        }}
      />
      <button
        onClick={() => {
          if ($el.value.length > 0) {
            addTodo($el.value);
            $el.value = '';
          }
        }}
      >
        {intl.formatMessage({ id: 'COMMON.ADD' })}
      </button>
      <button onClick={everySaga}>SAGA_ADD_EVERY</button>
      <button onClick={latestSaga}>SAGA_ADD_LATEST</button>
    </div>
  );
};

export default injectIntl(AddTodo);
