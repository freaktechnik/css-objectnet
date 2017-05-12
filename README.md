# ![](data/icon-48b.png) CSS Objectnet
[![Travis CI Builds](https://travis-ci.org/freaktechnik/css-objectnet.svg)](https://travis-ci.org/freaktechnik/css-objectnet) [![Dependency CI](https://dependencyci.com/github/freaktechnik/css-objectnet/badge)](https://dependencyci.com/freaktechnik/css-objectnet)

This is an experimental dev tool to analyze the ID-Class relations of HTML nodes.

## Translations
The extension is translated via [Transifex](https://www.transifex.com/freaktechnik/css-objectnet/).

## Development
### Set up environment
Run `npm i` to install all required dependencies.

### Test extension in browser
By running `npm start` the extension will be build and web-ext will launch Firefox with the extension temporarily loaded in a throwaway profile.

### Build extension
To build the extension, run `npm run build`.

### Run tests
The extension both follows eslint rules and linting rules for WebExtensions by Mozilla. To run the linters, run `npm test`.
