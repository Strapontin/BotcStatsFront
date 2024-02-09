import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_ID!,
      clientSecret: process.env.DISCORD_SECRET!,
      authorization: {
        params: { scope: "guilds guilds.members.read email identify" },
      },
      // issuer: process.env.NEXTAUTH_URL,
      // checks: ["none"],
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, account }: { token: any; account: any }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;

        token = await refreshAccessToken(token);
        console.log("Account has data. New Token :", token);
      } else if (Date.now() > token.accessTokenExpires) {
        token = await refreshAccessToken(token);
        console.log("Token has expired. New Token :", token);
      }

      console.log("Normal Token :", token);
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: any;
      token: any;
      user: any;
    }) {
      // Send properties to the client, like an access_token from a provider.
      console.log("GetSession !", session);
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

async function refreshAccessToken(token: any) {
  const url = "https://discord.com/api/v10/oauth2/token";

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: new URLSearchParams({
      client_id: process.env.DISCORD_ID!,
      client_secret: process.env.DISCORD_SECRET!,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    }),
  });

  const refreshedTokens = await response.json();

  if (!response.ok) {
    throw refreshedTokens;
  }

  return {
    ...token,
    accessToken: refreshedTokens.access_token,
    accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
    refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
  };
}
