export function selectRelevantContent(content: string, query: string, maxLength = 2000): string {
  const paragraphs = content.split('\n\n').filter(p => p.trim())
  
  // Always include the first paragraph (introduction)
  const intro = paragraphs.slice(0, 2).join('\n\n')
  
  // Extract keywords from the query (simple approach)
  const keywords = query.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3) // Skip short words
    .filter(word => !['what', 'when', 'where', 'which', 'how', 'why', 'does', 'with', 'from', 'about'].includes(word))
  
  // Find paragraphs that contain keywords
  const relevantParagraphs = paragraphs.slice(2, -2) // Skip intro and conclusion
    .map((paragraph, index) => ({
      text: paragraph,
      score: keywords.filter(keyword => 
        paragraph.toLowerCase().includes(keyword)
      ).length,
      index
    }))
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // Take top 3 most relevant paragraphs
    .sort((a, b) => a.index - b.index) // Restore original order
    .map(p => p.text)
  
  // Always include the last paragraph if it exists (conclusion)
  const conclusion = paragraphs.length > 2 ? paragraphs[paragraphs.length - 1] : ''
  
  // Combine all parts
  let result = intro
  if (relevantParagraphs.length > 0) {
    result += '\n\n' + relevantParagraphs.join('\n\n')
  }
  if (conclusion) {
    result += '\n\n' + conclusion
  }
  
  // Ensure we don't exceed max length
  if (result.length > maxLength) {
    result = result.substring(0, maxLength - 3) + '...'
  }
  
  return result
}