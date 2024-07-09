import ProfilePage from '../components/profile';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { auth } from '@/utils/auth';
import validate from '@/utils/validatePublicKey';

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect('/');
  }

  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      card: true,
    },
  });
  if (!user) {
    redirect('/');
  }

  let publicKey = user.publicKey;
  const existingCard = user?.card;
  if (!existingCard) {
    await prisma.card.create({
      data: {
        title: 'Tip me on solana!',
        image: session.user.image as string,
        userId: session.user.id,
        coinId: 'default',
      },
    });
  }

  if (publicKey && !validate(publicKey)) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        publicKey: null,
      },
    });
  }

  return (
      <ProfilePage
        session={session}
        user={user}
        card={existingCard}
        publicKey={publicKey}
      />
  );
}
