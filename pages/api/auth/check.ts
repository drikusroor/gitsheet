import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ message: 'Authenticated' });
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
