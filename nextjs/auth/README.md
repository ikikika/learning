# Auth

## NextAuth

- helps with authenticating users
- helps with finding out whether a user has that permission by managing that token creation and storage, both parts behind the scenes.

## NextAuth catch all route

- catch all `[...nextauth].ts`
- next auth package behind the scenes will expose multiple routes for user login and for user logout, for example.
- https://next-auth.js.org/getting-started/rest-api

- NextAuth will create cookie with jwt token on signIn
- will clear cookies on signOut
