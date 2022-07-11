const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const catchAsync = require('./utils/catchAsync')
const Campground = require('./models/campground')
const ExpressError = require('./utils/ExpressError')

mongoose.connect('mongodb+srv://yash_047:yash_047@cluster0.ix5el.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    console.log('Conntection Open');
}).catch((err)=>{
    console.log('Error');
    console.log(err);
})

app.engine('ejs' , ejsMate )
app.set('view engine' , 'ejs')
app.set('views' , path.join(__dirname , 'views'))
app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))

app.get('/' , (req ,res)=>{
    res.render('home')
})


app.get('/campgrounds' , async (req ,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index' , {campgrounds})
})

app.get('/campgrounds/new' , (req ,res)=>{
    res.render('campgrounds/new')
})

app.post('/campgrounds' ,catchAsync( async (req ,res , next)=>{
   
    if(!req.body.campground) throw new ExpressError('Please fill the data' , 400)
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
   
}))

app.get('/campgrounds/:id' , async(req ,res)=>{
    console.log(req.params.id);
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show' , {campground})
})

app.get('/campgrounds/:id/edit' , async (req ,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit' , {campground})
})

app.put('/campgrounds/:id' , catchAsync(async (req ,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id ,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/makecampground' , async (req ,res)=>{
    const camp = new Campground({title : "My Backyard" , description : "cheap camping!" })
    await camp.save()
    res.send(camp)
})

app.delete('/campgrounds/:id' ,catchAsync(async(req ,res)=>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

app.all('*' , (req ,res ,next)=>{
    next(new ExpressError('Page not found' , 404))
})

app.use((err , req , res , next)=>{
    const {statusCode = 500  , message = 'Something went very wrong!!'} = err
    res.status(statusCode).render('error' , {err})
})


app.listen(3000 , ()=>{
    console.log('Serving on port 3000');
})