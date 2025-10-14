const mongoose = require('mongoose');

const dbConnection = async () => {
        try {
                await mongoose.connect(process.env.MONGO_DB_URI);
                console.log("Database Connected Successfully.");
        } catch(error) {
                console.log(error);
                
        }
}

module.exports = dbConnection;