const port = 4000;
const express = require("express");
const path = require('path');
const ejs = require('ejs');
const url = require('url');
const app = express();
// const ejs = require('ejs');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');


//data base connectionie mongodb
require('./db/connection')


const public_path = path.join(__dirname, '../public')
app.use(express.static(public_path + '/css'))
app.use(express.static(public_path + '/js'))



//dynamiclly pass data using ejs
let html_path = path.join(__dirname, '../template/views/pages')
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', html_path);

//body parser initialization
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

//sighup section

app.get('/', (req, res) => {

   res.render('signup', { error: '' });

})
app.get('/home', (req, res) => {

   var urls = req.url

   console.log(urls);
   res.render('dashboard', { admin_id: urls });
   const db = mongoose.connection;

})
app.get('/redirecter', (req, res) => {
   res.render('redirecter.html');

})

app.post('/home', function (req, res) {

   const name = req.body.username;
   const email = req.body.email;
   const password = req.body.password;
   const phone = req.body.phone;

   const data = {
      "name": name,
      "email": email,
      "password": password,
      "phone": phone
   }
   //unique email
   const db = mongoose.connection;

   db.collection('user').find({ "email": email }).toArray((err, result) => {
      if (result.length == 0) {

         //insert data to mongodb

         db.collection('user').insertOne(data, (err, result) => {
            if (err) throw err;
            console.log("Record inserted Successfully");
            const id = result.insertedId;
            const redirect = `/home?${id}`
            // console.log(redirect);
            // return res.status(200).render('home.html',{admin_id:id});
            res.redirect(redirect)

         });
      }
      else {
         res.render('signup', { error: 'email alredy exist' });
         console.log('email alredy exist');
      }
   })
})



//------------------------------------------------------------------------------------------

//login
app.get('/login', function (req, res) {
   return res.render('login', { error: '' });
})
app.post('/home-login', function (req, res) {
   const email = req.body.email;
   const password = req.body.password;
   const phone = req.body.phone;

   const data = {
      "email": email,
      // "phone": phone
   }


   //fetch data from the database
   const db = mongoose.connection;
   db.collection('user').find(data).toArray((err, result) => {
      if (result.length === 0) {
         // res.send("email not exist")
         return res.render('login', { error: ' email not exist  ' });

      }

      //login succefully
      else if (result[0].email === email && result[0].password === password) {
         //to genarate user id and push to home page url
         const db = mongoose.connection;
         db.collection('user').find({ email: email }).toArray((err, data2) => {
            const url_path = `/home?${data2[0]._id}`
            res.redirect(url_path)
            console.log(data2[0]._id);
         })
      }
      //possword is wrong
      else if (result[0].email === email && result[0].password !== password) {
         return res.render('login', { error: 'password wrong' });


      }

   });
});





// app.get('/dashboard', (req, res) => {
//    console.log("hello world")
//    return res.render('dashboard', { msg: '',admin_id:'' });
// })



//activity

app.get('/activity', (req, res) => {
   const db = mongoose.connection;
   const queryObject = url.parse(req.url, true).query;
   const user_id = queryObject.userid
   console.log(user_id);
   db.collection('donor_request').find({ user_id: user_id }).toArray((err, result1) => {
      db.collection('patient_request').find({ user_id: user_id }).toArray((err, result2) => {
         db.collection('add_donor').find({ user_id: user_id }).toArray((err, result3) => {
            db.collection('reciver').find({ user_id: user_id }).toArray((err, result4) => {
               db.collection('cancel').find({ user_id: user_id }).toArray((err, result5) => {
                  res.render('activity', { data: result1, data2: result2, data3: result3, data4: result4, data5: result5 });
               })
            })
         })
      })
   })
})
app.get('/redirecter2', (req, res) => {
   res.render('redirecter2.html');

})


///add donor
app.get('/add_donor', (req, res) => {

   const queryObject = url.parse(req.url, true).query;
   const id = queryObject.program_id;

   // console.log(id.length);
   console.log(id.length);
   if (id.length === 0) {
      res.render('donation_form', { msg: '', program_location: '' });


   }
   else {
      var ObjectId = require('mongodb').ObjectId;
      const program_id = new ObjectId(id);
      const db = mongoose.connection;

      db.collection('programs').find({ _id: program_id }).toArray((err, result) => {
         res.render('donation_form', { msg: '', program_location: result[0].program_location });
         console.log(result);
      })
   }






})
app.post('/add_donors', function (req, res) {


   const db = mongoose.connection;

   const admin_id = req.body.admin_id;
   const user_id = req.body.user_id;
   const name = req.body.d_name;
   const dob = req.body.d_dob;
   const adhar_no = req.body.adhar_no;
   const phone = req.body.d_phone;
   const country = req.body.d_country;
   const state = req.body.d_state;
   const district = req.body.d_district;
   const taluk = req.body.d_taluk;
   const pincode = req.body.d_pincode
   const address = req.body.d_address;
   const blood_type = req.body.d_blood_type;
   const blood_unit = req.body.d_blood_unit;
   const hospital = req.body.hospital;
   const status = req.body.status;
   const old_donation_date = req.body.old_blood_doanate_date;
   const date = new Date();
   const today_date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`

   const add_donor_data = {
      "user_id": user_id,
      "admin_id": admin_id,
      "donor_name": name,
      "date_of_birth": dob,
      "applyed_date": today_date,
      "adhar_no": adhar_no,
      "phone": phone,
      "country": country,
      "state": state,
      "district": district,
      "taluk": taluk,
      "pincode": pincode,
      "address": address,
      "blood_type": blood_type,
      "unit_of_blood": blood_unit,
      'hospital': hospital,
      "old_donation_date": old_donation_date,
      "status": status,
      'donation_date': '---'

   }

   db.collection('donor_request').insertOne(add_donor_data, (err, result) => {

      if (err) throw err;
      console.log(result);
      return res.redirect(`/activity?userid=${user_id}`);

   });
})


//patient request
app.get('/request_form', (req, res) => {
   return res.render('request_form', { msg: '' });

})

app.post('/request_form', (req, res) => {

   const db = mongoose.connection;

   // console.log(req.body.d_name);
   const user_id = req.body.user_id;
   const admin_id = req.body.admin_id;

   const name = req.body.p_name;
   const dob = req.body.p_dob;
   const adhar_no = req.body.p_adhar_no;
   const phone = req.body.p_phone;
   const country = req.body.p_country;
   const state = req.body.p_state;
   const district = req.body.p_district;
   const taluk = req.body.p_taluk;
   const pincode = req.body.p_pincode
   const address = req.body.p_address;
   const hospital = req.body.hospital;
   const disease = req.body.disease;
   const blood_type = req.body.p_blood_type;
   const status = req.body.status;

   const recived_blood_unit = req.body.recived_blood_unit;
   const date = new Date();
   const today_date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`




   const reciver_data = {
      "admin_id": admin_id,
      "user_id": user_id,
      "donor_name": name,
      "applyed_date": today_date,
      "date_of_birth": dob,
      "adhar_no": adhar_no,
      "phone": phone,
      "country": country,
      "state": state,
      "district": district,
      "taluk": taluk,
      "pincode": pincode,
      "address": address,
      "blood_type": blood_type,
      'hospital': hospital,
      'disease': disease,
      "unit_of_blood": recived_blood_unit,
      "status": status,
      'donation_date': '---'

   }

   db.collection('patient_request').insertOne(reciver_data, (err, collection) => {
      if (err) throw err;
      return res.redirect(`/activity?userid=${user_id}`);
   });
})


//search by blood groop
app.get('/search_by_blood_group', (req, res) => {

   res.render('search_by_blood', { msg: "" });

})

app.get(`/search_by_blood_details`, (req, res) => {
   const queryObject = url.parse(req.url, true).query;
   enterd_blood_group = queryObject.d_blood_type

   const admin_id = queryObject.a_id
   const db = mongoose.connection;

   db.collection('donor_request').find({ blood_type: enterd_blood_group }).toArray((err, result) => {
      // console.log(result.length);
      if (result.length !== 0) {
         res.render('search_by_blood_details', { data: result });

      } else {
         // res.send("record not found")
         res.render('search_by_blood', { msg: "record not found" });

      }

   })
})
//search by location

app.get('/search_by_location', (req, res) => {
   const db = mongoose.connection;

   res.render('search_by_location', { msg: "" });

})
app.get(`/search_by_location_details`, (req, res) => {
   // const db = mongoose.connection;
   const queryObject = url.parse(req.url, true).query;
   // console.log(queryObject._id);
   enterd_location = queryObject.d_pincode
   const admin_id = queryObject.a_id
   console.log(enterd_location);
   const db = mongoose.connection;

   db.collection('donor_request').find({ pincode: enterd_location }).toArray((err, result) => {
      console.log(result);
      if (result.length !== 0) {
         res.render('search_by_location_details', { data: result });

      } else {

         // res.send("record not found")
         res.render('search_by_location', { msg: 'record not found' });


      }

   })
})



//stocks

app.get('/stocks', (req, res) => {

   const db = mongoose.connection;

   db.collection('reciver').find().toArray((err, result2) => {

      db.collection('add_donor').find().toArray((err, result) => {
         res.render('stocks', { data: result, data2: result2 });


      })
   })
});


//programs

app.get('/programs/list', (req, res) => {
   const db = mongoose.connection;

   db.collection('programs').find().toArray((err, result) => {
      res.render('programs', { data: result });


   })
})







app.listen(port, () => {
   console.log(`server listening at port ${port}`);
})
