# Marissa Shopify Sandbox
Marissa Shopify Site 

### Build Setup

Navigate to the `/app` folder and run `npm install` or 'sudo npm install'

##### Install Individual Dev Dependencies
`npm install <new-dependency> --save` / `sudo npm install <new-dependency> --save`<br>
or<br>
`npm install <new-dependency> --save-dev` / `sudo npm install <new-dependency> --save-dev`<br>
`--save:` Package will appear in your dependencies.  
`--save-dev:` Package will appear in your devDependencies.

<br><br>

### Watch Commands

##### SCSS Only
`npm run watch:dev:css`  
`npm run watch:prod:css`
##### JS Only
`npm run watch:prod:js`
##### Theme Files Only (Layouts/Templates/Sections)
`npm run watch:theme`  
To run themekit commands directly, navigate to the `root` directory instead
##### All Watch Tasks
`npm run watch:all:dev`
`npm run watch:all:prod`