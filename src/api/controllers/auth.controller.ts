import { Request, Response } from 'express';
import User from '../../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import appConfig from '../../config/app';
import { logInfo } from '../../utils/logger';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, phone, role } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] }).exec();
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            role: role || 'farmer',
        });
        const saved = await user.save();
        logInfo(`User registered: ${saved._id}`);

        const token = jwt.sign(
            { id: saved._id, role: saved.role },
            appConfig.jwtSecret,
            { expiresIn: appConfig.jwtExpiration as any }
        );

        return res.status(201).json({
            user: { id: saved._id, username: saved.username, email: saved.email, role: saved.role },
            token,
        });
    } catch (err: any) {
        return res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).exec();
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            appConfig.jwtSecret,
            { expiresIn: appConfig.jwtExpiration as any }
        );

        return res.status(200).json({
            user: { id: user._id, username: user.username, email: user.email, role: user.role },
            token,
        });
    } catch (err: any) {
        return res.status(500).json({ message: 'Login failed', error: err.message });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const user = await User.findById(userId).select('-password').exec();
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json(user);
    } catch (err: any) {
        return res.status(500).json({ message: 'Error fetching profile', error: err.message });
    }
};