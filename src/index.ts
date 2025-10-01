// Main Lambda handler for API Gateway
import { identifyHandler } from './handlers/identifyHandler';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

export const handler = async (event: any, context: any): Promise<any> => {
  try {
    // Log the event for debugging
    console.log('Event received:', JSON.stringify(event, null, 2));

    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
      };
    }

    // simple router based on path - handle different API Gateway formats
    const path = event.path || event.resource || event.requestContext?.http?.path || event.routeKey || event.rawPath;
    
    console.log('Detected path:', path);

    if (path && (path.endsWith('/identify') || path === '/identify')) {
      return await identifyHandler(event);
    }

    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Not Found', receivedPath: path })
    };
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Internal Server Error', error: String(error) })
    };
  }
};
