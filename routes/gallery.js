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
  console.log("\nid:", id)

  Gallery
    .where('id', id)
    .fetch()
    .then(results => {
      console.log("results:", results.toJSON());
      const photoToEdit = results.toJSON();
      res.render('edit', photoToEdit);
    })
    .catch(err => {
      console.log("Error retrieving photoToEdit", err);
    })

});

//GET - render out gallery picture details
Router.get('/gallery/:id', (req, res) => {
  console.log("\nThis is GET /gallery/:id");
  console.log("req.params:", req.params);
  const { id } = req.params;
  console.log("id:", id);
  Gallery
    .where('id', id)
    .fetch()
    .then(results => {
      const galleryPhoto = results.toJSON();
      console.log("\nGET photo results:", galleryPhoto);
      res.render('galleryPhoto', galleryPhoto);
    })
    .catch(err => {
      console.log('error', err);
    })
});

//GET - render out get gallery home route
Router.get('/', (req, res) => {
  console.log("\nThis is GET /");
  Gallery
    .forge()
    .orderBy('id', 'ASC')
    .fetchAll()
    .then(results => {
      let galleryItems = results.toJSON();
      let featurePhoto = galleryItems[0];
      console.log("\ngalleryItems:", galleryItems);
      console.log("\nfeaturePhoto:", featurePhoto);
      galleryItems.shift();
      res.render('home', { featurePhoto, galleryItems });
    })
    .catch(err => {
      res.json("Error with getting gallery", err)
    });
});

// POST - Create a new gallery photo
Router.post('/gallery', (req, res) => {
  console.log("\nreq.body:", req.body);
  const gallery = req.body;
  console.log("\ngallery:", gallery);
  const newPhoto = {
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  }
  Gallery
    .forge(newPhoto)
    .save()
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

  const updatedPhoto = {
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  }

  Gallery
    .where('id', id)
    .fetch()
    .then(results => {
      console.log("results:", results);
      results.save(updatedPhoto);
      res.redirect(`/gallery/${id}`);
    })
    .catch(err => {
      console.log('error', err)
    });
});

//delete gallery picture
Router.delete('/gallery/:id', (req, res) => {
  const { id } = req.params;
  // knex.raw(`DELETE FROM gallery WHERE id = '${id}'`)
  //   .then(result => {
  //     res.redirect('/');
  //   })
  //   .catch(err => {
  //     console.log('error, err');
  //     res.redirect('/');
  //   })

  Gallery
    .where("id", id)
    .destroy()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      console.log('error, err');
      res.redirect('/');
    })

});

module.exports = Router;