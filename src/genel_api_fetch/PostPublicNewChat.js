export const postPublicNewChat = async (chatId) => {
  try {
    const postPublicNewChatResponse = await fetch('https://aigency.dev/api/v2/newChat/60/grFHgrenB5yOxQXJbYKNHxJSSE5YKwfs',{
      method: 'POST',
    })
    const postPublicNewChatResponseData = await postPublicNewChatResponse.json();
    console.log("bu yeni sohbet",postPublicNewChatResponseData);
    return postPublicNewChatResponseData;
  }
  catch (error) {
    console.log(error);
  }
};
