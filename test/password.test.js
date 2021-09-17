'use strict';

const {forbiddenPasswordChar} = require('../src/util/password');

const correctPassword = [
  'a-zA-Z0-9,.?_/-/+!"#$%&()=~^*//@;:<>{}[]',
  'hogefuga',
];
const inCorrectPassword = [
  'ひらがなだめ',
  'カタカナダメ',
  '漢字駄目',
];
  
describe('Passwordが正しい',()=>{
  
  test.each(correctPassword)('Password検証 %s', (a) => {
    expect(a.match(forbiddenPasswordChar)).toBeFalsy(); 
  });
  test.each(inCorrectPassword)('Password検証 %s', (a) => {
    expect(a.match(forbiddenPasswordChar)).toBeTruthy(); 
  });
  
});
