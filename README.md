# 📰 Johnny's NC-NEWS

## Welcome to NC-NEWS!

NC-NEWS is a news aggregation app in the style of Reddit, allowing users to view, vote and comment on articles... and more!

This project was built as part of the amazing [Northcoders Full-Stack Software Developer Bootcamp](https://northcoders.com/) with the aim of demonstrating the backend skills I have learnt including:

* Programming in JavaScript
* Building a RESTful Web API
* Interacting with databases
* Developing using TDD

## Features

* View all articles
* View a specific article
* View articles filtered by topic, sorted by xxx, and/or ordered in ascending or descending order
* View, post and delete comments on articles
* Upvote or downvote an article
* View all users

## Using NC-NEWS

A live version of this API can be found here:

https://backend-project-nc-news-49l4.onrender.com/

Please bear in mind this is hosted on a free tier of Render so may take a few seconds to start.

Alternatively, to run a local copy please ensure you are running node version xxx and follow these steps:

1. clone this repository:
   ```
   git clone https://github.com/jbhall4291/backend-nc-news
   ```

2. change into this repos directory:
   ```
   cd backend-nc-news
   ```

3. install dependencies
   ```
   npm install
   ```

4. use the provided scripts to set up and seed the dev and test databases.
   ```
   npm run setup-dbs && npm run seed
   ```

5. create the following two .env files in the main project folder:
   ```
   .env.test
   .env.development
   ```

   Into each of these files, add the single line *PGDATABASE=<database_name_placeholder>*, replacing the placeholder text with the corresponding database name for each environment. Please see `/db/setup.sql` for what each database should be. Double check that these .env files are in `.gitignored`!




6. start the express server and the app will start listening on 
port 9090 of your localhost
   ```
   npm start
   ```
7. point your browser at `localhost:9090/api` to see a list of all the endpoints, how to interact with them, and example responses.

8. Enjoy! 🎉

The app has been fully tested with the use of Jest and the Supertest library. You can run these tests using:
```
npm test
```










