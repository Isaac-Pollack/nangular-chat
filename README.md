# Nangular Chat

This project repo is split into two folders;

'Chat' - The frontend aspect

'Server' - Server side aspect

## ////////////////////////////////////////////////////////////////////////////////

To begin local development/installation you will need to run the following:

Frontend/Angular:

```console
cd nangular-chat/chat
npm install
```

Server/Express:

```console
cd nangular-chat/server
npm install
```

## Running Locally

CORS middleware is installed to make this seamless, so make sure to have run the above steps before hand. As this is split into two folders, you will need to run both the server side and the Angular application for full functionality. This can be achieved by running the following:

### Frontend

```console
cd nangular-chat/server
ng serve
```

### Server

```console
cd nangular-chat/server
node server.js
```

And all server actions will take place over [localhost:3000](localhost:3000)

Allowing the frontend to be accessed via [localhost:4200](localhost:4200)

### MongoDB

You will require a local MongoDB server, which can be easily setup by installing [MongoDB](https://www.mongodb.com/docs/manual/installation/) here.

I would also suggest an easier way to digest this data and add/edit using a tool such as [Compass](https://www.mongodb.com/products/compass) also from MongoDB.

The Compass settings/setup are as follows:

- URI: mongodb://localhost:27017
- Database Name: 3813DB

The DB is designed to have 4 collections, named as follows:

- users
- groups
- channels
- chats

To add/edit the data within these collections refer to the [Data Structures](#data-structures)

## /////////////////////////////////////////////////////////////////////////////////

## Version Control

This project utilises Git and is hosted on Github, as these provide flexible and free version control across multiple devices which is a big positive for me, moving between. I am able to go at my own pace with development and merge as I see fit, with the option of collaboration later down the line with little to no change. I mainly use the repo solely for backup purposes as my local copies contain any changes, but committing often is something I strive to do.

## Data Structures

All data will be stored as objects, written as JSON. We will follow a simple notation such as below;<br>

### Users

| **Identifier** | **Data type** | **Example** |
| --- | --- | --- |
| \_id | Id | MongoDB-ID value |
| Username | String | super |
| Email | String | super@gmail.com |
| Password | String | 123 |
| Role | String | SuperAdmin |

```json
{
  "_id": {
    "$oid": "6348e7606d62c67aaf7c1c1d"
  },
  "username": "super",
  "email": "super@gmail.com",
  "password": "123",
  "role": "SuperAdmin"
}
```

### Chat History

| **Identifier** | **Data type** | **Example** |
| --- | --- | --- |
| \_id | ObjectID | 6348e7606d62c67aaf7c1c1d |
| Channel | String | Work Chatter |
| Chats | String array | Isaac at 01:20 - Hi !

```json
{
  "_id": {
    "$oid": "6348e7606d62c67aaf7c1c1d"
  },
  "channel": "Work Chatter",
  "chats": [
    "Isaac at 01:20 - Hi"
  ]
}
```

### Groups

| **Identifier** | **Data type** | **Example** |
| --- | --- | --- |
| \_id | ObjectID | 6348e7606d62c67aaf7c1c1d |
| Title | String | Work |
| Members | String array | SuperAdmin, Isaac |

```json
{
  "_id": {
    "$oid": "6348e7606d62c67aaf7c1c1d"
  },
  "title": "Work",
  "members": [
    "SuperAdmin",
    "Isaac",
  ]
}
```

### Channels

| **Identifier** | **Data type** | **Example** |
| --- | --- | --- |
| \_id | ObjectID | 6348e7606d62c67aaf7c1c1d |
| Title | String | Work Chatter |
| GroupName | String | Work |
| Members | String array | SuperAdmin, Isaac

```json
{
  "_id": {
    "$oid": "6348e7606d62c67aaf7c1c1d"
  },
  "title": "Work Chatter",
  "groupName": "Work",
  "members": [
    "member",
    "super"
  ]
}
```

## Architecture

### Components

| **Route** | **Parameters** | **Return Types** | **Description** |
| --- | --- | --- | --- |
| **/login** | String, String | Bool | Submits the user login data to the database, and return true if the data matches. |
| **/getUsers** | None | [Object] | Retrieves an array of user objects from the database. |
| **/deleteUser** | String | Bool | Requests that the server delete a user from the database, using the username as a reference for which user to delete. Returns true if no errors are encountered. |
| **/insertUser** | String, String, Number, String | Bool | Creates a new user and publish it to the database. The server does some validation checks on parameters, and also checks whether or not the user already exists before performing the post request. Returns true if successful. |
| **/insertgroup** | String, number, [String] | Bool | Creates a new group and publish it to the database. The server checks if the group already exists, and then performs the post request. Returns true if successful. |
| **/getGroups** | None | [Object] | Retrives an array of group objects from the database. Returns an array of objects to the frontend. |
| **/deleteGroup** | String | Bool | Deletes a group from the database. The server accepts the name of the group as a string, and performs the post request, returning true if successful. |
| **/updateGroup** | Object, Object | Object | Changes the values of an already existing group. The servers accepts an object that represents the data of the group currently in the database, and another object that will replace the existing one. Returns the updated object. |
| **/insertChannel** | String, String, [String] | Bool | Creates a new channel and publish it to the database. The server accepts the values for the new database, and after checking that the channel does not yet already exist, performs the post request, returning true if successful. |
| **/getChannels** | None | [Object] | Retrieves a list of all channels in the database. Returns an array of objects representing the channels. |
| **/deleteChannel** | String | Bool | Deletes an existing channel from the database. The server accepts the name of the database to delete as a String, and performs the delete request, returning true if successful. |
| **/getChatHistory** | None | [Object] | Retrieves a list of all chat history that exists in the database. Returns an array of objects that represent the chat history. |
| **/insertChatHistory** | String, [String] | Bool | Adds the chat from the frontend into the database. The server accepts the name of the channel and an array of the chat history, performs the post request, and returns true if successful. |
| **/deleteChatHistory** | String | Bool | Deletes chat history of a channel on the front end from the database. The server accepts the name of the channel, checks if chat history exists for that channel, and then deletes it from the database. Returns true if successful. |

### Routes

' / ' - Redirects to /login to initialise session data checks<br>
' /login '<br>
' /account '<br>
' /group '<br>
' /channel '<br>
' /admin '<br>
' /adminGroup '<br>
' /adminChannel '<br>
' ** ' - 404, page not found. This is our catch, and it redirects us back to the home page.

### Storage

- The Node.js server storage utilizes a MongoDB database. The mongo database stores all of the user, group, and channel data as well as chat history.

- The application utilizes sessionstorage for a number of items, mostly current login, but also items for returning to previous page, among others.

### API

| **Route** | **Parameters** | **Return Types** | **Description** |
| --- | --- | --- | --- |
| **/api** | None | .MD file as raw HTML | Displays the repo's README.md file rendered as HTML using [Marked.js](https://www.npmjs.com/package/marked). |

## Application Interactions

The client communicates to the server every time the page is loaded or the component is refreshed, and every page is tied to a request, to ensure session status.

Since part 1 I have destructured immensely, however there is still a lot of dependence on multiple files, even with decent levels of cohesion. This is a pain point now the application is larger and is something I wish to have decreased

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
