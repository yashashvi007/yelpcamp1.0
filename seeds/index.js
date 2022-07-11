const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {places , descriptors} = require('../seeds/seedHelper')

mongoose.connect('mongodb+srv://yash_047:yash_047@cluster0.ix5el.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    console.log('Conntection Open');
}).catch((err)=>{
    console.log('Error');
    console.log(err);
})

const sample = array => array[Math.floor(Math.random()*array.length)]

const seedDb = async ()=>{
    await Campground.deleteMany({})
    for(let i = 0;i<50;i++){
        const random100 = Math.floor(Math.random()*100)
        const price = Math.floor(Math.random() * 20)  + 10
        const camp =  new Campground({
            location : `${cities[random100].city} , ${cities[random100].state}` , 
            title : `${sample(descriptors)} ${sample(places)}` , 
            image : 'https://unsplash.com/photos/JocU2pEsN9Q' , 
            description : 'jasbdbsdbasjfbregyurdnvnkbjkafnkdasnfhsgdvwjnfjfbvmdn vbsjvasdvhafiawrbgvjafsn kdvdhiuvgafuivb ljduv vuiafe v' , 
            price : price
        })
        await camp.save()
    }
}

seedDb().then(()=>{
    mongoose.connection.close()
})