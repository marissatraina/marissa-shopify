# Marissa's WS Shopify Boilerplate

A fresh start for your new Shopify project.

###Code repository
`https://github.com/Wondersauce/wondersauce-shopify-boilerplate`

### Dependencies

- NodeJS: `https://nodejs.org/en/`
- Themekit: `https://shopify.github.io/themekit/`

### Module bundling

This project usues ParcelJS as module bundler `https://parceljs.org/`

### Setup

- Duplicate the file `config.sample.yml` and call it `config.yml`. Add your different environment names with their different theme ids, store URL and password for the store. Please note that whatever names we choose for the environments will have to be consistent with the commands in the following section "Usage".
- Run `yarn install`

### Usage

- `yarn start`: Watches local changes and uploads theme to the `development` store (see config.yml). A new tab in your browser should start and reload automatically with each new change.
- `yarn deploy:development`: Uploads all files unminimized (JS, CSS) to the `development` store
- `yarn deploy:production`: Uploads all files minimized (JS, CSS) to the `production` store

(\*) Please note that these commands assumes there are 2 environments configured in the `config.yml`: `development` and `production`

### Code formatting

Prettier (`https://prettier.io/`) has been set up in the project for consistent formatting across JS and CSS files. A pre-commit hook tied to Prettier runs to the local files are automatically "prettied" before pushing them to the repo.

### Folder structure

- /assets, /config, /layout, /locales, /sections, /snippets, /templates # Shopify theme files
- /src # Custom JS/CSS
  - /js
  - /styles
- browsersync-script.js # Runs Browsersync on `yarn start`
- config.sample.yml A sample file to configure theme kit

### Continuous Integration (CI)

WIP

### Theme development approach

WIP

### Component catalog

WIP
