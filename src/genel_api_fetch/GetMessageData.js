import { MMKV } from 'react-native-mmkv';
const storage = new MMKV();

export const getMessageData = async () => {
  try {
    const lastMessageResponse = await fetch('https://aigency.dev/api/v2/view-chats/16/'+'grFHgrenB5yOxQXJbYKNHxJSSE5YKwfs',{
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      },
    });
    const lastMessageResponseData = await lastMessageResponse.json();
    console.log('aiListReponseData: ',lastMessageResponseData);
    storage.set('lastMessageResponse', JSON.stringify(lastMessageResponseData));
    //return lastMessageResponseData;
  }
  catch(error) {
    console.log(error);
  }
};
