import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string
    user: {
      id: string
      twitterProfile?: TwitterProfile
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    id: string
  }
}

interface TwitterProfile {
  id: string
  name: string
  username: string
  profile_image_url: string
  description?: string
  location?: string
  url?: string
}
