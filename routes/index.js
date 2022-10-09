const express = require("express")
const user = require("../models/user")
const { db } = require("../models/user")
const router = express.Router()
const User = require('../models/user')

router.get('/', async (req,res)=>{
    try{
        const users = await User.aggregate([
            {"$unwind" : "$color"},
            {"$sortByCount" : "$color"},
            {"$limit" : 1}
        ])
        var colorStr = Object.values(JSON.parse(JSON.stringify(users)))
        res.render('index',{
            color: colorStr[0]._id
        })
    }catch{

        res.redirect('/')
    }
})

module.exports = router