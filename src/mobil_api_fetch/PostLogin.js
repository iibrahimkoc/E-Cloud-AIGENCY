export const postLogin = async (email,password) => {
  try {
    const loginResponse = await fetch('https://aigency.dev/api/mobile/login',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const loginResponseData = await loginResponse.json();
    console.log(loginResponseData);
    return loginResponseData;
  }
  catch (error) {
    console.log('PostLogin API hatası: ',error);
  }
};
