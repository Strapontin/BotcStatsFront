import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_ID!,
      clientSecret: process.env.DISCORD_SECRET!,
      authorization: {
        // url: "https://discord.com/api/users/@me/guilds/765137571608920074/member",
        params: { scope: "guilds.members.read" },
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, account }: { token: any; account: any }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      // console.log("jwt");
      // console.log(token);
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
      const tbaServerId = 765137571608920074;
      const url = `https://discord.com/api/users/@me/guilds/${tbaServerId}/member`;

      const response = await fetch(url, {
        method: "GET",
      });

      // console.log("session");
      // console.log(response);
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);
