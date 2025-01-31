import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { name: string };
    return res.status(200).json({ 
      message: 'Authenticated',
      userName: decoded.name
    });
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
