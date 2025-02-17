//initializing and configure dotenv secret fiel.
import dotenv from "dotenv";
dotenv.config();

import express from "express";

//Static files
const PORT=process.env.PORT

//Express app initialization
const app = express();

//middleware for accepting json
app.use(express.json());

//listening the port and starting the app
app.listen(PORT, ()=>{
    console.log(`Server started on PORT:${PORT}`);
});