
export const postRegister = async (name,surname,email,password) => {
  try {
    const postRegisterResponse = await fetch('https://aigency.dev/api/mobile/register',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        surname: surname,
        email: email,
        password: password,
      }),
    });
    return await postRegisterResponse.json();
  }
  catch (error) {
    console.log("register",error);
  }
}
