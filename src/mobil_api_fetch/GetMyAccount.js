import {storage} from '../components/Storage';

export const getMyAccount = async () => {
  try {
    const getMyAccountResponse = await fetch(`https://aigency.dev/api/mobile/my-account/${storage.getString('access_token')}`,{
      method: 'GET',
    });

    const getMyAccountResponseData = await getMyAccountResponse.json();
    storage.set('myAccount', JSON.stringify(getMyAccountResponseData));
    console.log("hesap: ",getMyAccountResponseData);
    return getMyAccountResponseData;
  }
  catch (error) {
    console.log("my_account",error);
  }
};
