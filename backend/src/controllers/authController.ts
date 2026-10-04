import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';
import { demoStore } from '../utils/demoStore.js';
import { isMongoConnected } from '../config/database.js';

function signToken(user: { id: string; email: string; name: string }) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, env.jwtSecret, { expiresIn: '7d' });
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError('Name, email, and password are required', 400);
    }

    if (isMongoConnected) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) throw new AppError('User already exists', 409);

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email: email.toLowerCase(), passwordHash });

      res.status(201).json({
        user: { id: String(user._id), name: user.name, email: user.email },
        token: signToken({ id: String(user._id), email: user.email, name: user.name }),
      });
      return;
    }

    const existing = demoStore.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
    if (existing) throw new AppError('User already exists', 409);

    const passwordHash = await bcrypt.hash(password, 10);
    const id = `demo-user-${Date.now()}`;
    demoStore.users.push({ id, name, email: email.toLowerCase(), passwordHash, createdAt: new Date().toISOString() });

    res.status(201).json({
      user: { id, name, email: email.toLowerCase() },
      token: signToken({ id, email: email.toLowerCase(), name }),
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    if (isMongoConnected) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) throw new AppError('Invalid credentials', 401);

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) throw new AppError('Invalid credentials', 401);

      res.json({
        user: { id: String(user._id), name: user.name, email: user.email },
        token: signToken({ id: String(user._id), email: user.email, name: user.name }),
      });
      return;
    }

    const user = demoStore.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new AppError('Invalid credentials', 401);

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError('Invalid credentials', 401);

    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token: signToken({ id: user.id, email: user.email, name: user.name }),
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError('User not found', 404);

    if (isMongoConnected) {
      const user = await User.findById(userId).select('-passwordHash');
      if (!user) throw new AppError('User not found', 404);
      res.json({ user: { id: String(user._id), name: user.name, email: user.email } });
      return;
    }

    const user = demoStore.users.find((item) => item.id === userId);
    if (!user) throw new AppError('User not found', 404);

    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    next(error);
  }
}
