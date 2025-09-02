// Common company name to ticker symbol mappings
export const companyTickerMap: Record<string, string> = {
  // Tech Companies
  'apple': 'NASDAQ:AAPL',
  'microsoft': 'NASDAQ:MSFT',
  'google': 'NASDAQ:GOOGL',
  'alphabet': 'NASDAQ:GOOGL',
  'meta': 'NASDAQ:META',
  'facebook': 'NASDAQ:META',
  'tesla': 'NASDAQ:TSLA',
  'nvidia': 'NASDAQ:NVDA',
  'netflix': 'NASDAQ:NFLX',
  'adobe': 'NASDAQ:ADBE',
  'salesforce': 'NYSE:CRM',
  'oracle': 'NYSE:ORCL',
  'intel': 'NASDAQ:INTC',
  'amd': 'NASDAQ:AMD',
  'ibm': 'NYSE:IBM',
  'cisco': 'NASDAQ:CSCO',
  'uber': 'NYSE:UBER',
  'airbnb': 'NASDAQ:ABNB',
  'spotify': 'NYSE:SPOT',
  'paypal': 'NASDAQ:PYPL',
  'square': 'NYSE:SQ',
  'block': 'NYSE:SQ',
  'twitter': 'NYSE:X',
  'x': 'NYSE:X',
  'snap': 'NYSE:SNAP',
  'snapchat': 'NYSE:SNAP',
  'zoom': 'NASDAQ:ZM',
  'shopify': 'NYSE:SHOP',
  'roblox': 'NYSE:RBLX',
  'palantir': 'NYSE:PLTR',
  'coinbase': 'NASDAQ:COIN',
  'robinhood': 'NASDAQ:HOOD',
  'doordash': 'NASDAQ:DASH',
  'pinterest': 'NYSE:PINS',
  'crowdstrike': 'NASDAQ:CRWD',
  'datadog': 'NASDAQ:DDOG',
  'snowflake': 'NYSE:SNOW',
  'mongodb': 'NASDAQ:MDB',
  'docusign': 'NASDAQ:DOCU',
  'twilio': 'NYSE:TWLO',
  'okta': 'NASDAQ:OKTA',
  'dropbox': 'NASDAQ:DBX',
  
  // Finance
  'jpmorgan': 'NYSE:JPM',
  'jp morgan': 'NYSE:JPM',
  'chase': 'NYSE:JPM',
  'bank of america': 'NYSE:BAC',
  'bofa': 'NYSE:BAC',
  'wells fargo': 'NYSE:WFC',
  'goldman sachs': 'NYSE:GS',
  'goldman': 'NYSE:GS',
  'morgan stanley': 'NYSE:MS',
  'citi': 'NYSE:C',
  'citigroup': 'NYSE:C',
  'citibank': 'NYSE:C',
  'american express': 'NYSE:AXP',
  'amex': 'NYSE:AXP',
  'visa': 'NYSE:V',
  'mastercard': 'NYSE:MA',
  'berkshire': 'NYSE:BRK.A',
  'berkshire hathaway': 'NYSE:BRK.A',
  'blackrock': 'NYSE:BLK',
  'schwab': 'NYSE:SCHW',
  'charles schwab': 'NYSE:SCHW',
  'fidelity': 'FNF',
  
  // Retail
  'walmart': 'NYSE:WMT',
  'amazon': 'NASDAQ:AMZN',
  'home depot': 'NYSE:HD',
  'costco': 'NASDAQ:COST',
  'target': 'NYSE:TGT',
  'lowes': 'NYSE:LOW',
  'cvs': 'NYSE:CVS',
  'walgreens': 'NASDAQ:WBA',
  'kroger': 'NYSE:KR',
  'best buy': 'NYSE:BBY',
  'macys': 'NYSE:M',
  'nordstrom': 'NYSE:JWN',
  'gap': 'NYSE:GPS',
  'nike': 'NYSE:NKE',
  'adidas': 'XETR:ADS',
  'lululemon': 'NASDAQ:LULU',
  'starbucks': 'NASDAQ:SBUX',
  'mcdonalds': 'NYSE:MCD',
  'chipotle': 'NYSE:CMG',
  'dominos': 'NYSE:DPZ',
  
  // Healthcare
  'johnson & johnson': 'NYSE:JNJ',
  'j&j': 'NYSE:JNJ',
  'pfizer': 'NYSE:PFE',
  'moderna': 'NASDAQ:MRNA',
  'unitedhealth': 'NYSE:UNH',
  'cvs health': 'NYSE:CVS',
  'abbvie': 'NYSE:ABBV',
  'merck': 'NYSE:MRK',
  'eli lilly': 'NYSE:LLY',
  'bristol myers': 'NYSE:BMY',
  'bristol-myers': 'NYSE:BMY',
  'abbott': 'NYSE:ABT',
  'medtronic': 'NYSE:MDT',
  'thermo fisher': 'NYSE:TMO',
  
  // Auto
  'ford': 'NYSE:F',
  'general motors': 'NYSE:GM',
  'gm': 'NYSE:GM',
  'toyota': 'NYSE:TM',
  'honda': 'NYSE:HMC',
  'volkswagen': 'XETR:VOW3',
  'stellantis': 'NYSE:STLA',
  'rivian': 'NASDAQ:RIVN',
  'lucid': 'NASDAQ:LCID',
  'nio': 'NYSE:NIO',
  'byd': 'HKEX:1211',
  
  // Energy
  'exxon': 'NYSE:XOM',
  'exxonmobil': 'NYSE:XOM',
  'chevron': 'NYSE:CVX',
  'conocophillips': 'NYSE:COP',
  'marathon': 'NYSE:MPC',
  'valero': 'NYSE:VLO',
  'occidental': 'NYSE:OXY',
  'shell': 'NYSE:SHEL',
  'bp': 'NYSE:BP',
  'total': 'NYSE:TTE',
  'totalenergies': 'NYSE:TTE',
  
  // Airlines
  'delta': 'NYSE:DAL',
  'united': 'NASDAQ:UAL',
  'american airlines': 'NASDAQ:AAL',
  'southwest': 'NYSE:LUV',
  'jetblue': 'NASDAQ:JBLU',
  'alaska': 'NYSE:ALK',
  'spirit': 'NYSE:SAVE',
  
  // Entertainment
  'disney': 'NYSE:DIS',
  'walt disney': 'NYSE:DIS',
  'warner bros': 'NASDAQ:WBD',
  'paramount': 'NASDAQ:PARA',
  'comcast': 'NASDAQ:CMCSA',
  'roku': 'NASDAQ:ROKU',
  'amc': 'NYSE:AMC',
  
  // Crypto-related
  'microstrategy': 'NASDAQ:MSTR',
  'marathon digital': 'NASDAQ:MARA',
  'riot': 'NASDAQ:RIOT',
  'riot platforms': 'NASDAQ:RIOT',
  'hut 8': 'NASDAQ:HUT',
  'cleanspark': 'NASDAQ:CLSK',
  
  // Other Major Companies
  'coca cola': 'NYSE:KO',
  'coca-cola': 'NYSE:KO',
  'coke': 'NYSE:KO',
  'pepsi': 'NASDAQ:PEP',
  'pepsico': 'NASDAQ:PEP',
  'procter & gamble': 'NYSE:PG',
  'p&g': 'NYSE:PG',
  '3m': 'NYSE:MMM',
  'boeing': 'NYSE:BA',
  'lockheed': 'NYSE:LMT',
  'lockheed martin': 'NYSE:LMT',
  'raytheon': 'NYSE:RTX',
  'northrop': 'NYSE:NOC',
  'northrop grumman': 'NYSE:NOC',
  'general electric': 'NYSE:GE',
  'ge': 'NYSE:GE',
  'caterpillar': 'NYSE:CAT',
  'deere': 'NYSE:DE',
  'john deere': 'NYSE:DE',
  'ups': 'NYSE:UPS',
  'fedex': 'NYSE:FDX',
  'verizon': 'NYSE:VZ',
  'at&t': 'NYSE:T',
  'att': 'NYSE:T',
  't-mobile': 'NASDAQ:TMUS',
  'tmobile': 'NASDAQ:TMUS'
}

// Market-related keywords that indicate user wants stock/market information
const marketKeywords = [
  'stock', 'share', 'price', 'market', 'trading', 'trade', 'invest',
  'ticker', 'chart', 'technical analysis', 'market cap', 'valuation',
  'earnings', 'revenue', 'profit', 'loss', 'p/e', 'dividend',
  'performance', 'quote', '$', 'nasdaq', 'nyse', 'doing', 'up', 'down'
]

// Function to detect company ticker from text - STRICT VERSION
export function detectCompanyTicker(text: string): string | null {
  const lowerText = text.toLowerCase()
  
  // First check if the query is actually about market/stock information
  const isMarketQuery = marketKeywords.some(keyword => lowerText.includes(keyword))
  
  // Also check for common patterns like "how is X doing"
  const marketPatterns = [
    /how\s+is\s+\w+\s+doing/i,
    /what('s|\s+is)\s+\w+\s+stock/i,
    /\$[A-Z]+/  // Stock symbols with $
  ]
  
  const hasMarketPattern = marketPatterns.some(pattern => pattern.test(text))
  
  // If not a market query, return null
  if (!isMarketQuery && !hasMarketPattern) {
    return null
  }
  
  // Check for direct ticker mentions (e.g., $AAPL, AAPL stock, NASDAQ:AAPL)
  const tickerPatterns = [
    /\$([A-Z]{1,5})\b/,           // $AAPL
    /\b([A-Z]{1,5})\s+(?:stock|share|price|chart)/i,  // AAPL stock/share/price/chart
    /\b(NYSE|NASDAQ|AMEX):([A-Z.]{1,5})\b/i  // NASDAQ:AAPL
  ]
  
  for (const pattern of tickerPatterns) {
    const match = text.match(pattern)
    if (match) {
      if (pattern.source.includes('NYSE|NASDAQ')) {
        return match[0].toUpperCase()
      } else if (match[1]) {
        const ticker = match[1].toUpperCase()
        // Validate it's a known ticker
        const foundTicker = Object.values(companyTickerMap).find(t => t.includes(ticker))
        if (foundTicker) {
          return foundTicker
        }
      }
    }
  }
  
  // Check for explicit company name + market keyword combinations
  // Sort entries by length (longer names first) to avoid partial matches
  const sortedEntries = Object.entries(companyTickerMap).sort((a, b) => b[0].length - a[0].length)
  
  for (const [company, ticker] of sortedEntries) {
    // Escape special regex characters in company name
    const escapedCompany = company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    
    // Check if the query mentions this company with market context
    // More flexible pattern: company name anywhere in text with market keywords
    const companyRegex = new RegExp(`\\b${escapedCompany}\\b`, 'i')
    
    if (companyRegex.test(lowerText)) {
      return ticker
    }
  }
  
  return null
}