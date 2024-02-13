import NextAuth, { AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_ID!,
      clientSecret: process.env.DISCORD_SECRET!,
      authorization: {
        params: { scope: "identify email guilds guilds.members.read" },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }: any) {
      // Save the access token, refresh token & IDs in the JWT on the initial login
      if (account) {
        if (profile) {
          token.discordId = profile.id;
        }
        token.id = user.id;
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_at = Math.floor(Date.now() / 1000 + account.expires_at);
      }

      // If the refresh token is valid, return the token as is
      if (Date.now() < token.expires_at * 1000) {
        return token;
      }
      console.log("INVALIDREFRESH TOKEN", token, token.expires_at);

      // If the refresh token is expired, refresh it
      try {
        const response = await fetch(`https://discord.com/api/oauth2/token`, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.DISCORD_ID!,
            client_secret: process.env.DISCORD_SECRET!,
            grant_type: "refresh_token",
            refresh_token: token.refreshToken,
          }),
          method: "POST",
        });

        const new_token = await response.json();

        if (!response.ok) throw new_token;
        return {
          ...token, // Keep the previous token properties
          accessToken: new_token.access_token,
          expiresAt: Math.floor(Date.now() / 1000 + new_token.expires_in),
          refreshToken: new_token.refresh_token as string,
        };
      } catch (error) {
        console.error("Error refreshing access token:", error);
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },
    async session({ session, token, user }: any) {
      // If you want to forward the user id to the client, you can do so here:
      // session.user.id = token.id
      // Send properties to the client.
      session.error = token.error;
      session.user.discordId = token.discordId;
      session.accessToken = token.access_token;

      return session;
    },
  },
};

export default NextAuth(authOptions);
