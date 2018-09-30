//Route object that we can route our objects into
const express = require('express');
const Router = express.Router();
knex = require('../knex/knex.js');

//Provide access Users and Gallery object
const Users = require('../db/models/users_table.js');
const Gallery = require('../db/models/gallery_table.js');

//GET - render out a "new photo" form
Router.get('/gallery/new', (req, res) => {
  console.log("\n This is GET - /gallery/new");
  res.render("new");
});

//GET - render out gallery edit form
Router.get('/gallery/:id/edit', (req, res) => {
  console.log("\nThis is GET - /gallery/:id/edit");
  console.log("\nreq.params:", req.params);

  const { id } = req.params;
  knex.raw(`SELECT * FROM gallery WHERE id = '${id}'`)
    .then(result => {
      const photoToEdit = result.rows[0];
      console.log("photoToEdit:", photoToEdit);
      res.render('edit', photoToEdit);
    })
});

//GET - render out gallery picture details
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

//GET - render out get gallery home route
Router.get('/', (req, res) => {
  // knex.raw('SELECT * FROM gallery ORDER BY id ASC')
  //   .then(results => {
  //     console.log("results.rows:\n", results.rows);
  //     const featurePhoto = results.rows[0];
  //     const galleryItems = results.rows;
  //     galleryItems.shift();
  //     console.log("\ngallery:", galleryItems);

  //     res.render('home', { featurePhoto, galleryItems });
  //   })
  Gallery
    .forge()
    .orderBy('id', 'ASC')
    .fetchAll()
    .then(results => {
      // console.log("\nresults:", results);
      // const featurePhoto = results[0].toJSON();
      // const galleryItems = results.toJSON();
      // galleryItems.shift();
      // console.log("\nfeaturePhoto:", featurePhoto);
      // console.log("\ngalleryItems:", galleryItems);

      let galleryItems = results.toJSON();
      console.log("\ngalleryItems:", galleryItems);
      console.log("\ngalleryItems[0]:", galleryItems[0]);
      // galleryItems.shift();
      // console.log("\ngalleryItems:", galleryItems);
      res.render('home', { galleryItems });
    })
    .catch(err => {

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

//PUT - edit gallery photo
Router.put('/gallery/:id', (req, res) => {
  console.log("This is PUT /gallery/:id");
  console.log("\nPUT - req.params:", req.params);
  console.log("\nPUT - req.body:", req.body);

  const { id } = req.params;

  knex.raw(`UPDATE gallery SET author = '${req.body.author}', link = '${req.body.link}', description = '${req.body.description}' WHERE id = ${id}`)
    .then(() => {
      res.redirect(`/gallery/${id}`);
    })
    .catch(err => {
      console.log('error', err)
    });
});

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