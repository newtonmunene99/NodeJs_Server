# NodeJs_Server

## To Run Locally

**Ensure you have the latest stable version of nodejs, and XAMPP installed.**

1.  Git clone this repo
2.  cd into repo
3.  Run `npm install` to install dependencies
4.  Make Sure XAMPP is open and Apache and MySQL are running
5.  Check database configuration in src/config.ts i.e Host,Username and Password for your localhost server or Live Server. And Preferred name for your database
6.  Run `npm run start` to start server.
7.  Run `npm run dev` to start server with live reload

## To run on a remote server

I suggest you try hosting on Heroku or any other that you prefer. Please refer to their respective docs.

**Currently Supported**

-   [x] Register User (get,post)
-   [x] Login User (get,post)
-   [x] Reset User Password (get,post)
-   [ ] Require an api key to use api
-   [ ] Upload photos, videos and documents
-   [ ] Delete user account
-   [ ] Send confirmation email on register

More Features coming soon
