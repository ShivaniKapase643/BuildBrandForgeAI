import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';
import { demoStore } from '../utils/demoStore.js';
import { isMongoConnected } from '../config/database.js';
import User from '../models/User.js';

export type AuthRequest = Request & { user?: { id: string; email: string; name: string } };

export function protect(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as { id: string; email: string; name: string };
    req.user = decoded;
    return next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
}

export async function loadUserFromToken(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return next();

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret) as { id: string; email: string; name: string };

    if (isMongoConnected) {
      const user = await User.findById(decoded.id).lean();
      if (user) req.user = { id: String(user._id), email: user.email, name: user.name };
      return next();
    }

    const demoUser = demoStore.users.find((user) => user.id === decoded.id);
    if (demoUser) {
      req.user = { id: demoUser.id, email: demoUser.email, name: demoUser.name };
    }
    return next();
  } catch (error) {
    return next();
  }
}
