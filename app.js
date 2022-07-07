const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')

mongoose.connect('mongodb+srv://yash_047:yash_047@cluster0.ix5el.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    console.log('Conntection Open');
}).catch((err)=>{
    console.log('Error');
    console.log(err);
})

app.set('view engine' , 'ejs')
app.set('views' , path.join(__dirname , 'views'))

app.get('/' , (req ,res)=>{
    res.render('home')
})



app.get('/makecampground' , async (req ,res)=>{
    const camp = new Campground({title : "My Backyard" , description : "cheap camping!" })
    await camp.save()
    res.send(camp)
})

app.listen(3000 , ()=>{
    console.log('Serving on port 3000');
})