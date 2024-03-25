import express from "express";
import mongoose from "mongoose";
import Event from "./modal/event.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import eventRoute from "./routes/event.js";
import path from "path";

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// aim to do
// 1 . first input the Event in mongo db
// 2.  make a end point insert the Event
// 3.  make a end point with business logic

// -------------
// docuumantation
// selection
//  demo video

// middle ware
app.use("/event", eventRoute);

mongoose
  .connect(
    "mongodb+srv://admin:6Jx1rrgwLqVasrla@ggdb.s8olb21.mongodb.net/?retryWrites=true&w=majority&appName=ggdb"
  )
  .then(() => {
    console.log("connected to db ");
  })
  .catch((e) => {
    console.log(" db error " + e);
  });
/*
const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: " REST API 📝",
      version: "1.0.0",
    },
    schemes: ["http", "https"],
    servers: [{ url: "http://localhost:3000/" }],
  },
  apis: [path.resolve(__dirname, "./routes/*.js")],
};


const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
*/

app.listen(3000, () => {
  console.log("up on 3000");
});
// 6Jx1rrgwLqVasrla

// do pagination
// fetch api to fill the remaning data
// --->
