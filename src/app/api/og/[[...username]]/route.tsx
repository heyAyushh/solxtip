import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import SolanaLogo from '../../../components/SolanaLogo';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import { FaXTwitter } from 'react-icons/fa6';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username[0].toLowerCase();

    if (!username) {
      return new Response('Username is required', { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        card: true,
      },
    });

    if (!user || !user.publicKey) {
      return new Response('User not found', { status: 404 });
    } else if (!user.card) {
      return new Response('User card not found', { status: 404 });
    }

    const dbPublicKey = user.publicKey;

    return new ImageResponse(
      (
        <div tw="flex flex-col w-full h-full bg-black text-white">
          <div
            tw="w-full h-1"
            style={{ background: 'linear-gradient(90deg, #9945FF, #14F195)' }}
          />

          <div tw="flex flex-col items-center justify-between p-8 flex-grow">
            <div tw="flex w-full justify-between items-center">
              <div tw="flex w-12 h-12">
                <SolanaLogo w={'30'} h={'30'} />
              </div>
              <div tw="flex text-md">solxtip</div>
              <div tw="flex rounded-full h-12 w-12">
                <FaXTwitter className="flex" size={30} />
              </div>
            </div>

            <div tw="text-7xl text-center my-8 italic ">Buy me a coffee ☕️</div>

            <div tw="flex w-full items-center justify-between">
              <div tw="flex rounded-full p-3 m-4 text-wrap border-2 border-[#323232]">
                {dbPublicKey.slice(0, 6)}...{dbPublicKey.slice(-6)}
              </div>
              <div tw="flex items-center p-2 m-4 rounded-full border-2 border-[#323232]">
                <span className='flex rounded-full'>
                  <img
                    src={user.card.image}
                    alt="User Image"
                    tw="rounded-full flex mr-2"
                    style={{ width: 30, height: 30 }}
                  />
                </span >
                <span>@{username}</span>
              </div>
            </div>
          </div>

          <div
            tw="w-full h-1"
            style={{ background: 'linear-gradient(90deg, #9945FF, #14F195)' }}
          />
        </div>
      ),
      {
        width: 600,
        height: 600,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
