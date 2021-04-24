// Remdesivir, Plasma, Oxygen,  Masks, Sanitizers

const Category = require('../models/category');

exports.getCategories = (req, res, next) => {
  console.log('requested');
  Category.find()
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        categories: docs.map(doc => {
          return {
            name: doc.name,

            _id: doc._id
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.createCategory = (req, res, next) => {
  console.log(req.body);
  const { name } = req.body;

  const category = new Category({
    name
  });
  category
    .save()
    .then(result => {
      console.log(result);

      res.status(201).json({
        message: 'Category created Successfully',
        Category: {
          result
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
