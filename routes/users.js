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
        name: req.body.name,
        color: req.body.color
    })

    try{
        const newUser = await user.save()
        res.redirect(`users/${newUser.id}`)
    }catch{
        res.render('users/new', {
            user: user,
            errorMessage: 'Error creating user'
        })
    }
})

//new route needs to stay on top because  otherwise will take 'new' as an id

//Show user page
router.get('/:id', async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
    
        res.render('users/show',{
            user: user,
            color: user.color
        })
    }catch{
        res.redirect('/')
    }
})

router.get('/:id/edit', async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        res.render('users/edit', {user: user})
    }
    catch{
        res.redirect('/users')
    }
})

//Update User
router.put('/:id', async (req,res)=>{
    let user
    try{
        user = await User.findById(req.params.id)
        user.name = req.body.name
        
        if(req.body.color !== "red" && 
        req.body.color !== "yellow" &&
        req.body.color !== "blue")
        {
            user.color = "red"
        }else
        {
            user.color = req.body.color
        }
        
        await user.save()
        res.redirect(`/users/${user.id}`)
    }catch{
        if(user == null){
            res.redirect(`/`)  
        }else{
            res.render('users/edit', {
                user: user,
                errorMessage: 'Error updating user'
            })
        }
    }
})

router.delete('/:id', async (req,res)=>{
    let user
    try{
        user = await User.findById(req.params.id)
        await user.remove()
        res.redirect('/users')
    }catch{
        if(user == null){
            res.redirect(`/`)  
        }else{
            req.redirect(`/users/${user.id}`)
        }
    }
})

module.exports = router