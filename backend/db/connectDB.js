import mongoose from "mongoose";

const connect = async (uri) => {
    const db_options = {
        dbname: process.env.DB_NAME,
    }

    try {
        await mongoose.connect(uri, db_options); 
        console.log("Database connected successfully...");
    } 
    catch (error) {
        console.log(error);
    }
}

export default connect;