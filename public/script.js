// // console.log('hello');
// const APIKEY = `AIzaSyDnjF_rS5ujP9qBRHEvwGLrruPQ2g3EVDA`;
// const PROPUBKEY = `xKkfjJ7GGJhrI9cqvaQBPZRgXcuTrxopTj8KvMg`;
//
// // const FINKEY = `jyN6PW1PA5FMD66QRAJ2nanubyFkiSk0BUDtQi2g`;
//
// fetch(`https://www.googleapis.com/civicinfo/v2/elections?key=${APIKEY}`)
// .then(function(response) {
//   return response.json();
// })
// .then(function(myJson) {
//   // console.log(myJson);
// });
//
// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     } else {
//         x.innerHTML = "Geolocation is not supported by this browser.";
//     }
// }
//
// getLocation();
//
//
// function showPosition(position){
//   // console.log(position);
//   fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${APIKEY}`)
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(myJson) {
//     // console.log(myJson);
//     findRepresentatives(myJson.results[0].formatted_address);
//   });
// }
//
// function findRepresentatives(address){
//   // console.log(typeof address);
//   fetch(`https://www.googleapis.com/civicinfo/v2/representatives?key=${APIKEY}&address=${address}`)
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(myJson) {
//     console.log(myJson);
//     // console.log(myJson.normalizedInput.state);
//     getListOfMembers(myJson.normalizedInput.state);
//   });
// }
//
// function getListOfMembers(state) {
//   fetch(`https://api.propublica.org/congress/v1/members/senate/${state}/current.json`,
//   {
//     headers: {'X-API-Key': PROPUBKEY}
//   })
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(myJson) {
//     console.log(myJson);
//     myJson.results.forEach(senator => {
//       getBillByMemberID(senator.id);
//     });
//   });
// }
//
// function getBillByMemberID(id){
//   fetch(`https://api.propublica.org/congress/v1/members/${id}/bills/introduced.json`,
//   {
//     headers: {'X-API-Key': PROPUBKEY}
//   })
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(myJson) {
//     console.log(myJson);
//     myJson.results[0].bills.forEach(bill => {
//       getBillSummary(bill.bill_uri);
//     });
//   });
// }
//
// function getBillSummary(uri){
//   fetch(uri,
//   {
//     headers: {'X-API-Key': PROPUBKEY}
//   })
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(myJson) {
//     console.log(myJson);
//     displayBillSummary(myJson.results);
//   });
// }
//
// function displayBillSummary(array){
//   console.log(array);
//   $('.js-bill-summary').append(
//     `<h2>${array[0].sponsor}</h2>
//     <h4>${array[0].title}</h4>
//     <p>${array[0].summary_short}</p>
//     <a class="js-info">more info</a>
//     <button>yes</button>
//     <button>no</button>
//   <hr>`);
// }
//
// function handleNextBill(array){
//   let count = 1;
//   $('.js-btn-choice').on('click', function(event){
//     // console.log(array[1]);
//     $('.js-bill-summary').text(array[count].summary);
//     count++;
//   });
// }
//
//
//
//
//
//
// //
// // fetch(`https://api.propublica.org/congress/v1/members/P000592.json`,
// // {
// //   headers: {'X-API-Key': PROPUBKEY}
// // })
// // .then(function(response) {
// //   return response.json();
// // })
// // .then(function(myJson) {
// //   // console.log(myJson);
// // });
// //
// // // https://api.propublica.org/congress/v1/members/{member-id}/votes.json
// //
// // fetch(`https://api.propublica.org/congress/v1/members/P000592/votes.json`,
// // {
// //   headers: {'X-API-Key': PROPUBKEY}
// // })
// // .then(function(response) {
// //   return response.json();
// // })
// // .then(function(myJson) {
// //   // console.log(myJson);
// // });
// //
// // fetch(`https://api.propublica.org/congress/v1/115/house/sessions/2/votes/379.json`,
// // {
// //   headers: {'X-API-Key': PROPUBKEY}
// // })
// // .then(function(response) {
// //   return response.json();
// // })
// // .then(function(myJson) {
// //   // console.log(myJson);
// // });
// //
// // fetch(`https://api.propublica.org/congress/v1/statements/latest.json`,
// // {
// //   headers: {'X-API-Key': PROPUBKEY}
// // })
// // .then(function(response) {
// //   return response.json();
// // })
// // .then(function(myJson) {
// //   // console.log(myJson);
// // });
// //
// // fetch(`https://api.propublica.org/congress/v1/115/bills/hr5515.json`,
// // {
// //   headers: {'X-API-Key': PROPUBKEY}
// // })
// // .then(function(response) {
// //   return response.json();
// // })
// // .then(function(myJson) {
// //   // console.log(myJson);
// //   displayBillSummary(myJson.results)
// // });
// //
// //
// // function displayBillSummary(array){
// //   // console.log(array[0].summary);
// //   $('.js-bill-summary').text(array[0].summary);
// //   handleNextBill(array);
// // }
// //
// // function handleNextBill(array){
// //   let count = 1;
// //   $('.js-btn-choice').on('click', function(event){
// //     // console.log(array[1]);
// //     $('.js-bill-summary').text(array[count].summary);
// //     count++;
// //   });
// // }
// //
//
//
//
//
//
//
//
//
// //
