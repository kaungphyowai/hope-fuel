import { useSearchParams } from 'next/navigation'

export default async function createFormSubmit(event, currency, supportRegion ,files, userInfo, setloading, formFillingPerson, setAmountValidate, setmonthValidate, setmanyChatValidate,fileExist, setfileExist) {
  
  event.preventDefault();
    setAmountValidate(false);
    setmonthValidate(false)
    setmanyChatValidate(false)
    setfileExist(true)
    setloading(true)
    
    const data = new FormData(event.currentTarget);
    console.log("Data From createFormSubmit: ", data.getAll());
    const amount = data.get("amount")
    const month = data.get("month");
    const manychat = data.get("manyChat")
    const wallet = JSON.parse(data.get("wallets"))
    const notes = data.get("notes")
    const contactLink = data.get("contactLink")
    //validate month and amount
    if(!/^\d+$/g.test(amount))
    {
      setAmountValidate(true);
      setloading(false)
      return;
    }
    if(!/^\d+$/g.test(month))
    {
      setmonthValidate(true);
      setloading(false)
      return;
    }
    if(!/^\d+$/g.test(manychat))
    {
      setmanyChatValidate(true);
      setloading(false)
      return;
    }

    //check if file exist
    if(files.length == 0)
    {
      setfileExist(false);
      setloading(false)
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // // submitpaymentinformation
    console.log("UserInfo",userInfo);
    let raw = JSON.stringify({
      "customerName": userInfo.name, 
      "customerEmail": userInfo.email,
      "agentID": 1,
      "supportRegionID": 1,
      "manyChatID": manychat,
      "contactPhone": "123",
      "amount": amount,
      "month": month,
      "note": notes,
      "walletId": 1
    })
    let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };
    let answ = await fetch('/api/submitPayment/', requestOptions)
    let {status} =  await answ.json()
    console.log(status)
    location.reload()
  }
// var raw = JSON.stringify({
//   "records": [
//     {
//       "fields": {
//         "Name": userInfo.name,
//         "Email": userInfo.email,
//         "Status":  '၁ - ဖောင်တင်သွင်း',
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

// var requestOptions = {
//   method: 'POST',
//   headers: myHeaders,
//   body: raw,
//   redirect: 'follow'
// };

//  let response = await fetch(`/api/createNewUser`, requestOptions)

//  let json = await response.json();
//  location.reload();


