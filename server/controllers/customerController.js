const Customer = require('../models/Customer');
const mongoose = require('mongoose');

/**
 * Get /
 * Homepage
 */

exports.homepage = async (req, res) => {

    const messages = await req.flash("info");
  
    const locals = {
      title: "NodeJs",
      description: "NodeJs User Management System",
    };
  
    let perPage = 12;
    let page = req.query.page || 1;
  
    try {
      const customers = await Customer.aggregate([{ $sort: { createdAt: -1 } }])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

      const count = await Customer.countDocuments({});
  
      res.render("index", {
        locals,
        customers,
        current: page,
        pages: Math.ceil(count / perPage),
        messages,
      });
    } catch (error) {
      console.log(error);
    }
  };


// exports.homePage = async (req, res) => {
    
//     const messages = await req.flash("info");
    
//     const locals = {
//         title: 'NodeJs',
//         description: 'Free NodeJs User Management System'
//     }

//     try {
//             const customers = await Customer.find({}).limit(22);
//             res.render('index', { locals, messages, customers } );
//         } catch (error) {       
//             console.log(error);
//         }
// }

/**
 * Get /
 * New customer form
 */

exports.addCustomer = async (req, res) => {
    
    const locals = {
        title: 'Add New Customer - NodeJs',
        description: 'NodeJs User Management System'
    }
    
    res.render('customer/add', locals);

};

/**
 * POST /
 * Create new customer 
 */

exports.postCustomer = async (req, res) => {
    
    console.log(req.body);

    const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        details: req.body.details,
        tel: req.body.tel,
        email: req.body.email
    });
    
    try {
        await Customer.create(newCustomer);
        await req.flash('info', 'New customer has been added');
        res.redirect('/');

    } catch(error) {
        console.log(error);
    }

};

/**
 * Get /
 * Customer Data 
 */

exports.view = async (req, res) => {
    
  try {
    const customer = await Customer.findOne({ _id: req.params.id });

    const locals = {
      title: 'View Customer Data',
      description: 'NodeJs User Management System'
    };

    res.render('customer/view', {
      locals, customer
    })
  } catch (error) {
    console.log(error);
  }

};

/**
 * Get /
 * Edit Customer Data 
 */

exports.edit = async (req, res) => {
    
  try {
    const customer = await Customer.findOne({ _id: req.params.id });

    const locals = {
      title: 'Edit Customer Data',
      description: 'NodeJs User Management System'
    };

    res.render('customer/edit', {
      locals, customer
    })
  } catch (error) {
    console.log(error);
  }

};

/**
 * GET /
 * Update Customer Data
 */
exports.editPost = async (req, res) => {
  try {
    await Customer.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      tel: req.body.tel,
      email: req.body.email,
      details: req.body.details,
      updatedAt: Date.now(),
    });
    await res.redirect(`/edit/${req.params.id}`);

    console.log("redirected");
  } catch (error) {
    console.log(error);
  }
};