import React from 'react';
import { shallow } from 'enzyme';
import Dump from './Dump';

const wrapper = shallow(<Dump name="world" />);

describe('Enzyme Shallow', () => {
  it("Component's title should be hello", () => {
    expect(wrapper.hasClass('header')).toBe(true);
    expect(wrapper.find('h1').text()).toBe('Hello world');
  });

  it('button should be able to click', () => {
    const button = wrapper.find('button');

    expect(wrapper.find('p').text()).toBe('1');
    button.simulate('click');
    expect(wrapper.find('p').text()).toBe('2');

    expect(wrapper.instance().state).toEqual({ count: 2 });
  });
});
