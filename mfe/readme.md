# Project 2

## Requirements

### 1. Zero coupling between child projects

    - No importing of functions/objects/classes/etc
    - No shared state
    - Shared libraries through MF is ok

### 2. NEar-zero coupling between container and child apps

    - Container shouldn't assume that a child is using a particular framework
    - Any necessary communication to be done with callbacks or simple events

### 3. CSS from one project shouldn't affect another

### 4. Version control ( monorepo vs separate ) shouldn't have any impact on the overall project

### 5. Container should be able to decide to always use the latest version of a microfrontend or specify a specific version

    - Container will always use the latest version of a child app ( without requiring redeployment of container )
    - Container can specify exactly what version of a child it wants to use ( requires redeployment of container to change )
