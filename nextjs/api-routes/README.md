# API Routing

- APIs has to be in `src/pages/api`
- Route would be `http://localhost:3000/api/[folder]/[file]`
  - eg. `http://localhost:3000/api/hello`
- API route files dun export component
- Should export a `handler` function as default
- Dun have to send back HTML code.
- Can execute any server side code of our choice
  - Any code we write in here will never end up on any client side code bundle

## Handler

- Takes in 2 arguments `req` and `res`

```
function handler(req, res)
```

- `res` can chain on `status` method and `json` method to send back `json` data as part of response

```
function handler(req, res){
    res.status(200).json({ message: "it works" });
}
```

## getStaticProps

- SHOULD NOT USE FETCH TO TALK TO OUR OWN API

## Dynamic API routs

- can also name `[...apiRoute].ts` to catch more query parameters
  - `/api/something1/something2`
