import { Schema, model } from 'mongoose';

const checkpointSchema = new Schema({
    farmId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Farm'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});

checkpointSchema.index({ location: '2dsphere' });

const Checkpoint = model('Checkpoint', checkpointSchema);

export default Checkpoint;