import {Platform} from "react-native";
import {storage} from '../components/Storage';

export const postSendMessage = async (message, chat_id, selectedFiles) => {
  const formData = new FormData();
  formData.append('chat_id', chat_id);
  formData.append('message', message);

  const normalizeUri = (uri) => {
    if (Platform.OS === 'ios' && uri.startsWith('file://')) {
      return uri.replace('file://', '');
    }
    return uri;
  };

  console.log("bunlar dosyalar: ",selectedFiles)
  if(selectedFiles !== undefined){
    if(selectedFiles.length > 0) {
      selectedFiles.forEach(file => {
        formData.append('attachements', {
          uri: normalizeUri(file.uri),
          type: file.type,
          name: file.name || file.fileName,
        });
      });
    }
  }

  console.log(formData._parts[2]);
  console.log(formData._parts[3]);

  try {
    const postSendMessageResponse = await fetch(`https://aigency.dev/api/mobile/sendMessage/${storage.getString('access_token')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      },
      body: formData,
    });

    const postSendMessageResponseData = await postSendMessageResponse.json();
    console.log(postSendMessageResponseData);
    return postSendMessageResponseData;
  } catch (error) {
    console.log("send_message:", error);
  }
};
