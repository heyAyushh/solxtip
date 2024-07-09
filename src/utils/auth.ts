
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import type { NextAuthOptions } from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        // @ts-ignore
        token.id = profile?.id
      }
      return token
    },
    async session({ session, token, user }) {
      const prisma =  new PrismaClient()
      session.accessToken = token.accessToken
      session.user.id = token.id || token.sub as string

      let dbuser = null;
      if (session?.user?.id) {
        dbuser = await prisma.user.findUnique({
          where: {
            id: session.user.id,
          },
        });
      }

      if (!dbuser) {
        const response = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,description,location,url,username', {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        })
        const data = await response.json()
        let username = data.data.username.toLowerCase();
        session.user.twitterProfile = data.data

        dbuser = await prisma.user.create({
            data: {
              username: username,
              id: session.user.id,
              verified: true,
            },
        });

        session.user.image = data.data.profile_image_url;
      }

      session.user.id = dbuser.id;
      return {...session}
    },
  },
};

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions)
}
