import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// We define the NextAuth configuration here
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
          // 1. Call your custom backend login API
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

          // If login fails on the backend (e.g., bad credentials), throw an error
          if (!res.ok) {
            const errorData = await res.json();
            console.error("Backend login failed:", errorData);
            // Throwing an Error here is critical for NextAuth to show the CredentialsSignin error
            throw new Error(errorData.message || "Invalid credentials"); 
          }

          // 2. Extract the JWT token from the backend response
          const data = await res.json();
          const token = data.token;

          if (token) {
            // CRITICAL FIX: The object returned here must represent the authenticated user.
            // We use the token itself as a temporary 'user' identifier for the JWT callback.
            // The JWT callback (below) will handle decoding the token into session data.
            return {
              id: token, // Using the token as a temporary 'id'
            };
          } else {
            return null; // Return null if authentication fails
          }
        } catch (error) {
          console.error("Authorization error:", error.message);
          return null; // Return null on any fetch or processing error
        }
      },
    }),
    // Assuming you have a Google Provider configured here:
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
  ],
  
  // --- CALLBACKS ---
  callbacks: {
    // 1. JWT Callback: This runs after authorize() and encodes data into the token.
    async jwt({ token, user }) {
      if (user) {
        // 'user' here is the object returned by authorize(): { id: token_string }
        token.accessToken = user.id; // Store the JWT string as accessToken
      }
      return token;
    },

    // 2. Session Callback: This runs before sending the session data to the client.
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      
      // CRITICAL FIX: Decode the JWT to extract user details (name, email, id).
      // This is necessary because NextAuth doesn't automatically decode custom JWTs.
      if (token.accessToken) {
        const decoded = JSON.parse(Buffer.from(token.accessToken.split('.')[1], 'base64').toString());
        
        session.user.id = decoded.id;
        session.user.email = decoded.email;
        session.user.name = decoded.name; // Use the name from the JWT payload!
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