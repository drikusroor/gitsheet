import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token, name } = req.body;

  if (token !== process.env.MAGIC_LOGIN_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Create JWT
  const jwtToken = jwt.sign(
    { name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Set JWT as HTTP-only cookie
  res.setHeader('Set-Cookie', serialize('auth_token', jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  }));

  res.status(200).json({ message: 'Logged in successfully' });
}
