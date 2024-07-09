import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/utils/auth';
import { PrismaClient } from '@prisma/client';

async function handler(req: NextRequest) {
  const res = NextResponse;
  const prisma = new PrismaClient();
  const session = await auth();
  const { publicKey } = await req.json();

  if (!session) {
    return res.json(
      {
        error:
          'You must be signed in to view the protected content on this page.',
      },
      { status: 401 }
    );
  }
  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { publicKey },
    });

    return res.json(updatedUser, { status: 200 });
  } catch (error) {
    return res.json(
      {
        error: 'Failed to update user.',
      },
      { status: 500 }
    );
  }
}

export { handler as POST };
