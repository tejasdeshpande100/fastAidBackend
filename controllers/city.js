const City = require('../models/city');

exports.addCity = (req, res, next) => {
  const city = new City(req.body);
  city
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'City added successfully',
        addedCity: {
          name: result.name,
          _id: result._id
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

exports.getCities = (req, res, next) => {
  City.find()
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        cities: docs.map(doc => {
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

// exports.addCities = (req, res, next) => {
//   const citiesArray = [`Mumbai`, 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', `Kolkata`, `Surat`, `Pune`, `Jaipur`, `Lucknow`, `Kanpur`, `Nagpur`, `Indore`, `Thane`, `Bhopal`, `Visakhapatnam`, `Pimpri & Chinchwad`, `Patna`, `Vadodara`, `Ghaziabad`, `Ludhiana`, `Agra`, `Nashik`, `Faridabad`, `Meerut`, `Rajkot`, `Kalyan & Dombivali`, `Vasai Virar`, `Varanasi`, `Srinagar`, `Aurangabad`, `Dhanbad`, `Amritsar`, `Navi Mumbai`, `Allahabad`, `Ranchi`, `Haora`, `Coimbatore`, `Jabalpur`, `Gwalior`, `Vijayawada`, `Jodhpur`, `Madurai`, `Raipur`, `Kota`, `Guwahati`, `Chandigarh`, `Solapur`, `Hubli and Dharwad`, `Bareilly`, `Moradabad`, `Karnataka`, `Gurgaon`, `Aligarh`, `Jalandhar`, `Tiruchirappalli`, `Bhubaneswar`, `Salem`, `Mira and Bhayander`, `Thiruvananthapuram`, `Bhiwandi`, `Saharanpur`, `Gorakhpur`, `Guntur`, `Bikaner`, `Amravati`, `Noida`, `Jamshedpur`, `Bhilai Nagar`, `Warangal`, `Cuttack`, `Firozabad`, `Kochi`, `Bhavnagar`, `Dehradun`, `Durgapur`, `Asansol`, `Nanded Waghala`, `Kolapur`, `Ajmer`, `Gulbarga`, `Jamnagar`, `Ujjain`, `Loni`, `Siliguri`, `Jhansi`, `Ulhasnagar`, `Nellore`, `Jammu`, `Sangli Miraj Kupwad`, `Belgaum`, `Mangalore`, `Ambattur`, `Tirunelveli`, `Malegoan`, `Gaya`, `Jalgaon`, `Udaipur`, `Maheshtala`];
//   const cityObjects = [];
//   citiesArray.forEach(city => cityObjects.push({ name: city }));
//   City.insertMany(cityObjects, function (error, docs) {
//     if (error) console.log(error);
//     else console.log(docs);
//   });
// };
