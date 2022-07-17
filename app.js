const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const campground = require('./routes/campground')
const review = require('./routes/review')
const session = require('express-session')
const flash = require('connect-flash')

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
app.use(express.static(path.join( __dirname ,'public')))


const sessionConfig = {
    secret : 'iloveyousimran' , 
    resave : false , 
    saveUninitialized : true  , 
    cookie : {
        httpOnly : true  ,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7 ,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use((req ,res, next)=>{
   res.locals.success =  req.flash('success')
   res.locals.error = req.flash('error')
   next()
})

app.use('/campgrounds' , campground)
app.use('/campgrounds/:id/reviews' , review)

app.get('/' , (req ,res)=>{
    res.render('home')
})



app.all('*' , (req ,res ,next)=>{
    next(new ExpressError('Page not found' , 404))
})

app.use((err , req , res , next)=>{
    const {statusCode = 500  } = err
    if(!err.message) err.message = 'Oh No, Something Went Wrong!!'
    res.status(statusCode).render('error' , {err})
})


app.listen(3000 , ()=>{
    console.log('Serving on port 3000');
})