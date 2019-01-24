const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');
var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = num => {
  return sprintf('%05d', num);
};

const readCounter = () => {
  return new Promise ((resolve, reject) => {
    fs.readFile(exports.counterFile, (err, fileData) => {
      if (err) {
        reject(err);
      } else {
        resolve(Number(fileData));
      }
    })
  })
};

const writeCounter = count => {
  return new Promise((resolve, reject) => {
    var counterString = zeroPaddedNumber(count);
    fs.writeFile(exports.counterFile, counterString, err => {
      if (err) {
        reject(err);
      } else {
        resolve(counterString);
      }
    });
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = () => {
  return new Promise((resolve, reject) => {
    readCounter().then(id => {
      id++;
      writeCounter(id).then((counterString) => {
        resolve(counterString);
      });
    });
  });
};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
