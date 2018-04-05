import React from 'react';

export default ({ value, checked, onChange }) => (
  <span>
    <input type="radio" name="locale" value={value} checked={checked} onChange={onChange} />
    <label>{value}</label>
  </span>
);
