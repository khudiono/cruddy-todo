const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = text => {
  return new Promise ((resolve, reject) => {
    counter.getNextUniqueId().then(id => {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, err => {
        if (err) {
          reject(err);
        } else {
          resolve({ id, text });
        }
      });
    });
  })
};

exports.readAll = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(exports.dataDir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        var items = _.map(files, text => {
          var id = text.split('.')[0];
          text = id;
          return {id, text};
        });
        resolve(items);
      }
    });
  });
};

exports.readOne = id => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(exports.dataDir, id + '.txt'), 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        var text = data;
        resolve({ id, text });
      }
    });
  });

};

exports.update = (id, text) => {
  return new Promise((resolve, reject) => {
    this.readAll().then(files => {
      for (var file of files) {
        if(file.id === id) {
          fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, err => {
            if(err) {
              reject(err);
            } else {
              resolve({ id, text });
            }
          });
          break;
        } else {
          reject(new Error(`No item with id: ${id}`))
        }
      }
    })
  })
};

exports.delete = id => {
  return new Promise((resolve, reject) => {
    fs.unlink(path.join(exports.dataDir, id + '.txt'), err => {
      if (err) {
        reject(new Error(`No item with id: ${id}`));
      } else {
        resolve();
      }
    });
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
