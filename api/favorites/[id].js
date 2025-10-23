// Remove favorite endpoint
// DELETE /api/favorites/[id] - Remove a favorite
import { query, jsonResponse, errorResponse, corsHeaders } from '../lib/db.js';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow DELETE requests
  if (request.method !== 'DELETE') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Extract ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    if (!id || isNaN(parseInt(id))) {
      return errorResponse('Invalid favorite ID', 400);
    }

    // Delete the favorite
    const result = await query(
      'DELETE FROM favorites WHERE id = $1 RETURNING id',
      [parseInt(id)]
    );

    if (result.length === 0) {
      return errorResponse('Favorite not found', 404);
    }

    return jsonResponse({
      success: true,
      message: 'Favorite removed successfully',
      id: parseInt(id)
    });

  } catch (error) {
    console.error('Remove favorite error:', error);
    return errorResponse('Failed to remove favorite: ' + error.message);
  }
}
