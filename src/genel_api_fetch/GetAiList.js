export const getAiList = async () => {
  try {
    const aiListResponse = await fetch('https://aigency.dev/api/v2/ai-team-list/' + 'grFHgrenB5yOxQXJbYKNHxJSSE5YKwfs',{
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      },
    });
    const aiListResponseData = await aiListResponse.json();
    console.log('aiListReponseData: ',aiListResponseData);
    return aiListResponseData;
  }
  catch(error) {
    console.log(error);
  }
};
