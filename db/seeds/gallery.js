
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('gallery').del()
    .then(function () {
      // Inserts seed entries
      return knex('gallery').insert([
        { author: 'Skier', link: 'https://i.pinimg.com/originals/7c/16/4f/7c164fe71cd986490145c57beb3f30cb.jpg', description: 'Winter Cabin' },
        { author: 'Stiman', link: 'http://www.fantasticnorway.no/wp-content/uploads/2011/10/Stimen8.jpg', description: 'Stimen' },
        { author: 'Hakon', link: 'https://4.bp.blogspot.com/-_59-VanQuZ4/Ts5_yBgtkeI/AAAAAAAAL3U/tx7N762YNDw/s1600/Fantastic+Norway+Architects+.+Mountain+Hill+Cabin+.+%25C3%2585l.jpg', description: 'Mountain Hill Cabin' },
        { author: 'Ole Wroldsen', link: 'http://www.fantasticnorway.no/wp-content/uploads/2011/10/Sirene@21.jpg', description: 'Sirene Luxurious' }
      ]);
    });
};
