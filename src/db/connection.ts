import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://task-user:FSgGCpBhJaEblV7i@project.qeufcdm.mongodb.net/task-db';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conexión a MongoDB establecida');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('Conexión a MongoDB cerrada');
  } catch (error) {
    console.error('Error al cerrar la conexión a MongoDB:', error);
  }
};