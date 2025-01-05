import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { name: string };
    const userName = decoded.name;

    // Use userName in your API logic
    res.status(200).json({ message: `Hello, ${userName}!` });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}
