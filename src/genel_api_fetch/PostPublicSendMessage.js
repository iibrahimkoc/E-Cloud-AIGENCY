export const postPublicSendMessage = async (message,chat_id) => {
  const formData = new FormData();
  formData.append('chat_id', chat_id);
  formData.append('message', message);
  try {
    const postSendMessageResponse = await fetch('https://aigency.dev/api/v2/sendMessage/grFHgrenB5yOxQXJbYKNHxJSSE5YKwfs',{
      method: 'POST',
      body: formData,
    });
    const postSendMessageResponseData = await postSendMessageResponse.json();
    console.log(postSendMessageResponseData);
    return postSendMessageResponseData;
  }
  catch (error) {
    console.log(error);
  }
};
