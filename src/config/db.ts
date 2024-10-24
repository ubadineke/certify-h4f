import mongoose from 'mongoose';

export default async function connectToDatabase() {
    const connection = await mongoose
        .connect(process.env.DB_URL as string)
        .then(() => console.log('DATABASE CONNECTED'))
        .catch((error: any) => {
            console.error('MongoDB connection error:', error.message);
            process.exit(1);
        });
}
