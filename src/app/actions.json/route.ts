import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";
import { NextResponse } from "next/server";

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/actions/**",
        apiPath: "/actions/**",
      },
    ],
  };

  return NextResponse.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;
