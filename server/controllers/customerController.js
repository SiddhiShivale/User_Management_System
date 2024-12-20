const Customer = require('../models/Customer');
const mongoose = require('mongoose');

/**
 * Get /
 * Homepage
 */

exports.homePage = async (req, res) => {
    
    const messages = await req.flash("info");
    
    const locals = {
        title: 'NodeJs',
        description: 'Free NodeJs User Management System'
    }

    try {
            const customers = await Customer.find({}).limit(22);
            res.render('index', { locals, messages, customers } );
        } catch (error) {       
            console.log(error);
        }
}

/**
 * Get /
 * New customer form
 */

exports.addCustomer = async (req, res) => {
    
    const locals = {
        title: 'Add New Customer - NodeJs',
        description: 'Free NodeJs User Management System'
    }
    
    res.render('customer/add', locals);

}

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

}