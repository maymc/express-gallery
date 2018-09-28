//Route object that we can route our objects into
const express = require('express');
const Router = express.Router();
knex = require('../knex/knex.js');

//render out a "new photo" form
Router.get('/gallery/new', (req, res) => {
  console.log("IM HEREEEE");
  res.render("new");
});

//render out gallery picture details
Router.get('/gallery/:id', (req, res) => {
  console.log("\nThis is GET /gallery/:id");
  const { id } = req.params;
  knex.raw(`SELECT * FROM gallery WHERE id = ${id}`)
    .then(results => {
      const galleryPhoto = results.rows[0];
      console.log("\nGET photo results:", galleryPhoto);
      res.render('galleryPhoto', galleryPhoto);
    })
    .catch(err => {
      console.log('error', err);
    })
});

//render out get gallery home route
Router.get('/', (req, res) => {
  knex.raw('SELECT * FROM gallery')
    .then(results => {
      console.log("results.rows:\n", results.rows);
      const galleryItems = results.rows;
      console.log("\ngallery:", galleryItems);

      res.render('home', { galleryItems });
    })
});

// POST - Create a new gallery photo
Router.post('/gallery', (req, res) => {
  console.log("\nreq.body:", req.body);
  const gallery = req.body;
  console.log("\ngallery:", gallery);

  knex.raw(`INSERT INTO gallery (author, link, description) VALUES ('${gallery.author}', '${gallery.link}', '${gallery.description}')`)
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      console.log('POST - adding photo error', err)
    })
});

// //render out gallery edit get form
// Router.get('/gallery/:id/edit', (req, res) => {
//   const { id } = req.params;
//   knex.raw(`SELECT * FROM gallery WHERE id = '${id}'`)
//     .then(result => {
//       const galleryToEdit = result.rows[0];
//       res.render('edit', { galleryToEdit });
//     })
// });

// //edit gallery put
// Router.put('/gallery/:id', (req, res) => {
//   const { id } = req.params;
//   knex.raw(`UPDATE gallery SET author = '${req.body.author}', link = '${req.body.link}', description = ${req.body.description} WHERE id = ${id}`)
//     .then(result => {
//       res.redirect(`/${id}`);
//     })
//     .catch(err => {
//       console.log('error', err)
//     });
// });

// //delete gallery picture
// Router.delete('/gallery/:id', (req, res) => {
//   const { id } = req.params;
//   knex.raw(`DELETE FROM articles WHERE id = '${id}'`)
//     .then(result => {
//       res.redirect('/');
//     })
//     .catch(err => {
//       console.log('error, err');
//       res.redirect('/');
//     })
// });

module.exports = Router;