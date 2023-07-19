const mongoose = require("mongoose");

const connectionString = process.env.DATABASE;

mongoose
   .connect(connectionString, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
   })
   .then(() => {
      console.log(`MongoDB Atlas Connected`);
   })
   .catch((err) => {
      console.log(`MongoDB Atlas failed to connect, ${err}`);
   });

   
