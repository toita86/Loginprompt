const { Router, response } = require("express")
const express = require("express")
const router = express.Router()
const User = require('../models/user')

//All User route
router.get('/',async (req,res)=>{
    let searchOption = {}
    //usiamo .query perche è un operazione di GET, post invece manda le cose da BODY
    if(req.query.name != null && req.query.name !== ''){
        searchOption.name = new RegExp(req.query.name, 'i')
    }
    try{
        const users = await User.find(searchOption)
        res.render('users/index', {
            users: users,
            searchOption: req.query
        })
    }catch{

        res.redirect('/')
    }
})

//New User Route
router.get('/new', (req, res)=>{
    res.render('users/new', {user: new User()})
})

//Create user route
router.post('/',async (req, res)=>{
    const user = new User({
        name: req.body.name
    })
    try{
        const newUser = await user.save()
        //res.redirect(`users/${newUser.id}`)
        res.redirect(`users`) 
    }catch{
        res.render('users/new', {
            user: user,
            errorMessage: 'Error creating user'
        })
    }
})

module.exports = router