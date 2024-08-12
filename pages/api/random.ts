import { NextApiRequest, NextApiResponse } from 'next';

import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const movieCount = await prismadb.movie.count();
    const randomIndex = Math.floor(Math.random() * movieCount);

    const randomMovies = await prismadb.movie.findMany({
      take: 1,
      skip: randomIndex,
    });

    if (randomMovies.length === 0) {
      return res.status(404).json({ message: 'No movies found' });
    }

    return res.status(200).json(randomMovies[0]);
  } catch (error) {
    console.log('Database error:', error);
    return res.status(500).end();
  }
}
