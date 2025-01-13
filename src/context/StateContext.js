import React, {createContext, useEffect, useState} from 'react';

import { getViewChat } from '../mobil_api_fetch/GetViewChat';
import {getPricingList} from '../mobil_api_fetch/GetPricingList';

import {storage} from '../components/Storage';

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [state, setState] = useState({
    viewChat: storage.getString('viewChat') === undefined ? [] : JSON.parse(storage.getString('viewChat')),
    selectedAi: storage.getString('selectedAi') === undefined ? [] : JSON.parse(storage.getString('selectedAi')),
    aiTeamList: storage.getString('aiTeamList') === undefined ? [] : JSON.parse(storage.getString('aiTeamList')),
    talkScreenData: [],
    pricingList: storage.getString('pricingList') === undefined ? [] : JSON.parse(storage.getString('pricingList')),
    myAccount: storage.getString('myAccount') === undefined ? [] : JSON.parse(storage.getString('myAccount')),
    htmlContent: '',
  });

  useEffect(() => {
    const asyncLoginedFunc = async () => {
      // Giriş Yapıldığında Çağrılacaklar
      //console.log("state de çağrıldı", await getViewChat());
      const viewChat = await getViewChat(storage.getString('selectedAi') === undefined ? 16 : JSON.parse(storage.getString('selectedAi').id));
      toggleState('viewChat',viewChat);
      storage.set('viewChat',JSON.stringify(viewChat));
      toggleState('pricingList',await getPricingList());
    };
    const asyncUnloginedFunc = async () => {
      // Giriş Yapılmadığında Çağrılacaklar
    };

    storage.getBoolean('islogined') ? asyncLoginedFunc() : asyncUnloginedFunc();
  },[]);

  const toggleState = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <StateContext.Provider value={{ toggleState, state}}>
      {children}
    </StateContext.Provider>
  );
};


