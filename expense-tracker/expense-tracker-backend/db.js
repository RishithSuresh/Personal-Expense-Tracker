import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log('✅ Database connected successfully to:', process.env.DB_NAME);
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Check your database credentials and ensure MySQL is running');
    }
}

testConnection();