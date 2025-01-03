import {storage} from '../components/Storage';

export const postResumeChat = async (value) => {
  try {
    const getResumeChatResponse = await fetch(`https://aigency.dev/api/mobile/resumeChat/${value}/${storage.getString('access_token')}`,{
      method: 'POST',
    });
    const getResumeChartResponseData = await getResumeChatResponse.json();
    console.log('veriiiiiii',getResumeChartResponseData);
    return getResumeChartResponseData;
  }
  catch (error) {
    console.log(error);
  }
};
