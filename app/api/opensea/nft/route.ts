import { NextRequest, NextResponse } from 'next/server';
const OPENSEA_API_BASE = 'https://api.opensea.io/api/v2';
const OPENSEA_BEARER_TOKEN = process.env.OPENSEA_BEARER_TOKEN;

interface OpenSeaNFTResponse {
  nft: {
    identifier: string;
    collection: string;
    contract: string;
    token_standard: string;
    name: string;
    description: string;
    image_url: string;
    display_image_url: string;
    display_animation_url: string;
    metadata_url: string;
    opensea_url: string;
    updated_at: string;
    is_disabled: boolean;
    is_nsfw: boolean;
    traits?: Array<{
      trait_type: string;
      value: string;
      display_type?: string;
    }>;
  };
  collection: {
    collection: string;
    name: string;
    description: string;
    image_url: string;
    banner_image_url: string;
    owner: string;
    safelist_status: string;
    category: string;
    is_disabled: boolean;
    is_nsfw: boolean;
    trait_offers_enabled: boolean;
    collection_offers_enabled: boolean;
    opensea_url: string;
    project_url: string;
    wiki_url: string;
    discord_url: string;
    telegram_url: string;
    twitter_username: string;
    instagram_username: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    if (!OPENSEA_BEARER_TOKEN) {
      return NextResponse.json(
        { error: 'OpenSea Bearer Token not configured. Please add OPENSEA_BEARER_TOKEN to your environment variables.' },
        { status: 500 }
      );
    }

    const { contractAddress, tokenId } = await request.json();

    if (!contractAddress || !tokenId) {
      return NextResponse.json(
        { error: 'Contract address and token ID are required' },
        { status: 400 }
      );
    }

    // Validate contract address format
    if (!contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: 'Invalid contract address format' },
        { status: 400 }
      );
    }

    // Fetch NFT data from OpenSea API v2
    const nftResponse = await fetch(
      `${OPENSEA_API_BASE}/chain/ethereum/contract/${contractAddress.toLowerCase()}/nfts/${tokenId}`,
      {
        headers: {
          'Authorization': `Bearer ${OPENSEA_BEARER_TOKEN}`,
          'Accept': 'application/json',
          'X-API-KEY': OPENSEA_BEARER_TOKEN, // Some endpoints might still use this header
        },
      }
    );

    if (!nftResponse.ok) {
      if (nftResponse.status === 404) {
        return NextResponse.json(
          { error: 'NFT not found. Please check the contract address and token ID.' },
          { status: 404 }
        );
      } else if (nftResponse.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        );
      } else if (nftResponse.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API credentials. Please check your OpenSea Bearer Token.' },
          { status: 401 }
        );
      } else {
        const errorText = await nftResponse.text();
        return NextResponse.json(
          { error: `OpenSea API error: ${nftResponse.status} - ${errorText}` },
          { status: nftResponse.status }
        );
      }
    }

    const nftData: OpenSeaNFTResponse = await nftResponse.json();

    // Fetch collection stats for floor price
    let floorPrice = 0;
    try {
      // Check if collection data exists before trying to access it
      if (nftData && nftData.collection && nftData.collection.collection) {
        const collectionResponse = await fetch(
          `${OPENSEA_API_BASE}/collections/${nftData.collection.collection}/stats`,
          {
            headers: {
              'Authorization': `Bearer ${OPENSEA_BEARER_TOKEN}`,
              'Accept': 'application/json',
            },
          }
        );

        if (collectionResponse.ok) {
          const collectionStats = await collectionResponse.json();
          floorPrice = collectionStats.total?.floor_price || 0;
        }
      }
    } catch (error) {
      console.error('Error fetching collection stats:', error);
    }

    // Format the response with safe fallbacks for all properties
    const formattedResponse = {
      name: nftData?.nft?.name || 
            (nftData?.collection?.name ? `${nftData.collection.name} #${tokenId}` : `NFT #${tokenId}`),
      collection: nftData?.collection?.name || 'Unknown Collection',
      contractAddress: contractAddress,
      tokenId: tokenId,
      image: nftData?.nft?.image_url || nftData?.nft?.display_image_url || '',
      opensea_url: nftData?.nft?.opensea_url || '',
      description: nftData?.nft?.description || '',
      traits: nftData?.nft?.traits || [],
      floor_price: floorPrice,
      collection_slug: nftData?.collection?.collection || '',
      is_disabled: nftData?.nft?.is_disabled || false,
      is_nsfw: nftData?.nft?.is_nsfw || false,
      token_standard: nftData?.nft?.token_standard || '',
      metadata_url: nftData?.nft?.metadata_url || '',
      updated_at: nftData?.nft?.updated_at || new Date().toISOString()
    };

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to fetch NFT data.' },
    { status: 405 }
  );
}