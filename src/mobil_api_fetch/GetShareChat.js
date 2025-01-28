import {storage} from '../components/Storage';

export const getShareChat = async (chat_id) => {
    try {
        const shareChatResponse = await fetch(`https://aigency.dev/api/mobile/share-chat/${chat_id}/${storage.getString('access_token')}`,{
            method: 'GET',
        });
        const shareChatResponseData = await shareChatResponse.json();
        storage.set('shareChatLink', shareChatResponseData.share_link);
        console.log(shareChatResponseData.share_link);
        //return shareChatResponseData;
    }
    catch (error) {
        console.log('shareChat API Hatası: ',error);
    }
};


