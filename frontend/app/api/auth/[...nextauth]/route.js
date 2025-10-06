import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        try {
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            console.error("Backend login failed:", errorData);
            throw new Error(errorData.message || "Invalid credentials");
          }

          const data = await res.json();
          const token = data.token;

          if (token) {
            return { id: token };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Authorization error:", error.message);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;

      if (session.accessToken) {
        try {
          const decoded = JSON.parse(Buffer.from(token.accessToken.split('.')[1], 'base64').toString());
          session.user.id = decoded.id;
          session.user.email = decoded.email;
          session.user.name = decoded.name;
        } catch (e) {
          console.warn("Could not decode custom JWT. Assuming token is standard NextAuth JWT.");
          session.user.id = token.sub;
          session.user.email = token.email;
          session.user.name = token.name;
        }
      } else {
        session.user.id = token.sub;
        session.user.email = token.email;
        session.user.name = token.name;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
