// api/gstin.js - Deploy this to Vercel
export default async function handler(req, res) {
  // Enable CORS for your bot
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }
  
  const { pan } = req.query;
  
  if (!pan || pan.length !== 10) {
    return res.status(400).json({ 
      error: 'Invalid PAN. Please provide a 10-character PAN (e.g., ?pan=ABCDE1234F)' 
    });
  }
  
  const upperPan = pan.toUpperCase();
  const razorpayUrl = `https://razorpay.com/api/gstin/pan/${upperPan}`;
  
  try {
    const response = await fetch(razorpayUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GSTBot/1.0)',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Razorpay API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Format response nicely for your bot
    const formatted = {
      success: true,
      pan: data.pan,
      count: data.count,
      gstins: data.items.map(item => ({
        gstin: item.gstin,
        status: item.auth_status,
        state: item.state
      })),
      raw: data
    };
    
    return res.status(200).json(formatted);
    
  } catch (error) {
    console.error('GSTIN lookup failed:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch GSTIN details. The PAN might be invalid or Razorpay API is blocked.' 
    });
  }
}