# Project 2

## Requirements

### 1. Zero coupling between child projects

    - No importing of functions/objects/classes/etc
    - No shared state
    - Shared libraries through MF is ok

### 2. Near-zero coupling between container and child apps

    - Container shouldn't assume that a child is using a particular framework
    - Any necessary communication to be done with callbacks or simple events

### 3. CSS from one project shouldn't affect another

### 4. Version control ( monorepo vs separate ) shouldn't have any impact on the overall project

### 5. Container should be able to decide to always use the latest version of a microfrontend or specify a specific version

    - Container will always use the latest version of a child app ( without requiring redeployment of container )
    - Container can specify exactly what version of a child it wants to use ( requires redeployment of container to change )

## Navigation requirements

1. Both Container + Individual subapps need routing features

   - Users can navigate around to different subapps using routing logic built into the Container
   - Users can navigate aroung in a module using routing logic built into the module itself
   - Not all subapps require routing
   - Solution:
     - Container: react-router
     - marketing: react-router

2. Subapps might need to add in new pages/routes all the time

   - New routes added to a subapp shouldn't require a redeploy of the container
   - Solution:
     - Container's routing will be used to decide **which microfrontend** to show
     - Marketing router to decide **which page** to show
       | route | Subapp - Page |
       |------------|---------------------|
       | / | Marketing - Landing |
       | /pricing | Marketing - Pricing |
       | /auth | Auth |
       | /dashboard | Dashboard |

3. We might need to show 2 or more microfrontends at the same time

   - This will occur all the time if we have some kind of sidebar nav that is built as a separate microfrontend
   - Solution:
     - Container's routing will be used to decide **which microfrontend** to show
     - eg, `/` to show sidebar and Marketing+Pricing

4. We want to use off the shelf routing solutions

   - Dun want to build our own
   - Some amount of custom coding is ok

5. We need navigation features for subapps in bopth hostede mode and in isolation

   - Developing for each environment should be easy - a dev should immediately be able to see what path they are visiting

6. If different apps need to communicate information about routing, it should be done in as generic a fashion as possible
   - Each app might be using a completely different navigation framwework
   - We might swap out or upgrade navigation libraries all the time - shouldn't require a rewrite of the rest of the app

### How Routing Libraries Work

- Decide what content to show on the screen
- 2 parts
  - **History**: Object to get and set the current path the user is visiting
  - **Router**: SHows different content based on current path

### History

- **Browser History**: Look at path portion of URL (everything after domain) to figure out what the current path is
- Hash History: Look at everything after `#` in thje URL to figure out the current path
- **Memory or Abstract History**: Keey track of current path in memory
  - This is a history object that stores the current path that a user is visiting inside of memory (in a variable inside of your code)
  - No visual indication of what path a user is visiting
  - Not gonna use the address in the address bar in any way to figure out what the user is currently visiting inside of your app

### Setting up Navigation Mode for MF

- In MF, apps may be competing to set the route and conflict with each other
- Need a way of control
- Most common way
  - Container: Browser History
    - Marketing: Memory History
    - Auth: Memory History
- Container is the only history that will access the address bar and look at URL and eventually update it
- Subapps will have codes that sync history object

### Communication between Apps

- User clicks link governed by Container
  - Browser History
  - Communicate change **DOWN** to Marketing
  - Marketing's **Memory History** should update its current path
- User clicks link governed by Marketing
  - Memory History
  - Communicate change **UP** to Container
  - Container's **Browser History** should update its current path
- **COMMUNICATION ABOUT ROUTING BETWEEN CONTAINER AND SUBAPP SHOULD BE AS GENERIC AS POSSIBLE**

  - done with simple objects, simple events, simple callbacks
  - so that different routing libraries can interpret the information and act accordingly

- User clicks link in Marketing
  - Container shows marketing app
  - Container pass down callback function `onNavigate`
  - User clicks on link inside marketing app
  - Update Memory History's current path to `/pricing`
  - Call `onNavigate` to tell container that the current path has changed

## Authentication

- Auth app is for signing in/up users **ONLY**
- Auth app **is not for**
  - enforcing permissions,
  - allowing access to certain routes,
  - figuring out if user is signed in
  - why?
    - Eg, if user goes to /dashboard, which is a protected page,
    - only code for Container and Dashboard are loaded. Auth is not.
    - Hence, Auth should not be responsible for checking
    - Loading Auth everytime a user access the Container is inefficient
- Two approaches for handling auth
  - Each app is aware of auth
    - Not recommended as we will have a lot of duplicate codes because each individual app needs to have some authentication related code to decide whether or not the user is logged in, whether they're signed out, whether they have permission to go to some page, and so on.
  - Centralise auth in Container
    - Recommend approach
    - Container communicate down to each sub app the user's current authentication status.
