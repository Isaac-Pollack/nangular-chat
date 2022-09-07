# Nangular Chat
This project repo is split into two folders;

'Chat' - The frontend aspect

'Server' - Server side aspect

## ////////////////////////////////////////////////////////////////////////////////

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

## ////////////////////////////////////////////////////////////////////////////////

## Version Control
This project utilises Git and is hosted on Github, as these provide flexible and free version control across multiple devices which is a big positive for me, moving between. I am able to go at my own pace with development and merge as I see fit, with the option of collaboration later down the line with little to no change. I mainly use the repo solely for backup purposes as my local copies contain any changes, but committing often is something I strive to do.

## Data Structures
All data will be stored as objects, written as JSON. We will follow a simple notation such as below;<br>

{<br>
  "userid": 1,<br>
  "username": "group",<br>
  "role": "Group Admin",<br>
  "email": "group@test.com",<br>
  "password": "test1"<br>
}<br>

In actual practice we would not store password plain text at all, however this is just for learning.<br>
These structures are moved around and checked/tested against as needed.
## Architecture
### Components
<b>login-page: </b>Our entry point!<br>
<b>register: </b>This page allows us to register to the local storage, and login using that.<br>
<b>profile-page: </b>This page will show our stored information for our account, with an option for a profile picture.<br>
<b>admin-panel: </b>This page is where the user with sufficient permissions will manage others roles and create/delete channels.
<b>chat-page: </b>This is our main chat page, where you will enter/create channels and messages will appear.
### Services
<b>Storage: </b>This service homes our getItem and setItem for our browser storages.<br>
### Routes
' / ' - Redirects to /login to initialise session data checks<br>
' /login '<br>
' /profile '<br>
' /admin '<br>
' /chat '<br>
' ** ' - 404, page not found. This is our catch, and it redirects us back to the home page.

### Node / Server
{{THIS IS UNTRUE FOR PART 1, SIMPLY LOCAL STORAGE}}
- The Node.js server storage utilizes a MongoDB database. The mongo database stores all of the user, group, and channel data as well as chat history.

### API
| Route  | Description |
| ------------- | ------------- |
| [/](http://localhost:3000/api) | Displays the repo's README.md file rendered as HTML using [Marked.js](https://www.npmjs.com/package/marked). |
| [/api/users](http://localhost:3000/api/users) | Displays all the users within the users.json file. // Converted to MongoDB in Pt2 // |
| [/api/login](http://localhost:3000/api/login) | Tests validity of the input email + password from our login component against our JSON file, returning a True/False boolean for use in our login component. |
[/api/login-after](http://localhost:3000/api/login-after) | Allows the editing of the users profile data in-page, saves it to the json file as well. |
[/api/profile](http://localhost:3000/api/profile) | Requests the entire user data for the email that is currently logged in to populate the page |
[/api/register](http://localhost:3000/api/register) | Tests whether the email entered in the request exists already, if not creates it within session storage and assigns dummy data to the other profile slots |
[/api/list-user](http://localhost:3000/api/list-user) | Returns a list of all registered users |
[/api/add-user](http://localhost:3000/api/add-user) | Allows Admin ability to add a new user |
[/api/delete-user](http://localhost:3000/api/delete-user) | Allows Admin ability to delete a group |
[/api/list-group](http://localhost:3000/api/list-group) | Returns a list of all registered groups |
[/api/add-group](http://localhost:3000/api/add-group) | Allows Admin ability to add a new group |
[/api/delete-group](http://localhost:3000/api/delete-group) | Allows Admin ability to delete a group |
[/api/list-channel](http://localhost:3000/api/list-channel) | Returns a list of all registered channels |
[/api/add-channel](http://localhost:3000/api/add-channel) | Allows Admin ability to add a new channel |
[/api/delete-channel](http://localhost:3000/api/delete-channel) | Allows Admin ability to delete a channel |
## Application Interactions
The client communicates to the server every time the page is loaded or the component is refreshed, and every page is tied to a request, to ensure session status.

I tried to mostly contain user data and relevant checking to the server side of the application (Server.js), with the client just reaching for the relevant information to consume. I believed on initial design this would be powerful provided proper caching abilities, however now that the application has become larger I believe the correct way to go about this would have been to abstract the api endpoint logic into seperate source files, and the frontend even more removed into relevant services. 

These are aspects that I had only discovered upon implementing it the way that I did. This would stop things such as having to specify my BACKEND_URL every component, and hiding sensitive data from the frontend a little more, albeit not being secure in the first place. The focus was as much as possible, rather than total disregard, however.

## Angular - (Client) Specific
### Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
