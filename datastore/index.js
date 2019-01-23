const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    items[id] = text;
    fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, err => {
      if (err) {
        console.log(err);
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      var items = _.map(files, (text) => {
        var id = text.split('.')[0];
        text = id;
        return {id, text};
      });
      callback(null, items);
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, id + '.txt'), 'utf8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      var text = data;
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  this.readAll((err, files) => {
    for (var file of files) {
      if (file.id === id) {
        fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, err => {
          if (err) {
            callback(err);
          } else {
            callback(null, { id, text });
          }
        });
        break;
      } else {
        callback(new Error(`No item with id: ${id}`));
      }
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, id + '.txt'), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
