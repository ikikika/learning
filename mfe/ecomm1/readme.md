# Module Feredation

## Implementing Module Federation

1. Designate one app as the host and one as the remote
   - host: CONTAINER
   - remote: PRODUCTS
2. In the remote, decide which modules (files) you want to make available to other projects
3. Set up Module Federation plugin to expose those files
4. In the host, decide which files you want to get from the remote
   - products/src/index.js
5. Set up Module Federation plugin to fetch those files
6. In the host, refactor the entry point to load asynchronously
7. In the host, import whatever files yuou need from the remote

## Shared Modules

- If MF detected that different version of package used, it will load up both version
- If we cannot have multiple version of package in our project (eg. react), we need to set it to singleton true
  - If we use singlton rules with conflicting versions, MFE will throw a warning in the container saying there are incopmpatible versions of package
  - Teams have to debug and decide if 1 should upgrade or another one should downgrade

## Take note

- DO not name the module with the same name as the div id, else there will be a clash in the browser
