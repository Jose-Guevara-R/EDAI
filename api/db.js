// api/db.js
// Este archivo maneja la conexión segura con Neon (PostgreSQL)
// Se utilizará en las Serverless Functions de Vercel.

import { Pool } from 'pg';

// Creamos un "Pool" de conexiones. 
// Es como tener varias líneas telefónicas listas para no saturar al servidor.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Vercel inyectará esta variable secreta
  ssl: {
    rejectUnauthorized: false // Necesario para conexiones seguras a Neon
  }
});

/**
 * Función genérica para ejecutar consultas SQL.
 * Úsala en cualquier endpoint de la API.
 * @param {string} text - La consulta SQL (ej: 'SELECT * FROM usuarios')
 * @param {Array} params - Parámetros para evitar inyección SQL (ej: [idUsuario])
 */
export default async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query ejecutada', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw error;
  }
}
