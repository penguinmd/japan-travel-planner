// Migration endpoint - Migrate localStorage data to database
// POST with localStorage data in body
import { query, jsonResponse, errorResponse, corsHeaders } from './lib/db.js';

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
    const { localStorageData, brixName = 'Brix' } = body;

    if (!localStorageData) {
      return errorResponse('localStorageData is required', 400);
    }

    const migrationResults = {
      user: null,
      recommendationsMigrated: 0,
      favoritesMigrated: 0,
      errors: []
    };

    // Step 1: Create or get Brix user
    try {
      let users = await query(
        'SELECT id, name FROM users WHERE name = $1',
        [brixName]
      );

      if (users.length > 0) {
        migrationResults.user = users[0];
      } else {
        const result = await query(
          'INSERT INTO users (name) VALUES ($1) RETURNING id, name',
          [brixName]
        );
        migrationResults.user = result[0];
      }
    } catch (error) {
      migrationResults.errors.push(`Failed to create/get user: ${error.message}`);
      return jsonResponse({ success: false, ...migrationResults }, 500);
    }

    const brixUserId = migrationResults.user.id;

    // Step 2: Migrate comments to recommendations
    if (localStorageData.comments && Array.isArray(localStorageData.comments)) {
      for (const comment of localStorageData.comments) {
        try {
          await query(
            `INSERT INTO recommendations (location_id, user_id, user_name, text, created_at)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              comment.locationId,
              brixUserId,
              brixName,
              comment.text,
              comment.timestamp || new Date().toISOString()
            ]
          );
          migrationResults.recommendationsMigrated++;
        } catch (error) {
          migrationResults.errors.push(`Failed to migrate comment ${comment.id}: ${error.message}`);
        }
      }
    }

    // Step 3: Migrate favorites
    if (localStorageData.favorites) {
      const favoritesList = localStorageData.favorites.shared_user || [];

      for (const locationId of favoritesList) {
        try {
          // Use INSERT ... ON CONFLICT to avoid duplicates
          await query(
            `INSERT INTO favorites (location_id, user_id, user_name)
             VALUES ($1, $2, $3)
             ON CONFLICT (location_id, user_id) DO NOTHING`,
            [locationId, brixUserId, brixName]
          );
          migrationResults.favoritesMigrated++;
        } catch (error) {
          migrationResults.errors.push(`Failed to migrate favorite ${locationId}: ${error.message}`);
        }
      }
    }

    return jsonResponse({
      success: true,
      message: 'Migration completed',
      ...migrationResults
    });

  } catch (error) {
    console.error('Migration error:', error);
    return errorResponse('Migration failed: ' + error.message);
  }
}
