import * as axios from 'axios'


class Api {

  constructor(){
    this.api_token = null
    this.api_url = 'https://hansonlandapps.herokuapp.com'
    this.client = null
  }

  async create(){
      try{
        this.api_token = localStorage.getItem('token')
        // console.log('read api')
      }catch(error){
        console.log('error', error)
      }
  

  let headers = {
            'Content-Type':'application/json',
            'Accept':'application/json'
        }

  if(this.api_token){
    headers['x-access-token'] = this.api_token
  }

  this.client = axios.create({
    baseURL : this.api_url,
    timeout : 10000,
    headers : headers
  })

}
  
  getClient(){
    return this.client
  }

}

export default Api




// export function getMessages() {
//   return fetch(API_URL)
//     .then(res => res.json())
//     .then(messages => {
//       const haveSeenLocation = {};
//       return messages.reduce((all, message) => {
//         const key = `${message.latitude.toFixed(3)}${message.longitude.toFixed(3)}`;
//         if (haveSeenLocation[key]) {
//           haveSeenLocation[key].otherMessages = haveSeenLocation[key].otherMessages || [];
//           haveSeenLocation[key].otherMessages.push(message);
//         } else {
//           haveSeenLocation[key] = message;
//           all.push(message);
//         }
//         return all;
//       }, []);
//     });
// }

export function getLocation() {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    }, () => {      
      resolve(fetch('https://ipapi.co/json')
        .then(res => res.json())
        .then(location => {
          return {
            lat: location.latitude,
            lng: location.longitude
          };
        }));
    });
  });
}

// export function sendMessage(message) {
//   return fetch(API_URL, {
//     method: 'POST',
//     headers: {
//       'content-type': 'application/json',
//     },
//     body: JSON.stringify(message)
//   }).then(res => res.json());
// }
