
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('gallery').del()
    .then(function () {
      // Inserts seed entries
      return knex('gallery').insert([
        {author: 'JK Rowling', link: '', description: 'Harry Potter'},
        {author: 'Dr Seuss', link: '', description: 'Green Eggs and Ham'},
        {author: 'Eckhart Tolle', link: '', description: 'A New Earth'}
      ]);
    });
};
