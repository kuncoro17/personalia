// import { verify } from 'jsonwebtoken';
// import { MiddlewareHandler } from 'hono';

// export const authMiddleware: MiddlewareHandler = async (c, next) => {
//   const authHeader = c.req.header('authorization');

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return c.json({ error: 'Unauthorized' }, 401);
//   }

//   const token = authHeader.replace('Bearer ', '');
//   try {
//     const publicKey = process.env.CLERK_JWT_KEY?.replace(
//       /\\n/g,
//       '\n'
//     ) as string;
//     const payload = verify(token, publicKey, { algorithms: ['RS256'] });
//     c.set('user', payload);
//     await next();
//   } catch {
//     // err tidak digunakan, jadi kosong
//     return c.json({ error: 'Invalid token' }, 401);
//   }
// };

// src/middlewares/auth.middlewares.ts
import jwt from 'jsonwebtoken';
import type { MiddlewareHandler } from 'hono';

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, message: 'User not authenticated' }, 401);
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const publicKey = process.env.CLERK_JWT_KEY?.replace(
      /\\n/g,
      '\n'
    ) as string;
    const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

    c.set('user', payload);
    await next();
  } catch {
    return c.json({ success: false, message: 'User not authenticated' }, 401);
  }
};
