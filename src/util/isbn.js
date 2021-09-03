'use strict';

const ISBN = {};

/**
 * ISBNのチェックサム確認
 * @type {boolean}
 * @param {string} isbn 確認対象のISBN
 */ 
ISBN.isJustifiable = (isbn)=>{
  if(typeof isbn !== 'string') return false;
  if(isbn.length === 13){
    // モジュラス10・ウェイト3-1
    const sum = isbn.slice(0,12).split('').reduce((a,c,i) => a+parseInt(c)*(i%2===0?1 : 3),0);

    return ((10 - sum%10)%10 === parseInt(isbn[12]));
  }else if(isbn.length === 10){
    // モジュラス11・ウェイト10-2
    const sum = isbn.slice(0,9).split('').reduce((a,c,i) => a+parseInt(c)*(10-i),0);
    const calc = (11 - sum%11)%11;

    return (calc === 10 && isbn[9]==='X') || (calc === parseInt(isbn[9]));
  }else{
    return false;
  }
};   



module.exports = Object.freeze(ISBN);