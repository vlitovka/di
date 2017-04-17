# Simple DI for Node
## Description
Supports multiple modes, you can keep main configuration on one mode but for testing(or environment dependent features) have another mode with limited number of dependencies which will override the ones from first mode.

DI container will search for a requested dependency in configured mode and will look in other mod's configurations in case if requested dependency will not be found.

## Usage example:
```
node sample.js
```

## Installation
```
npm install -s package name
```

## Running tests
```
npm test
```
