# NFT Analytics Dashboard - Advanced NFT Market Analysis Platform

A comprehensive NFT analytics platform built with Next.js that provides advanced market analysis, price predictions, and real-time data visualization. Features include OpenSea API integration with proper CORS handling, machine learning models for price predictions, and live market data feeds.

## 🚀 Features

- **NFT URL Analysis**: Paste OpenSea URLs with auto-suggestions for popular collections
- **Contract Address Lookup**: Direct contract address and token ID input with examples
- **Price Predictions**: Get future price predictions with confidence scores using multiple ML models
- **Live Data Feeds**: Real-time price updates and market data simulation
- **Beautiful UI**: Modern, responsive design with smooth animations and neumorphism
- **Multiple Analysis Methods**: Support for URL analysis and contract address lookup
- **Advanced Charts**: Interactive charts with multiple ML model comparisons
- **CORS-Free API**: Server-side proxy eliminates browser CORS restrictions

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (eliminates CORS issues)
- **AI/ML**: Multiple ML models (XGBoost, LSTM, Random Forest, ARIMA) for price predictions
- **Blockchain Data**: OpenSea API v2 with Bearer Token authentication
- **Charts**: Recharts for interactive data visualization
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom neumorphism design

## 📋 Prerequisites

Before running this application, you'll need to obtain:

1. **OpenSea Bearer Token**: [Get Bearer Token](https://docs.opensea.io/reference/api-keys)
   - Sign up for OpenSea API access
   - Generate a Bearer Token (not API Key)
   - This is required to avoid CORS issues

## 🔧 Installation & Setup

1. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd nft-analytics-dashboard
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```
   OPENSEA_BEARER_TOKEN=your_opensea_bearer_token_here
   GEMINI_API_KEY=your_gemini_api_key_here (optional)
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 OpenSea API Setup

### Why Bearer Token Instead of API Key?

The new OpenSea API v2 uses Bearer Token authentication which provides:
- Better security and access control
- Elimination of CORS issues when used server-side
- More reliable rate limiting
- Access to latest API features

### Getting Your Bearer Token

1. Visit [OpenSea Developer Portal](https://docs.opensea.io/reference/api-keys)
2. Sign up or log in to your OpenSea account
3. Navigate to API Keys section
4. Generate a new Bearer Token
5. Copy the token to your `.env.local` file

## 🏗️ Architecture

### CORS Solution

This application solves the OpenSea CORS issue by:

1. **Server-Side Proxy**: Next.js API routes act as a proxy between the frontend and OpenSea API
2. **Bearer Token Authentication**: Uses server-side Bearer Token authentication
3. **No Direct Browser Calls**: All OpenSea API calls happen server-side
4. **Clean Error Handling**: Proper error messages and status codes

### API Routes

- `/api/opensea/nft` - Fetch individual NFT data
- `/api/opensea/collection` - Get collection statistics

## 📊 How It Works

### 1. NFT Analysis Process
- **URL Input**: Users can paste OpenSea URLs with auto-suggestions
- **Contract Lookup**: Direct contract address and token ID input
- **Server-Side Fetch**: Next.js API routes fetch data from OpenSea
- **ML Processing**: Multiple ML models analyze trends and generate predictions

### 2. Price Prediction Algorithm
- **Historical Analysis**: Examines past price movements
- **Trait Analysis**: Considers NFT rarity and trait combinations
- **Market Sentiment**: Factors in collection performance
- **Confidence Scoring**: Provides confidence levels for predictions

### 3. Live Data Features
- **Real-time Simulation**: Simulated live price feeds for demonstration
- **Market Monitoring**: Continuous monitoring of collection performance
- **Interactive Charts**: Real-time chart updates with live data
- **Price Alerts**: Visual indicators for significant price movements

## 🎯 Usage Examples

### Web Interface
1. **URL Analysis**: Paste an OpenSea URL or select from popular examples
2. **Contract Lookup**: Enter contract address and token ID or use provided examples
3. View current price and future predictions
4. Analyze different timeframes (1M, 3M, 6M, 1Y)
5. Monitor live price updates and market data

### Popular NFT Examples
- **CryptoPunks**: 0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB
- **Bored Ape Yacht Club**: 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D
- **Azuki**: 0xED5AF388653567Af2F388E6224dC7C4b3241C544
- **Mutant Ape Yacht Club**: 0x60e4d786628fea6478f785a6d7e704777c86a7c6

## 🔒 Security & Rate Limiting

- **Bearer Token Protection**: All sensitive tokens are stored in environment variables
- **Server-Side Only**: API calls happen only on the server, never in the browser
- **Rate Limiting**: Built-in rate limiting for all API calls
- **Error Handling**: Comprehensive error handling and user feedback
- **Data Validation**: Input validation for all user interactions

## 🚀 Deployment

### Environment Variables for Production
```
OPENSEA_BEARER_TOKEN=your_production_opensea_bearer_token
GEMINI_API_KEY=your_production_gemini_key
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://yourdomain.com
```

### Build for Production
```bash
npm run build
npm start
```

## 📈 API Integration Details

### OpenSea API v2 Usage
- **NFT Retrieval**: Get individual NFT data by contract and token ID
- **Collection Stats**: Retrieve floor prices and volume data
- **Bearer Token Auth**: Secure server-side authentication
- **CORS-Free**: All requests happen server-side

### Error Handling
- **404 Errors**: NFT not found messages
- **401 Errors**: Invalid authentication
- **429 Errors**: Rate limit exceeded
- **Network Errors**: Connection issues

## 🎨 UI/UX Features

- **Responsive Design**: Works perfectly on all devices
- **Neumorphism Design**: Modern, elegant visual style
- **Smooth Animations**: Engaging micro-interactions
- **Loading States**: Clear feedback during processing
- **Error Handling**: User-friendly error messages
- **Auto-suggestions**: Popular NFT examples and contract addresses

## 🔮 Future Enhancements

- **Real WebSocket Integration**: Live price feeds from multiple sources
- **Multi-marketplace Support**: Integrate more NFT platforms
- **Advanced ML Models**: Enhanced prediction algorithms
- **Portfolio Tracking**: Track multiple NFT holdings
- **Price Alerts**: Automated notifications
- **Social Features**: Community predictions and insights
- **Image Analysis**: AI-powered NFT image recognition

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the OpenSea API v2 documentation
- Verify your Bearer Token is correctly configured
- Test with the provided examples
- Check the browser console for detailed error messages

## 🎉 Acknowledgments

- OpenSea for providing comprehensive NFT market data
- Next.js team for excellent API route functionality
- Machine Learning libraries for prediction models
- React and Tailwind CSS communities