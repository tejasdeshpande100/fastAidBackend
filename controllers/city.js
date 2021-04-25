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
// const citiesArray = [`Mumbai`, 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', `Kolkata`, `Surat`, `Pune`, `Jaipur`, `Lucknow`, `Kanpur`, `Nagpur`, `Indore`, `Thane`, `Bhopal`, `Visakhapatnam`, `Pimpri & Chinchwad`, `Patna`, `Vadodara`, `Ghaziabad`, `Ludhiana`, `Agra`, `Nashik`, `Faridabad`, `Meerut`, `Rajkot`, `Kalyan & Dombivali`, `Vasai Virar`, `Varanasi`, `Srinagar`, `Aurangabad`, `Dhanbad`, `Amritsar`, `Navi Mumbai`, `Allahabad`, `Ranchi`, `Haora`, `Coimbatore`, `Jabalpur`, `Gwalior`, `Vijayawada`, `Jodhpur`, `Madurai`, `Raipur`, `Kota`, `Guwahati`, `Chandigarh`, `Solapur`, `Hubli and Dharwad`, `Bareilly`, `Moradabad`, `Karnataka`, `Gurgaon`, `Aligarh`, `Jalandhar`, `Tiruchirappalli`, `Bhubaneswar`, `Salem`, `Mira and Bhayander`, `Thiruvananthapuram`, `Bhiwandi`, `Saharanpur`, `Gorakhpur`, `Guntur`, `Bikaner`, `Amravati`, `Noida`, `Jamshedpur`, `Bhilai Nagar`, `Warangal`, `Cuttack`, `Firozabad`, `Kochi`, `Bhavnagar`, `Dehradun`, `Durgapur`, `Asansol`, `Nanded Waghala`, `Kolapur`, `Ajmer`, `Gulbarga`, `Jamnagar`, `Ujjain`, `Loni`, `Siliguri`, `Jhansi`, `Ulhasnagar`, `Nellore`, `Jammu`, `Sangli Miraj Kupwad`, `Belgaum`, `Mangalore`, `Ambattur`, `Tirunelveli`, `Malegoan`, `Gaya`, `Jalgaon`, `Udaipur`, `Maheshtala`];
//   const citiesArray = ['Ongole', 'Tirupathi', 'Mangalagiri', 'Bilaspur', 'Raigarh', 'Durg', 'Dhamtari', 'Silvassa', 'New Delhi', 'Margao', 'Fatorda', 'Kalol', 'Baroda', 'Kadi', 'Patan', 'Vapi', 'Viramgam', 'Bilimora', 'Siddpur', 'Himatnagar', 'Bharuch', 'Junagadh', 'Surendranagar', 'Botad', 'Palanpur', 'Veraval', 'Nadiad', 'Bardoli', 'Dhanera', 'Idar', 'Anand', 'Gandhinagar', 'Vyara', 'Bhuj', 'Ambala', 'Hisar', 'Rohtak', 'Fatehabad', 'Kurukshetra', 'Gurugram', 'Ambala City', 'Hubli', 'Bijapur', 'Trivandrum', 'Ernakulam', 'Calicut', 'Thiruvalla', 'Attingal', 'Thrissur', 'Cochin', 'Kottayam', 'Dhar', 'Mandsaur', 'Dewas', 'Neemuch', 'Ratlam', 'Betul', 'Sagar', 'Shajapur', 'Vasai', 'Malad', 'Washim', 'Bhusawal', 'Aurngabad', 'Barshi', 'Yavatmal', 'Jalgaon', 'Aurangpura', 'Ahmednagar', 'Jalna', 'Malegaon', 'Latur', 'Sangamner', 'Akola', 'Baramati', 'Nanded', 'Kedgaon', 'Pimpri', 'Beed', 'Kamptee', 'Akluj', 'Wai', 'Panvel', 'Chinchwad', 'Andheri West', 'Kalyan', 'Byculla', 'Bhayander West', 'Dahisar (e)', 'Parali Vaijanath', 'Amgaon', 'Sangli', 'Buldhana', 'Kalamb', 'Lonavla', 'Satara', 'Miraj', 'Dhule', 'Bhandara', 'Pusad', 'Chandrapur', 'Wardha', 'Naigaon', 'Palaspe', 'Goregaon West', 'Udgir', 'Chiplun', 'Parbhani', 'Shirur', 'Manchar', 'Khamgaon', 'Omerga', 'Vashi', 'Nandurbar', 'Ratnagiri', 'Kolhapur', 'Sinner', 'Sanpada', 'Gondia', 'Ichalkaranji', 'Kharghar', 'Ahemednagar', 'Pandharpur', 'Nalasopara',  'Jharsuguda', 'Zirakpur', 'Moga', 'Patiala', 'Bathinda', 'Alwar', 'Tanjore', 'Aminijikarai', 'Dindigul', 'Nagercoil', 'Trihcy', 'Tiruvarur', 'Vellore', 'Secunderabad', 'Malkajgiri', 'Haldwani'];
//   const citiesArray = ['Punjabi Bagh', 'Tughlakabad', 'Narela', 'Jhajjar', 'Gurgaon, Haryana', 'Hapur'];
//   const citiesArray = ['Yawatmal', 'Jalana', 'Ambejogai'];
// const citiesArray = ['Papumpare', 'Bongaigaon', 'Sivsagar', 'Silchar', 'North Lakhimpur', 'Samaguri', 'Dhaligaon', 'Dibrugarh', 'Nawada', 'Chapra', 'Bhagalpur', 'Goa', 'Salcete', 'Ulhas Nagar', 'Gujarat', 'Modasa', 'Mehsana', 'Himat Nagar', 'Phone', 'Manesar', 'Panipat', 'Sonepat', 'Bawal', 'Yamuna Nagar', 'Mewat', 'Samba', 'Bokaro', 'Aluva', 'Bengaluru', 'Tumkur', 'Koppal', 'Bidadi', 'Whitefield', 'Shimoga', 'Ananthapur', 'Mangalore', 'Bellary', 'Mysore', 'Bangalore', 'Kadappa', 'Palakkad', 'Trichur', 'Rewa', 'Waidhan', 'Sholapur', 'Wada', 'Icchalkaranji', 'Tarapur', 'Meghalaya', 'Mizoram', 'Dimapur', 'Sambalpur dist', 'Derrabassi', 'Mohali', 'Rajpura', 'Sikar', 'Jhunjhunu', 'Krishnagiti', 'Kanchipuram', 'Tuticorin', 'Tuirrupur', 'Erode', 'Kanyakumari', 'Krishna', 'Pathanamthitta', 'Dindugal', 'Pondicherry', 'Trichy', 'Malappuram', 'Namakkal', "Coimbatore'", 'Krishnapuri', 'Theni', 'Tripura', 'Bulandshahr', 'Muzaffar Nagar', 'Azamgarh', 'Kharagpur'];
//   const citiesArray = ['Prakasam', 'Gir Somnath', 'Hazaribagh', 'Kovalur', 'Cochin', 'Calicut', 'Waidhan', 'Imphal', 'Shillong', 'Puducherry', 'Bathinda', 'Jadchelra', 'Agartala'];
//   const cityObjects = [];
//   citiesArray.forEach(city => cityObjects.push({ name: city }));
//   City.insertMany(cityObjects, function (error, docs) {
//     if (error) console.log(error);
//     else console.log(docs);
//   });
//   return res.send({ message: 'Cities Uploaded', cities: cityObjects });
// };
