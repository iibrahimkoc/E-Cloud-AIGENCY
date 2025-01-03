import {storage} from '../components/Storage';

export const getPricingList = async () => {
  try {
    const pricingListResponse = await fetch(`https://aigency.dev/api/mobile/pricing-list/${storage.getString('access_token')}`,{
      method: 'GET',
    });
    const pricingListResponseData = await pricingListResponse.json();
    storage.set('pricingList', JSON.stringify(pricingListResponseData));
    console.log(pricingListResponseData);
    return pricingListResponseData;
  }
  catch (error) {
    console.log('PricingList API Hatası: ',error);
  }
};
