# Collect Tips from X using Solana Actions and Blinks

## Introduction
Use twitter auth and DB to store username with respective publicKeys. Use Solana actions to get the publicKeys and Blinks to get the tips.
- Dynamically generate OG image to fill in action
- Dynamic catch all route action for all users

## Steps
1. Create a new app on [Twitter Developer](https://developer.twitter.com/en/apps)
2. fill .env file with the keys in [`.env.example`](./.env.example)
3. Run `pnpm dev`
