// Recommendations endpoints
// GET ?locationId=xxx - Get recommendations for a location
// POST - Create new recommendation
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
    // GET - Fetch recommendations for a location
    if (request.method === 'GET') {
      const url = new URL(request.url);
      const locationId = url.searchParams.get('locationId');

      if (!locationId) {
        return errorResponse('locationId parameter is required', 400);
      }

      const recommendations = await query(
        `SELECT id, location_id, user_id, user_name, text, rating, created_at, updated_at
         FROM recommendations
         WHERE location_id = $1
         ORDER BY created_at DESC`,
        [locationId]
      );

      return jsonResponse({
        success: true,
        recommendations: recommendations.map(rec => ({
          id: rec.id,
          locationId: rec.location_id,
          userId: rec.user_id,
          userName: rec.user_name,
          text: rec.text,
          rating: rec.rating,
          createdAt: rec.created_at,
          updatedAt: rec.updated_at
        }))
      });
    }

    // POST - Create new recommendation
    if (request.method === 'POST') {
      const body = await request.json();
      const { locationId, userId, userName, text, rating } = body;

      // Validate required fields
      if (!locationId || !userId || !userName || !text) {
        return errorResponse('locationId, userId, userName, and text are required', 400);
      }

      // Validate rating if provided
      if (rating !== null && rating !== undefined) {
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
          return errorResponse('rating must be an integer between 1 and 5', 400);
        }
      }

      // Insert recommendation
      const result = await query(
        `INSERT INTO recommendations (location_id, user_id, user_name, text, rating)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, location_id, user_id, user_name, text, rating, created_at, updated_at`,
        [locationId, userId, userName, text, rating || null]
      );

      const recommendation = result[0];

      return jsonResponse({
        success: true,
        recommendation: {
          id: recommendation.id,
          locationId: recommendation.location_id,
          userId: recommendation.user_id,
          userName: recommendation.user_name,
          text: recommendation.text,
          rating: recommendation.rating,
          createdAt: recommendation.created_at,
          updatedAt: recommendation.updated_at
        }
      }, 201);
    }

    return errorResponse('Method not allowed', 405);

  } catch (error) {
    console.error('Recommendations API error:', error);
    return errorResponse('Failed to process recommendation: ' + error.message);
  }
}
