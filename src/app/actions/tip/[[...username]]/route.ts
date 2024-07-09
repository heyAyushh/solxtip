/**
 * Solana Actions Example
 */
import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from '@solana/actions';
import {
  Authorized,
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  StakeProgram,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { NextResponse as Response } from 'next/server';
import { PrismaClient } from '@prisma/client';
import validate from '@/utils/validatePublicKey';

const prisma = new PrismaClient();

export const GET = async (
  req: Request,
  { params }: { params: { username: string } }
) => {
  const username = params.username[0].toLowerCase();

  try {
    const requestUrl = new URL(req.url);
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return new Response('User not found', {
        status: 404,
        headers: ACTIONS_CORS_HEADERS,
      });
    } else if (!user.publicKey) {
      return new Response('User does not have a public key', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    } else if (!validate(user.publicKey)) {
      return new Response('User does not have an account', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const baseHref = new URL(
      `/actions/tip/${username}`,
      requestUrl.origin
    ).toString();

    const payload: ActionGetResponse = {
      title: `Tip SOL to ${username}`,
      icon: new URL(`${requestUrl.origin}/api/og/${username}`).toString(),
      description: `${username} is recieiving tips in SOL. You can tip them by clicking the buttons below.`,
      label: 'Transfer', // this value will be ignored since `links.actions` exists
      links: {
        actions: [
          {
            label: 'Send 0.1 SOL', // button text
            href: `${baseHref}?amount=${'0.1'}`,
          },
          {
            label: 'Send 0.5 SOL', // button text
            href: `${baseHref}?amount=${'0.5'}`,
          },
          {
            label: 'Send 1 SOL', // button text
            href: `${baseHref}?amount=${'1'}`,
          },
          {
            label: 'Send SOL', // button text
            href: `${baseHref}?amount={amount}`, // this href will have a text input
            parameters: [
              {
                name: 'amount', // parameter name in the `href` above
                label: 'Enter the amount of SOL to send', // placeholder of the text input
                required: true,
              },
            ],
          },
        ],
      },
    };

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = 'An unknown error occurred';
    if (typeof err == 'string') message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;

export const POST = async (
  req: Request,
  { params }: { params: { username: string } }
) => {
  try {
    const requestUrl = new URL(req.url);
    const username = params.username[0].toLowerCase();
    const { toPubkey, amount } = await validatedUser(requestUrl, username);

    const body: ActionPostRequest = await req.json();

    // validate the client provided input
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const connection = new Connection(
      process.env.SOLANA_RPC! || clusterApiUrl('devnet')
    );

    // ensure the receiving account will be rent exempt
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0 // note: simple accounts that just store native SOL have `0` bytes of data
    );
    if (amount * LAMPORTS_PER_SOL < minimumBalance) {
      throw `account may not be rent exempt: ${toPubkey.toBase58()}`;
    }

    const transaction = new Transaction();
    transaction.feePayer = account;

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: toPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    // set the end user as the fee payer
    transaction.feePayer = account;

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Send ${amount} SOL to ${toPubkey.toBase58()}`,
      },
      // note: no additional signers are needed
      // signers: [],
    });

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = 'An unknown error occurred';
    if (typeof err == 'string') message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

async function validatedUser(requestUrl: URL, username: string) {
  let amount: number = 1;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw 'User not found';
  } else if (!user.publicKey) {
    throw 'User does not have a public key';
  } else if (!validate(user.publicKey)) {
    throw 'User does not have have a valid public key';
  }

  let toPubkey: PublicKey = new PublicKey(user.publicKey);

  try {
    if (requestUrl.searchParams.get('amount')) {
      amount = parseFloat(requestUrl.searchParams.get('amount')!);
    }

    if (amount <= 0) throw 'amount is too small';
  } catch (err) {
    throw 'Invalid input query parameter: amount';
  }

  return {
    toPubkey,
    amount,
  };
}
