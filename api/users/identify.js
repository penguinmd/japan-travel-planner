// User identification endpoint
// POST with { name: "User Name" } to get or create user
import { query, jsonResponse, errorResponse, corsHeaders } from '../lib/db.js';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const body = await request.json();
    const { name } = body;

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return errorResponse('Name is required', 400);
    }

    if (name.trim().length > 100) {
      return errorResponse('Name must be 100 characters or less', 400);
    }

    const trimmedName = name.trim();

    // Try to find existing user
    let users = await query(
      'SELECT id, name, created_at FROM users WHERE name = $1',
      [trimmedName]
    );

    let user;

    if (users.length > 0) {
      // User exists
      user = users[0];
    } else {
      // Create new user
      const result = await query(
        'INSERT INTO users (name) VALUES ($1) RETURNING id, name, created_at',
        [trimmedName]
      );
      user = result[0];
    }

    return jsonResponse({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('User identification error:', error);
    return errorResponse('Failed to identify user: ' + error.message);
  }
}
