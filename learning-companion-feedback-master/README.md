# IJkingstoets dashboard

## Starting development
- Run the react app in development mode: `npm run start` in the root folder
- Start the backend / server: `npm run start` in the server folder.

## Using docker
### Needed file: `deploy_key`
- Run `docker-compose -f docker-compose-local.yml build`
- Run `docker-compose -f docker-compose-local.yml up editor` 
    - Takes a while the first time, needs to clone a lot
- Run `docker-compose -f docker-compose-local.yml up reader`


### Building the image
- Run `docker build -f Dockerfile-Reader -t set-registry.repo.icts.kuleuven.be/dsb/ijkingstoets-feedback-reader:latest .`
- Run `docker build -f Dockerfile-Editor -t set-registry.repo.icts.kuleuven.be/dsb/ijkingstoets-feedback-editor:latest .`

## Used libraries
- [Express JS](https://expressjs.com/): Webserver framework, used in server
- [Nivo](https://nivo.rocks/): charts
- [React](https://reactjs.org/): main framework
- [React Ace](https://github.com/securingsincity/react-ace): Ace (code) editor for react, used to edit the markdown
- [React before unload](https://www.npmjs.com/package/react-beforeunload): Use to show dialog when people refresh the page with unsaved changes
- [React sortable hoc](https://github.com/clauderic/react-sortable-hoc): in the managing panel
- [React Material ui](https://material-ui.com/): for all layout and styling etc
- [Typescript](https://www.typescriptlang.org/): kind of a typed JS

# Default React Documentation
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
