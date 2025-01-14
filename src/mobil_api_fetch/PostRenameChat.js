import {storage} from '../components/Storage';

export const postRenameChat = async (chat_id, renameChatText) => {
    console.log(1,chat_id);
    console.log(2,renameChatText);
    try {
        const postRenameChatResponse = await fetch(`https://aigency.dev/api/mobile/rename-chat/${chat_id}/${storage.getString('access_token')}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                new_name: renameChatText,
            }),
        });
        const postRenameChatResponseData = await postRenameChatResponse.json();
        console.log('yeni isim',postRenameChatResponseData);
        return postRenameChatResponseData;
    }
    catch (error) {
        console.log("resume_chat",error);
    }
};
