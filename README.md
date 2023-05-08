# 📰 Johnny's NC-NEWS

## Welcome to NC-NEWS!

NC-NEWS is a news aggregation app in the style of Reddit, allowing users to view, vote and comment on articles... and more!

This project was built as part of the amazing [Northcoders Full-Stack Software Developer Bootcamp](https://northcoders.com/) with the aim of demonstrating the backend skills I have learnt so far including:

* Programming in JavaScript
* Building a RESTful Web API
* Interacting with PSQL databases
* Developing using TDD

## Features

* View all articles
* View a specific article
* Filter, sort and/or order articles via queries
* View, post and delete comments on articles
* Upvote or downvote an article
* View all users

## Using NC-NEWS

A live version of this API can be found here:

https://backend-project-nc-news-49l4.onrender.com/

Please bear in mind this is hosted on a free tier of Render so may take a few seconds to start.

Alternatively, to run a local copy please ensure you are running node (minimum version 19.5.0) and postgreSQL (minimum version 14.6), then follow these steps:

1. Clone this repository:
   ```
   git clone https://github.com/jbhall4291/backend-nc-news
   ```

2. Change into this repos directory:
   ```
   cd backend-nc-news
   ```

3. Install dependencies
   ```
   npm install
   ```

4. Use the provided scripts to set up and seed the dev and test databases.
   ```
   npm run setup-dbs && npm run seed
   ```

5. Create the following two .env files in the main project folder:
   ```
   .env.test
   .env.development
   ```

   Into each of these files, add the single line PGDATABASE=<database_name_placeholder>, replacing the placeholder text with the corresponding database name for each environment. Please see `/db/setup.sql` for what each database should be. Double check that these .env files are in `.gitignore`!

6. Start the express server and the app will start listening on 
port 9090 of your localhost
   ```
   npm start
   ```
7. Point your browser at `localhost:9090/api` to see a list of all the endpoints, how to interact with them, and example responses.

8. This app has been fully tested with the use of Jest and the Supertest library. To install the necessary dependencies and run the test suite use:
   ```
   npm install -D jest jest-sorted supertest
   npm test
   ```

9. Enjoy! 🎉












