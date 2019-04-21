import fetch from 'node-fetch';
import nock from 'nock';

const scope = nock('https://github.com/')
  .get('/')
  .reply(200, 'domain matched');

fetch('https://github.com/')
  .then(res => res.text())
  .then(body => console.log(body));
