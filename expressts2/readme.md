## Issue with Type Definition Files

- can't accurately express whats going on in the JS world. 
    - eg, middleware
    - middleware can add on or remove properties 
    - TS is unable to determine
- provided files arent always accurate
- inputs to server (or any program with external inputs) are not guaranteed to exist or be of the correct type
    - eg in body-parser, 
    - `body` object is type `any`, but it may not exist and we dun want to use type `any`

- Addressing these issues with TS force us to write better code