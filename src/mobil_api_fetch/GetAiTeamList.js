import {storage} from '../components/Storage';

export const getAiTeamList = async () => {
  try {
    const aiListResponse = await fetch(`https://aigency.dev/api/mobile/ai-team-list/${storage.getString('access_token')}`,{
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      },
    });
    const aiTeamListResponseData = await aiListResponse.json();
    storage.set('aiTeamList', JSON.stringify(aiTeamListResponseData));
    storage.getBoolean('isLogined') === true ? storage.getString('selectedAi') === undefined ? storage.set('selectedAi', JSON.stringify(aiTeamListResponseData[0])) : '' : '';
    //console.log('aiTemListReponseData: ',aiTeamListResponseData[0]);
    return aiTeamListResponseData;
  }
  catch(error) {
    console.log(error);
  }
};
