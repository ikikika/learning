# Page pre-rendering

Request

-> /some-route

-> Return pre-rendered page

-> Hydrate with react code once loaded

-> Page/App is interactive

## 2 forms of prerendering

### A. Static generation

- all the pages are pre-generated in advance during build time.

### B. Server-side rendering

- pages are created just in time after deployment when a request reaches the server.

Both techniques can be mixed

## A. Static Generation

- Data and pages are prepared during build time when you build your application before you deploy it.
- Once you deploy them, they can be cached by the server, by the CDN that might be serving your app.
- Therefore, incoming requests can be served instantly with those pre-built pages.
- Pages which are sent to your clients, are not empty initially but pre populated with content.
- How do we tell Next.js
  - that a certain page should be pre-generated?
  - which data is needed to pre-generate a page?
- There is a specific async function which we can export from inside our page components
  - `export async function getStaticProps(context) {...}`
  - in this function, you can run any code that would normally run on the server side only.
  - don't run the client side code,
  - don't have access to certain client side API,
  - don't have access to the window object, for example,
  - code that you write inside of this getStaticProps function, will not be included in the code bundle that's sent back to your clients.

### Incremental Static Generation

-> Pre-generate page
-> Re-generate it on every request, OR re-generate every X seconds and serve it

### getStaticProps

- Tells nextjs that we want to prerender this page in advance
- If route is dynamic and has getStaticProps, we need a way to tell nextjs how many pages are required to be generated
  - Use `getStaticPaths` for this

## B. Server-side rendering

- getStaticProps and getStaticPaths have no access to the actual request
  - they are called when the apge is built
- Sometimes, we need to pre-render for every request OR need access to request object (eg, for cookies)
- Nextjs allows us to run real SSR code as well
- Code that runs on the server only, after deployemnt and re-executed for every incoming request

### getServerSideProps

- `export async function getServerSideProps(context) {...}`
- **CANNOT USE WITH `getStaticProps`**. Must choose one.
- `context` object in argument contains `params`, `req`, `res`
  - can write server side code to manipulate object and get back an appripriate response
  - has access to headers if we wanted to
  - getting access to these data can be important if
  - eg need special header or cookie data
- Dun need req or res specific data, but want to ensure that function runs for every incoming request so taht its never static pre-generated (eg user profile pages)
- Difference with `getStaticProps`
  - has context object
  - revalidate timing
  - cannot use `getStaticPaths`

## Client-side data fetching

- Some data dun need to be prerendered
  - data changing with high frequency (eg stock data)
  - highly user specific data (eg orders in an online shop)
  - Partial data (eg dashboard data)
- "Traditional" client side data fetching (useEffect with fetch) is fine
