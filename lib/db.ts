import mongoose from 'mongoose';

const MONGODB_URI= process.env.MONGODB_URI;

const connect = async () => {
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
        console.log('Connection already established');
        return;
    }

    if (connectionState === 2) {
        console.log('Connecting...');
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI!, {
            dbName: 'next14restapi',
            bufferCommands: true,
        });

        console.log('Connection established');

    } catch (error) {
        console.error('Error connecting to database:', error);
        // @ts-ignore
        throw new Error('Error connecting to database', error);
    }
}

export default connect;

