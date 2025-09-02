// Quick test to verify API is working
const testAPI = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/fire-cache/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'What is Next.js?'
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      return;
    }

    console.log('✅ API is working! Response:', response.status);
    
    // Read a bit of the stream to verify it's working
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const { value } = await reader.read();
    const chunk = decoder.decode(value);
    console.log('First chunk:', chunk.substring(0, 100) + '...');
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
};

console.log('Testing API endpoint...');
testAPI();