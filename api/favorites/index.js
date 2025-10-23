// Favorites endpoints
// GET ?userId=xxx - Get favorites for a user
// POST - Add favorite
import { query, jsonResponse, errorResponse, corsHeaders } from '../lib/db.js';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // GET - Fetch favorites for a user
    if (request.method === 'GET') {
      const url = new URL(request.url);
      const userId = url.searchParams.get('userId');

      if (!userId) {
        return errorResponse('userId parameter is required', 400);
      }

      const favorites = await query(
        `SELECT id, location_id, user_id, user_name, created_at
         FROM favorites
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [parseInt(userId)]
      );

      return jsonResponse({
        success: true,
        favorites: favorites.map(fav => ({
          id: fav.id,
          locationId: fav.location_id,
          userId: fav.user_id,
          userName: fav.user_name,
          createdAt: fav.created_at
        }))
      });
    }

    // POST - Add favorite
    if (request.method === 'POST') {
      const body = await request.json();
      const { locationId, userId, userName } = body;

      // Validate required fields
      if (!locationId || !userId || !userName) {
        return errorResponse('locationId, userId, and userName are required', 400);
      }

      try {
        // Insert favorite (will fail if duplicate due to UNIQUE constraint)
        const result = await query(
          `INSERT INTO favorites (location_id, user_id, user_name)
           VALUES ($1, $2, $3)
           RETURNING id, location_id, user_id, user_name, created_at`,
          [locationId, parseInt(userId), userName]
        );

        const favorite = result[0];

        return jsonResponse({
          success: true,
          favorite: {
            id: favorite.id,
            locationId: favorite.location_id,
            userId: favorite.user_id,
            userName: favorite.user_name,
            createdAt: favorite.created_at
          }
        }, 201);

      } catch (error) {
        // Check if it's a duplicate key error
        if (error.message.includes('duplicate') || error.message.includes('unique')) {
          return errorResponse('Location already favorited', 409);
        }
        throw error;
      }
    }

    return errorResponse('Method not allowed', 405);

  } catch (error) {
    console.error('Favorites API error:', error);
    return errorResponse('Failed to process favorite: ' + error.message);
  }
}
