import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'nookies';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { name, username } = req.body;

  const userExist = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (userExist) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  });

  setCookie({ res }, '@ignitecall:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return res.status(201).json(user);
}
