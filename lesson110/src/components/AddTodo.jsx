import React from 'react';
import { injectIntl } from 'react-intl';

const AddTodo = ({ intl, addTodo }) => {
  let $el = null;
  return (
    <div>
      <input type="text" ref={el => ($el = el)} />
      <button onClick={() => $el.value.length > 0 && addTodo($el.value) && ($el.value = '')}>
        {intl.formatMessage({ id: 'COMMON.ADD' })}
      </button>
    </div>
  );
};

export default injectIntl(AddTodo);
