// Delete recommendation endpoint
// DELETE /api/recommendations/[id] - Delete a recommendation
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
      return errorResponse('Invalid recommendation ID', 400);
    }

    // Delete the recommendation
    const result = await query(
      'DELETE FROM recommendations WHERE id = $1 RETURNING id',
      [parseInt(id)]
    );

    if (result.length === 0) {
      return errorResponse('Recommendation not found', 404);
    }

    return jsonResponse({
      success: true,
      message: 'Recommendation deleted successfully',
      id: parseInt(id)
    });

  } catch (error) {
    console.error('Delete recommendation error:', error);
    return errorResponse('Failed to delete recommendation: ' + error.message);
  }
}
