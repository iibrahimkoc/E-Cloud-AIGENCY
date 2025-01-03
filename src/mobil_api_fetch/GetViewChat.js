import {storage} from '../components/Storage';

export const getViewChat = async  (selectedAi) => {
  try {
    const getViewChatResponse = await fetch(`https://aigency.dev/api/mobile/view-chats/${selectedAi}/${storage.getString('access_token')}`, {
      method: 'GET',
    });

    const getViewChatResponseData = await getViewChatResponse.json();
    if (Array.isArray(getViewChatResponseData)) {
      const shortedData = getViewChatResponseData.sort((a, b) => new Date(b.last_message_date) - new Date(a.last_message_date));


      const viewChatDate = {
        today: [],
        yesterday: [],
        last7day: [],
      };

      const nowDate = new Date().getDate();
      shortedData.map((item) => {
        const lastDate = new Date(item.last_message_date).getDate();
        if(nowDate - lastDate === 0) {
          viewChatDate.today.push(item);
        }
        else if(nowDate - lastDate === 1) {
          viewChatDate.yesterday.push(item);
        }
        else {
          viewChatDate.last7day.push(item);
        }
      });
      //console.log("ahaaa",Array(viewChatDate));
      storage.set('viewChat', JSON.stringify(viewChatDate));
      console.log("verim bu daha \n\n",viewChatDate);
      return viewChatDate;
    } else {
      throw new Error("API'den beklenmeyen bir veri yapısı döndü.");
    }
  }
  catch (error) {
    console.log('GetViewChat API Hatası: ',error);
  }
};



