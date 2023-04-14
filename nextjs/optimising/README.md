# Optimising NextJs App

1. Add Meta and `<Head>` tags
2. Reusing components, logic and configuration
3. Optimising images

## `<Head>` tag

If we need Head element to be common to all files, can add in `_app.tsx`.
If there are same tags, the latest one will win.

## `_document.tsx`

- `_app.tsx` is your application shell, the root component inside of the body section of your HTML document.
- `_document.tsx` allows you to customisation of the entire HTML document.
- All elements that make up an HTML document, can add to the `_document.tsx` file.
- Only import `{ Html, Head, Main, NextScript }` from `next/document`, not `next/Head`
- Allows us to add HTML content outside of component tree
