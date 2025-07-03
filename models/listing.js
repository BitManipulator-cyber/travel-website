const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

// main().catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/test');
// }

const listingSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            //default: "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg",
            set: (v) => v === " " ? "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg" : v,
        }
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    review: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});

listingSchema.post("findOneAndDelete" , async(listing)=>{
    if(listing)
    {
        await Review.deleteMany({_id: {$in: listing.review}});
    }
})

const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;