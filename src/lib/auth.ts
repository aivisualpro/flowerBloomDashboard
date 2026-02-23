import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

export function verifyCustomerToken(req: NextRequest): AuthPayload | null {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as AuthPayload;
    return decoded;
  } catch {
    return null;
  }
}
