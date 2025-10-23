// Database connection helper using Neon serverless Postgres
import { neon } from '@neondatabase/serverless';

let sql;

// Initialize database connection
export function getDb() {
  if (!sql) {
    const connectionString = process.env.POSTGRES_URL;

    if (!connectionString) {
      throw new Error('POSTGRES_URL environment variable is not set');
    }

    sql = neon(connectionString);
  }

  return sql;
}

// Helper to execute queries with error handling
export async function query(text, params = []) {
  try {
    const sql = getDb();
    const result = await sql(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// CORS headers for API responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Helper to create JSON responses
export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// Helper to create error responses
export function errorResponse(message, status = 500) {
  return jsonResponse({ error: message }, status);
}
