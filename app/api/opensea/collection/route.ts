import { NextRequest, NextResponse } from 'next/server';

const OPENSEA_API_BASE = 'https://api.opensea.io/api/v2';
const OPENSEA_BEARER_TOKEN = process.env.OPENSEA_BEARER_TOKEN;

export async function GET(request: NextRequest) {
  try {
    if (!OPENSEA_BEARER_TOKEN) {
      return NextResponse.json(
        { error: 'OpenSea Bearer Token not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const collectionSlug = searchParams.get('slug');

    if (!collectionSlug) {
      return NextResponse.json(
        { error: 'Collection slug is required' },
        { status: 400 }
      );
    }

    // Fetch collection stats
    const response = await fetch(
      `${OPENSEA_API_BASE}/collections/${collectionSlug}/stats`,
      {
        headers: {
          'Authorization': `Bearer ${OPENSEA_BEARER_TOKEN}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Collection not found' },
          { status: 404 }
        );
      }
      throw new Error(`OpenSea API error: ${response.status}`);
    }

    const collectionData = await response.json();
    return NextResponse.json(collectionData);
  } catch (error) {
    console.error('Collection API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collection data' },
      { status: 500 }
    );
  }
}