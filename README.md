# Nangular Chat
This project repo is split into two folders;

'Chat' - The frontend aspect

'Server' - Server side aspect

////////////////////////////////////////////////////////////////////////////////

To begin local development/installation you will need to run the following:
```console
cd nangular-chat/chat
npm install
```
And also
```console
cd nangular-chat/server
npm install
```

## Running Locally
CORS middleware is installed to make this seamless, so make sure to have run the above steps before hand. As this is split into two folders, you will need to run both the server side and the Angular application for full functionality. This can be achieved by running the following:
### Server
```console
cd nangular-chat/server
node server.js
```
And all server actions will take place over [localhost:3000](localhost:3000)

### Frontend
```console
cd nangular-chat/server
ng serve
```
Allowing the frontend to be accessed via [localhost:4200](localhost:4200)

////////////////////////////////////////////////////////////////////////////////

## Version Control
This project utilises Git and is hosted on Github, as these provide flexible and free version control across multiple devices which is a big positive for me, moving between. I am able to go at my own pace with development and merge as I see fit, with the option of collaboration later down the line with little to no change. I mainly use the repo solely for backup purposes as my local copies contain any changes, but committing often is something I strive to do.

## Data Structures
s
## Architecture
### Components
<b>Login: </b>This page <br>
<b>Register: </b>This page <br>
<b>Profile: </b>This page <br>
<b>Admin: </b>This page
### Services
<b>Storage: </b>This service <br>
### Routes
'/' - The landing page, just aesthetic, with nav.
'/login - Log in page
'/profile - Greeting profile page, retrieves current session storage and displays username, email and admin priveledges (group assignments)
'/admin - Those with admin accesss are given the ability to create new users, groups and channels in mongoDB.
'**' - 404, page not found. This is our catch, and it redirects us back to the home page.

### Node / Server
{{THIS IS UNTRUE FOR PART 1, SIMPLY LOCAL STORAGE}}
- The Node.js server storage utilizes a MongoDB database. The mongo database stores all of the user, group, and channel data as well as chat history.

### REST API
// NOT MINE, JUST EG
| Route  | Description |
| ------------- | ------------- |
| /api/add | Takes inputs from a user and creates a new entry in the mongoDB collection 'users'  |
| /api/api-login | Tests values of a user from the locally stored JSON file making sure the username and password match and updates its value as "true" for use in /api/login-success |
| /api/list | Displays all the users within the mongoDB collection |
| /api/listen | Prints to the console that the server has been started with a timestamp of hours, minutes and seconds |
| /api/login-success | Takes userObj array which contains locally stored values of userid, username, email and role and pushes successfully logged in users to an array called uArray in session storage |
| /api/deleteitem | deletes an item from the mongoDB collection when selected by ID |
| /api/update | updates the selected user in mongoDB collection with values given through user input |
## Application Interactions
• Describe the details of the interaction between client and server by indicating how the files and global vars in server side will be changed and how the display of each angular component page will be updated.

A description of how you divided the responsibilities between client and server (you are encouraged to have the server provide a REST API which returns JSON in addition to a static directory)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
