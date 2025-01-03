import {storage} from '../components/Storage';

export const postSendMessage = async (message,chat_id,selectedFiles) => {
  const formData = new FormData();
  formData.append('chat_id', chat_id);
  formData.append('message', message);
  selectedFiles.length > 0 ? selectedFiles.forEach(file => {
    formData.append('attachements',{
      uri: file.uri,
      type: file.type,
      name: file.name,
    });
  }) : '' ;
  try {
    const postSendMessageResponse = await fetch(`https://aigency.dev/api/mobile/sendMessage/${storage.getString('access_token')}`,{
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
