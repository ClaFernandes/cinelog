import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error('MONGO_URI não foi definida no arquivo .env');
    }

    try {
        await mongoose.connect(uri);
        console.log('Conectado ao MongoDB Atlas');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        throw error;
    }
}