import {storage} from '../components/Storage';

export const postNewChat = async (value) => {
  try {
    const getNewChatResponse = await fetch(`https://aigency.dev/api/mobile/newChat/${value}/${storage.getString('access_token')}`,{
      method: 'POST',
    });
    const getNewChatResponseData = await getNewChatResponse.json();
    console.log("bu yeni sohbet",getNewChatResponseData);
    return getNewChatResponseData;
  }
  catch (error) {
    console.log(error);
  }
}
