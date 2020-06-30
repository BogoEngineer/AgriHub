# ABOUT
This project is a MEAN stack web application that covers:
- Three types of users (Farmer, Company and Admin)
- Login and Registration of a new user
- Using [distance API](https://docs.microsoft.com/en-us/bingmaps/rest-services/routes/calculate-a-distance-matrix) for calculating time for delivery of a product from a company to a farmer
- Online shopping

## Farmer
Farmer can:
- Add a new nursery
- Manage his nurseries (regulating water/temperature, manage seedlings)
- Order products(seedlings and/or treatments) from a company
- Track progress of each seedling and boosting it with treatments
- Remove seedling when it's ready and plant a new seedling when the spot in a nursery is free

## Company
Company can:
- Add a new product
- Deliver a product that has been ordered (max 5 at the time)
- Remove an already existing product
- View it's history of orders on a graph

## Admin
Admin can:
- Add/remove/change a user
- See all of the existing users
- Accept or decline register requests from potential users

# USAGE
## Client
Inside the Client folder is an Angular app. To start the app, follow this [set of instructions](https://angular.io/guide/setup-local).
## Server
To start the server.js (inside the Server folder), download and install [node&npm](https://nodejs.org/en/), open cmd and do the following:
```
npm install
node server
```
## Database
If you want to use the database inside database folder, download [mongoDB](https://www.mongodb.com/try/download/enterprise), and use [mongorestore](https://docs.mongodb.com/manual/reference/program/mongorestore/) command inside the cmd.


