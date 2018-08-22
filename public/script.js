



$('.chosen-select').chosen();



function handleYesNoBtn() {
  $('.js-btn-choice').on('click', function(event){
    //console.log(event.currentTarget.value);
    //console.log(event);
    //console.log($(this).closest('li').data('bill_uri'));
    const bill_uri = $(this).closest('li').data('bill_uri');
    const sponsor = $(this).closest('li').data('sponsor');
    const value = event.currentTarget.value;
    $.post("/save-bills", {suggest: bill_uri, decision: value, sponsor: sponsor}, function(result){
        console.log(result);
        let a = result.sponsors;
        $('#newDiv').empty();
          for(key in a){
            console.log(key) 
            console.log('yay',a[key]['yay'])
            console.log('nay',a[key]['nay'])
           $('#newDiv').append(key, ' yay ',a[key]['yay'], ' nay ',a[key]['nay'])
          }
           
        
        i++;
        nextQuestion();
    });
  });
}
let i = 0;

function nextQuestion(){
  $('li.js-bill').removeClass('show');
  $('li.js-bill').eq(i).addClass('show');
  console.log(i);
}

function handleClick(){
  $('#show-bills').on('click', function(event){
    nextQuestion();
  });
}



$(handleYesNoBtn);





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
