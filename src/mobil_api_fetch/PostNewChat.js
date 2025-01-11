import {storage} from '../components/Storage';

export const postNewChat = async (ai_id,myMessage) => {
  try {
    const getNewChatResponse = await fetch(`https://aigency.dev/api/mobile/newChat/${ai_id}/${storage.getString('access_token')}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: myMessage,
      }),
    });
    const getNewChatResponseData = await getNewChatResponse.json();
    console.log("bu yeni sohbet",getNewChatResponseData);
    return getNewChatResponseData;
  }
  catch (error) {
    console.log("new_chat",error);
  }
}
