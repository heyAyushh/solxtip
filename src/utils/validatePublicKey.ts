import { PublicKey } from '@solana/web3.js';

const validate = (value: string | PublicKey) => {
  try {
    value = new PublicKey(value as string);
    return PublicKey;
  } catch (error) {
    return false;
  }
};

export default validate;
