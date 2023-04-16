import { verifyPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import NextAuth, { Awaitable, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// NextAuth() executes and returns a handler function
export default NextAuth({
  // object used to configure NextAuth's behaviour
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      authorize: async (credentials) => {
        console.log("credentials= ", credentials);

        const client = await connectToDatabase();

        const usersCollection = client.db().collection("users");

        const user = await usersCollection.findOne({
          email: credentials!.email,
        });

        if (!user) {
          // no user with the entered email
          client.close();
          throw new Error("No user found!");
        }
        console.log("user= ", user);

        // found a user with that email address, check for password
        const isValid = await verifyPassword(
          credentials!.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Invalid password! Try again!");
        }

        client.close();

        // authorization succeeded
        // return object that is encoded for JWT token
        return { email: user.email } as Awaitable<User>;
      },
      credentials: {
        email: {},
        password: {},
      },
    }),
  ],
});
