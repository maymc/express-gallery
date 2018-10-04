const bookshelf = require('./bookshelf.js');

const Gallery = bookshelf.Model.extend({
  tableName: 'gallery'
})

module.exports = Gallery;