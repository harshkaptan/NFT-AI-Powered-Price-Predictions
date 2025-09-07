'use client';

import React, { useState } from 'react';
import { Link, Search, ExternalLink, Loader2, CheckCircle, AlertCircle, Copy, ChevronDown } from 'lucide-react';

interface NFTAnalyzerProps {
  onNFTDetected: (nftInfo: {
    name: string;
    collection: string;
    contractAddress: string;
    tokenId: string;
    image: string;
    traits: Array<{ trait_type: string; value: string }>;
    opensea_url?: string;
    floor_price?: number;
  }) => void;
}

const NFTAnalyzer: React.FC<NFTAnalyzerProps> = ({ onNFTDetected }) => {
  const [nftUrl, setNftUrl] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'url' | 'address'>('url');
  const [showUrlSuggestions, setShowUrlSuggestions] = useState(false);
  const [showContractSuggestions, setShowContractSuggestions] = useState(false);

  // Popular NFT URL examples
  const popularUrls = [
    {
      name: 'CryptoPunks #7804',
      url: 'https://opensea.io/assets/ethereum/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/7804',
      collection: 'CryptoPunks'
    },
    {
      name: 'Bored Ape #1234',
      url: 'https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/1234',
      collection: 'Bored Ape Yacht Club'
    },
    {
      name: 'Azuki #40',
      url: 'https://opensea.io/assets/ethereum/0xed5af388653567af2f388e6224dc7c4b3241c544/40',
      collection: 'Azuki'
    },
    {
      name: 'Mutant Ape #15',
      url: 'https://opensea.io/assets/ethereum/0x60e4d786628fea6478f785a6d7e704777c86a7c6/15',
      collection: 'Mutant Ape Yacht Club'
    }
  ];

  // Contract address examples
  const contractExamples = [
    {
      name: 'CryptoPunks',
      address: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
      tokenId: '7804'
    },
    {
      name: 'Bored Ape Yacht Club',
      address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      tokenId: '1234'
    },
    {
      name: 'Azuki',
      address: '0xED5AF388653567Af2F388E6224dC7C4b3241C544',
      tokenId: '40'
    },
    {
      name: 'Mutant Ape Yacht Club',
      address: '0x60e4d786628fea6478f785a6d7e704777c86a7c6',
      tokenId: '15'
    }
  ];

  const parseOpenSeaURL = (url: string): { contractAddress: string; tokenId: string } => {
    const cleanUrl = url.trim();
    
    const patterns = [
      /opensea\.io\/assets\/ethereum\/0x([a-fA-F0-9]{40})\/(\d+)/,
      /opensea\.io\/assets\/0x([a-fA-F0-9]{40})\/(\d+)/,
      /opensea\.io\/assets\/([^\/]+)\/0x([a-fA-F0-9]{40})\/(\d+)/
    ];

    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match) {
        if (match.length === 3) {
          return {
            contractAddress: `0x${match[1]}`,
            tokenId: match[2]
          };
        } else if (match.length === 4) {
          return {
            contractAddress: `0x${match[2]}`,
            tokenId: match[3]
          };
        }
      }
    }

    throw new Error('Invalid OpenSea URL format. Please provide a valid OpenSea NFT URL.');
  };

  const analyzeFromUrl = async (urlToAnalyze?: string) => {
    const targetUrl = urlToAnalyze || nftUrl;
    if (!targetUrl.trim()) {
      setError('Please enter a valid OpenSea URL.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setShowUrlSuggestions(false);

    try {
      // Parse OpenSea URL to extract contract and token ID
      const { contractAddress, tokenId } = parseOpenSeaURL(targetUrl);
      
      // Fetch NFT data through our API route
      const response = await fetch('/api/opensea/nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contractAddress, tokenId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch NFT data');
      }

      const nftData = await response.json();
      
      const result = {
        name: nftData.name,
        collection: nftData.collection,
        contractAddress: nftData.contractAddress,
        tokenId: nftData.tokenId,
        image: nftData.image,
        traits: nftData.traits || [],
        opensea_url: nftData.opensea_url,
        floor_price: nftData.floor_price
      };

      setAnalysisResult(result);
      onNFTDetected(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze NFT from URL';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeFromAddress = async (addressToUse?: string, tokenToUse?: string) => {
    const targetAddress = addressToUse || contractAddress;
    const targetToken = tokenToUse || tokenId;
    
    if (!targetAddress.trim() || !targetToken.trim()) {
      setError('Please enter both contract address and token ID.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setShowContractSuggestions(false);

    try {
      // Fetch NFT data through our API route
      const response = await fetch('/api/opensea/nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          contractAddress: targetAddress, 
          tokenId: targetToken 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch NFT data');
      }

      const nftData = await response.json();
      
      const result = {
        name: nftData.name,
        collection: nftData.collection,
        contractAddress: nftData.contractAddress,
        tokenId: nftData.tokenId,
        image: nftData.image,
        traits: nftData.traits || [],
        opensea_url: nftData.opensea_url,
        floor_price: nftData.floor_price
      };

      setAnalysisResult(result);
      onNFTDetected(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch NFT data';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUrlSuggestionClick = (url: string) => {
    setNftUrl(url);
    setShowUrlSuggestions(false);
    analyzeFromUrl(url);
  };

  const handleContractExampleClick = (address: string, token: string) => {
    setContractAddress(address);
    setTokenId(token);
    setShowContractSuggestions(false);
    analyzeFromAddress(address, token);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearError = () => {
    setError(null);
  };

  const tabs = [
    { id: 'url', label: 'NFT URL', icon: Link },
    { id: 'address', label: 'Contract Address', icon: Search }
  ];

  return (
    <div className="bg-white rounded-3xl neu-shadow overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-opensea-200">
        <div className="flex">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id as any);
                setError(null);
                setAnalysisResult(null);
                setShowUrlSuggestions(false);
                setShowContractSuggestions(false);
              }}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 transition-all duration-200 ${
                activeTab === id
                  ? 'bg-nft-primary text-white border-b-2 border-nft-primary'
                  : 'text-opensea-600 hover:text-opensea-800 hover:bg-opensea-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* NFT URL Tab */}
        {activeTab === 'url' && (
          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-opensea-800 mb-2">
                OpenSea NFT URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={nftUrl}
                  onChange={(e) => setNftUrl(e.target.value)}
                  onFocus={() => setShowUrlSuggestions(true)}
                  placeholder="https://opensea.io/assets/ethereum/0x.../1234"
                  className="w-full px-4 py-3 pr-12 border-2 border-opensea-200 rounded-xl focus:ring-2 focus:ring-nft-primary focus:border-nft-primary transition-all"
                />
                <button
                  onClick={() => setShowUrlSuggestions(!showUrlSuggestions)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-opensea-500 hover:text-opensea-700"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
              
              {/* URL Suggestions Dropdown */}
              {showUrlSuggestions && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-opensea-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                  <div className="p-3 border-b border-opensea-100">
                    <h4 className="font-semibold text-opensea-800 text-sm">Popular NFT Examples</h4>
                  </div>
                  {popularUrls.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleUrlSuggestionClick(item.url)}
                      className="w-full text-left px-4 py-3 hover:bg-opensea-50 transition-colors border-b border-opensea-50 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-opensea-800">{item.name}</p>
                          <p className="text-sm text-opensea-500">{item.collection}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-opensea-400" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-opensea-500 mt-2">
                Click the dropdown to see popular NFT examples or paste your own OpenSea URL
              </p>
            </div>
            
            <button
              onClick={() => analyzeFromUrl()}
              disabled={isAnalyzing || !nftUrl.trim()}
              className="w-full bg-gradient-to-r from-nft-primary to-nft-secondary text-white py-3 px-6 rounded-xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Fetching NFT Data...</span>
                </div>
              ) : (
                'Analyze from URL'
              )}
            </button>
          </div>
        )}

        {/* Contract Address Tab */}
        {activeTab === 'address' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-opensea-800 mb-2">
                  Contract Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    onFocus={() => setShowContractSuggestions(true)}
                    placeholder="0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
                    className="w-full px-4 py-3 pr-12 border-2 border-opensea-200 rounded-xl focus:ring-2 focus:ring-nft-primary focus:border-nft-primary transition-all font-mono text-sm"
                  />
                  <button
                    onClick={() => setShowContractSuggestions(!showContractSuggestions)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-opensea-500 hover:text-opensea-700"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-opensea-800 mb-2">
                  Token ID
                </label>
                <input
                  type="text"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  placeholder="1234"
                  className="w-full px-4 py-3 border-2 border-opensea-200 rounded-xl focus:ring-2 focus:ring-nft-primary focus:border-nft-primary transition-all"
                />
              </div>
            </div>

            {/* Contract Examples Dropdown */}
            {showContractSuggestions && (
              <div className="bg-white border border-opensea-200 rounded-xl shadow-lg">
                <div className="p-3 border-b border-opensea-100">
                  <h4 className="font-semibold text-opensea-800 text-sm">Popular Contract Examples</h4>
                </div>
                {contractExamples.map((item, index) => (
                  <div key={index} className="p-4 hover:bg-opensea-50 transition-colors border-b border-opensea-50 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-opensea-800">{item.name}</h5>
                      <button
                        onClick={() => handleContractExampleClick(item.address, item.tokenId)}
                        className="bg-nft-primary text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-nft-secondary transition-colors"
                      >
                        Use Example
                      </button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-opensea-600">Contract:</span>
                        <code className="text-xs font-mono text-opensea-700 bg-opensea-100 px-2 py-1 rounded">{item.address}</code>
                        <button
                          onClick={() => copyToClipboard(item.address)}
                          className="text-opensea-500 hover:text-opensea-700"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-opensea-600">Token ID:</span>
                        <code className="text-xs font-mono text-opensea-700 bg-opensea-100 px-2 py-1 rounded">{item.tokenId}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => analyzeFromAddress()}
              disabled={isAnalyzing || !contractAddress.trim() || !tokenId.trim()}
              className="w-full bg-gradient-to-r from-nft-primary to-nft-secondary text-white py-3 px-6 rounded-xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Fetching NFT Data...</span>
                </div>
              ) : (
                'Fetch NFT Data'
              )}
            </button>
          </div>
        )}

        {/* Analysis Result */}
        {analysisResult && (
          <div className="mt-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h4 className="text-lg font-bold text-green-800">NFT Found Successfully!</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {analysisResult.image ? (
                  <img 
                    src={analysisResult.image} 
                    alt={analysisResult.name}
                    className="w-full h-48 object-cover rounded-xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-opensea-200 rounded-xl flex items-center justify-center">
                    <Search className="h-12 w-12 text-opensea-400" />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-bold text-opensea-800 text-lg">{analysisResult.name}</h5>
                  <p className="text-opensea-600">{analysisResult.collection}</p>
                  {analysisResult.opensea_url && (
                    <a 
                      href={analysisResult.opensea_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-nft-primary hover:text-nft-secondary transition-colors text-sm mt-1"
                    >
                      <span>View on OpenSea</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-opensea-700">Token ID</p>
                    <p className="text-opensea-800 font-bold">#{analysisResult.tokenId}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-opensea-700">Floor Price</p>
                    <p className="text-nft-primary font-bold">
                      {analysisResult.floor_price ? `${analysisResult.floor_price.toFixed(3)} ETH` : 'N/A'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold text-opensea-700">Contract</p>
                    <p className="text-opensea-600 text-xs font-mono break-all">{analysisResult.contractAddress}</p>
                  </div>
                </div>
                
                {analysisResult.traits && analysisResult.traits.length > 0 && (
                  <div>
                    <p className="font-semibold text-opensea-700 mb-2">Traits</p>
                    <div className="grid grid-cols-2 gap-2">
                      {analysisResult.traits.slice(0, 4).map((trait: any, index: number) => (
                        <div key={index} className="bg-opensea-100 rounded-lg p-2">
                          <p className="text-xs font-semibold text-opensea-600">{trait.trait_type}</p>
                          <p className="text-sm font-bold text-opensea-800">{trait.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <h4 className="text-lg font-bold text-blue-800">Fetching NFT Data...</h4>
            </div>
            <p className="text-blue-600">
              Connecting to OpenSea API to get the latest information and market data
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTAnalyzer;