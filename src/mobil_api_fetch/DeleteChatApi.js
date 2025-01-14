import {storage} from '../components/Storage';

export const deleteChatApi = async (chat_id) => {
    try {
        const deleteChatResponse = await fetch(`https://aigency.dev/api/mobile/deleteChat/${chat_id}/${storage.getString('access_token')}`,{
            method: 'Delete',
        });
        const deleteChatResponseData = await deleteChatResponse.json();
        console.log(deleteChatResponseData);
    }
    catch (error) {
        console.log('PricingList API Hatası: ',error);
    }
};
