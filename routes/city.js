var express = require('express');
var router = express.Router();

const { getCities, addCity, addCities } = require('../controllers/city');

// router.get('/city/addCities', addCities);
router.post('/city/addCity', addCity);
router.get('/city/getCities', getCities);

module.exports = router;
