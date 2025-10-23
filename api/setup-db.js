// One-time database setup endpoint
// Visit /api/setup-db once after connecting Neon to create tables
import { query, jsonResponse, errorResponse } from './lib/db.js';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Only allow GET requests
  if (request.method !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create recommendations table
    await query(`
      CREATE TABLE IF NOT EXISTS recommendations (
        id SERIAL PRIMARY KEY,
        location_id VARCHAR(255) NOT NULL,
        user_id INTEGER REFERENCES users(id),
        user_name VARCHAR(100) NOT NULL,
        text TEXT NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create favorites table
    await query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        location_id VARCHAR(255) NOT NULL,
        user_id INTEGER REFERENCES users(id),
        user_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(location_id, user_id)
      )
    `);

    // Create indexes for performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_recommendations_location
      ON recommendations(location_id)
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_favorites_location
      ON favorites(location_id)
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_favorites_user
      ON favorites(user_id)
    `);

    return jsonResponse({
      success: true,
      message: 'Database tables created successfully',
      tables: ['users', 'recommendations', 'favorites'],
      indexes: ['idx_recommendations_location', 'idx_favorites_location', 'idx_favorites_user']
    });

  } catch (error) {
    console.error('Database setup error:', error);
    return errorResponse('Failed to set up database: ' + error.message);
  }
}
