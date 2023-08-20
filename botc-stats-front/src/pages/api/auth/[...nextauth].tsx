import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// const useSecureCookies = false;
// const cookiePrefix = useSecureCookies ? "__Secure-" : "";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_ID!,
      clientSecret: process.env.DISCORD_SECRET!,
      authorization: {
        // url: "https://discord.com/api/users/@me/guilds/765137571608920074/member",
        params: { scope: "identify guilds.members.read" },
      },
      issuer: process.env.NEXTAUTH_URL,
      // checks: ["none"],
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, account }: { token: any; account: any }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
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
      // const tbaServerId = 765137571608920074;
      // const url = `https://discord.com/api/users/@me/guilds/${tbaServerId}/member`;

      // const response = await fetch(url, {
      //   method: "GET",
      // });

      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
    // async redirect({ url, baseUrl }: any) {
    //   return baseUrl;
    // },
  },
  // debug: true,

  // cookies: {
  //   pkceCodeVerifier: {
  //     name: `${cookiePrefix}next-auth.pkce.code_verifier`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: useSecureCookies,
  //       maxAge: 900,
  //     },
  //   },
  //   state: {
  //     name: `${cookiePrefix}next-auth.state`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: useSecureCookies,
  //       maxAge: 900,
  //     },
  //   },
  // },
});
