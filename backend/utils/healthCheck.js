export async function checkCohereHealth() {
  try {
    // Simulate real-world API health check
    return {
      status: 'healthy',
      suggestion: ''
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      suggestion: 'Try again later. AI service is temporarily down.'
    };
  }
}
