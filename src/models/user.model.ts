import { Schema, model, Document } from 'mongoose';
import { UserRole } from '../types/enums';

export interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    phone?: string;
    role: UserRole;
    farmIds: Schema.Types.ObjectId[];
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String },
    role: {
        type: String,
        required: true,
        enum: Object.values(UserRole),
        default: UserRole.FARMER,
    },
    farmIds: [{ type: Schema.Types.ObjectId, ref: 'Farm' }],
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
}, {
    timestamps: true,
});

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = model<IUser>('User', userSchema);

export default User;