export default async function checkUserSubmit(
  event,
  setUserExistState,
  setFinishCheck,
  setCreateFormShow,
  setUserInfo,
  setHasPermissonThisMonth,
  userRole,
) {
  event.preventDefault();
  setFinishCheck(true);
  const data = new FormData(event.currentTarget);
  const email = data.get('email').trim();
  const name = data.get('name').trim();

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    name: name,
    email: email,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  // check if the user exist in airtable
  let response = await fetch('/api/checkUser', requestOptions);

  let answer = await response.json();
  let userExist = answer.message;

  setUserInfo({ name: name, email: email });

  // check if the user exist in mysql
  let res = await fetch('/api/InCustomerTable/', requestOptions);
  let ans = await res.json();
  console.log('Inside the check user');
  console.log(userExist);

  //if user exist, get PRF and expire data about user
  if (userExist || Object.hasOwn(ans, 'Name')) {
    //check if the user has permission
    console.log('This is has permission: ');
    let response = await fetch('/api/checkolduserpermission/', requestOptions);
    let bool = await response.json();

    console.log(bool);
    // if the user has not permission this month
    if (!bool) {
      setHasPermissonThisMonth(bool);
      //if user is admin, setUserInfo for just in case
      if (userRole == 'admin') {
        if (userExist) {
          setUserInfo({
            name: name,
            email: email,
            prf_no: answer['prf_no'],
            expire_date: answer['expire_date'][0],
          });
        } else if (Object.hasOwn(ans, 'Name')) {
          setUserInfo({
            name: name,
            email: email,
            prf_no: ans['CardID'],
            expire_date: ans['ExpireDate'],
          });
        }
      }

      return;
    }

    if (Object.hasOwn(ans, 'Name')) {
      setUserInfo({
        name: name,
        email: email,
        prf_no: ans['CardID'],
        expire_date: ans['ExpireDate'],
      });
    } else if (userExist) {
      setUserInfo({
        name: name,
        email: email,
        prf_no: answer['prf_no'],
        expire_date: answer['expire_date'][0],
      });
    }
  }

  // if user don't exist, just create a new user
  setUserExistState(userExist || Object.hasOwn(ans, 'Name'));

  //show the created form if the user don't exist
  setCreateFormShow(!userExist && !Object.hasOwn(ans, 'Name'));
}
