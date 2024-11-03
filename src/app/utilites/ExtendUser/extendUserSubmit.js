export default async function extendUserSubmit(
  event,
  userInfo,
  currency,
  supportRegion,
  files,
  setloading,
  formFillingPerson,
  setAmountValidate,
  setmonthValidate,
  setmanyChatValidate,
  fileExist,
  setfileExist,
  wallets,
  agentId,
) {
  event.preventDefault();
  // setloading(true)
  setAmountValidate(false);
  setmonthValidate(false);
  setmanyChatValidate(false);
  const data = new FormData(event.currentTarget);
  const amount = data.get('amount');
  const month = data.get('month');
  const manychat = data.get('manychat');
  const wallet = JSON.parse(data.get('wallets'));
  const notes = data.get('notes');
  const contactLink = data.get('contactLink');
  let cardId = String(userInfo['prf_no']);
  //if cardID exist for the extend user
  if (cardId) {
    const regexp = /\d+/g;
    cardId = cardId.match(regexp)[0];
    cardId = parseInt(cardId);
  }

  const supportRegionID = supportRegion.SupportRegionID;
  let expireDate = userInfo['expire_date'];
  if (expireDate) {
    expireDate = new Date(userInfo['expire_date']);
  }

  let tmp = {
    amount,
    month,
    manychat,
    agentId,
    wallet,
    notes,
    contactLink,
    supportRegionID,
    files,
    expireDate: expireDate,
    cardID: cardId,
  };
  console.log('tmp from extendUserSubmit:', tmp);

  //validate month and amount
  if (!/^\d+$/g.test(amount)) {
    setAmountValidate(true);
    setloading(false);
    return;
  }
  if (!/^\d+$/g.test(month)) {
    setmonthValidate(true);
    setloading(false);
    return;
  }
  if (!/^\d+$/g.test(manychat)) {
    setmanyChatValidate(true);
    setloading(false);
    return;
  }

  //check if file exist
  if (files.length == 0) {
    setfileExist(false);
    setloading(false);
    return;
  }
  // console.log("First URL of Image: " + files[0].href)

  // // check if the user exist in mysql
  let myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    name: userInfo.name,
    email: userInfo.email,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  let res = await fetch('/api/InCustomerTable/', requestOptions);
  let ans = await res.json();

  // // if the user already in mysql table
  if (Object.hasOwn(ans, 'Name')) {
    console.log('this is here');

    // create a note
    raw = JSON.stringify({
      note: notes,
      agentID: 1,
    });
    requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    let note = await fetch('/api/insertNote/', requestOptions);
    note = await note.json();

    myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    console.log(ans);
    raw = JSON.stringify({
      customerId: ans['CustomerId'],
      supportRegionId: supportRegionID,
      walletId: wallet,
      amount: amount,
      agentId: agentId,
      noteId: note['id'],
      transactionDate: new Date(),
      month: month,
      screenShot: files.map((url) => {
        return { url: url.href };
      }),
      cardId: cardId,
    });

    console.log('Raw:' + raw);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    let response = await fetch(`/api/extendUser`, requestOptions);
    console.log('response from extendUser API: ', response);
    location.reload();
  } // treat this as new customer but get the requried user information from airtable
  else {
    //   // // get customer information from airtable using name and email
    //   // raw = JSON.stringify({
    //   //   "name": userInfo.name,
    //   //   "email": userInfo.email
    //   // })
    //   // requestOptions = {
    //   //   method: 'POST',
    //   //   headers: myHeaders,
    //   //   body: raw,
    //   //   redirect: 'follow'
    //   // };

    //   // let response = await fetch('/api/checkuser' , requestOptions)
    //   // response = response.json()

    //   // submitpaymentinformation
    let raw = JSON.stringify({
      customerName: userInfo.name,
      customerEmail: userInfo.email,
      agentId: agentId,
      supportRegionId: supportRegionID,
      manyChatId: manychat,
      contactLink: contactLink,
      amount: amount,
      month: month,
      note: notes,
      walletId: wallet,
      screenShot: files.map((url) => {
        return { url: url.href };
      }),
      expireDate: expireDate,
      cardId: cardId,
    });
    requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    let answ = await fetch('/api/submitPaymentolduser/', requestOptions);
    let { status } = await answ.json();
    console.log(status);
    location.reload();
  }

  // var raw = JSON.stringify({
  //   "records": [
  //     {
  //       "fields": {
  //         "Name": userInfo.name,
  //         "Email": userInfo.email,
  //         "Status":  "၁ - ဖောင်တင်သွင်း",
  //         "Currency":  currency,
  //         "Amount": parseInt(amount),
  //         "Month": parseInt(month),
  //         "support_region": supportRegion,
  //         "notes": notes,
  //         "contact_person_link": contactLink,
  //         "wallet": [wallet.id],
  //         "screenshot": files.map((url) => {return {url: url.href}}),
  //         "notion_form_filled_person": formFillingPerson,
  //         "manychat_id": parseInt(manychat)
  //       }
  //     }
  //   ]
  // });
  // console.log(raw)

  // var requestOptions = {
  //   method: 'POST',
  //   headers: myHeaders,
  //   body: raw,
  //   redirect: 'follow'
  // };

  //   let response = await fetch(`/api/createNewUser`, requestOptions)
  //   location.reload();
}
