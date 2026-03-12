import { Schema, model } from 'mongoose';

const auctionSchema = new Schema({
    auctionId: {
        type: String,
        required: true,
        unique: true
    },
    auctionName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    livestockSold: [{
        type: Schema.Types.ObjectId,
        ref: 'Livestock'
    }],
    totalSales: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Auction = model('Auction', auctionSchema);

export default Auction;