const bookshelf = require('./bookshelf.js');

const Users = bookshelf.Model.extend({
  tableName: 'users',
})

module.exports = Users;