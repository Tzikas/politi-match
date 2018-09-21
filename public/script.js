

$('.chosen-select').chosen();



function handleYesNoBtn() {
  $('ul').on('click','.js-btn-choice', function(event){
    //// // console.log(event.currentTarget.value);
    //// console.log(event);
    //console.log($(this).closest('li').data('bill_uri'));
    const bill_uri = $(this).closest('li').data('bill_uri');
    const sponsor = $(this).closest('li').data('sponsor');
    const sponsor_state = $(this).closest('li').data('sponsor_state');
    const value = event.currentTarget.value;
    let newBill = {suggest: bill_uri, decision: value, sponsor: sponsor, state: sponsor_state};
    $.post("/save-bills", newBill, function(result){
        console.log('RESULT', result);
        
        currentUser.votes.push(newBill);

        let stateObjPercents = matchPercent(currentUser.votes, "state");
        let newHtml = displayData(stateObjPercents);
        $('#newDiv').html(newHtml);
           
        
        i++;
        nextQuestion();
    });
  });
}
let i = 0;

function nextQuestion(){
  $('li.js-bill').removeClass('show');
  $('li.js-bill').eq(i).addClass('show');
  //console.log(i);
}

function handleClick(){
  $('#show-bills').on('click', function(event){
    nextQuestion();
  });
}



$(handleYesNoBtn);

// ***************************************

var map = AmCharts.makeChart("mapdiv",{
  type: "map",
  theme: "light",
  panEventsEnabled : true,
  backgroundColor : "#535364",
  backgroundAlpha : 1,
  zoomControl: {
  zoomControlEnabled : true
  },
  dataProvider : {
  map : "usaHigh",
  getAreasFromMap : true,
  areas : [],
  },
  areasSettings : {
  autoZoom : true,
  color : "#B4B4B7",
  colorSolid : "#84ADE9",
  selectedColor : "#84ADE9",
  outlineColor : "#666666",
  rollOverColor : "#9EC2F7",
  rollOverOutlineColor : "#000000"
  }
  });
 
  let Bills = [];
  map.addListener("clickMapObject", function(event) {
      //console.log(event);
      //console.log(event.mapObject.id.split('-')[1]);
      $(".show-question").toggleClass("show");
      let st = event.mapObject.id.split('-')[1];
  
      $.post("/test", {state: st}, function(result){
        //console.log("BILLS", result);
        Bills = result;
        let billHtml = '';
        result.bills.forEach(function(bill){
          billHtml += `<li class="js-bill" data-bill_uri="${bill.results[0].bill_uri}" data-sponsor="${bill.results[0].sponsor}" data-sponsor_state="${bill.results[0].sponsor_state}">
            <h4>${bill.results[0].title}</h4>
                <div>${bill.results[0].summary}</div>

                <div>${bill.results[0].summary_short}</div>
            
            <p>
                ${bill.results[0].sponsor}
            </p>
            <p>
                ${bill.results[0].sponsor_state}
            </p>
            <p>
                ${bill.results[0].latest_major_action}
            </p>
            <div>
                <button type="button" name="button" class="js-btn-choice js-btn-yes" value="yay">YES</button>
                <button type="button" name="button" class="js-btn-choice js-btn-no" value="nay">NO</button>
            </div>
            <br><br><br>
        </li>`;
        });
        //console.log(billHtml);
        $(".bills-ul").html(billHtml);
        nextQuestion();
      });
  });

// *********************************************

let reference = "state";
$(".match-btn").on('click', function(event){
 console.log('CLICKED MATCH', currentUser);
  reference === "state" ? reference = "sponsor" : reference = "state";
  $(this).html(reference + ` <i class="percent icon"></i>`);
  let stateObjPercents = matchPercent(currentUser.votes, reference);
  let newHtml = displayData(stateObjPercents);
  $('#newDiv').html(newHtml);
});

$(document).ready(function(){
  let stateObjPercents = matchPercent(currentUser.votes, reference);
  let newHtml = displayData(stateObjPercents);
  $('#newDiv').html(newHtml);
});


// ******************************************

function matchPercent(votes = [], ref){
  // Rounded(# of bills user voted yes to/# of bills voted) = Match %
  // req.user.votes == Array
  // console.log('votes: ', votes, body);
  let yay = 0;
  let nay = 0;
  let items = {};
  for(let i=0;i<votes.length;i++){
   let vote = votes[i];
   // console.log('vote', vote, vote.decision);
   if(vote.decision === 'yay') yay++;
   if(vote.decision === 'nay') nay++;
   
   if (!(vote[ref] in items)){
       items[vote[ref]] = {yay:0, nay:0}
       items[vote[ref]][vote.decision] = 1   
     } else {
      items[vote[ref]][vote.decision]++
     }

  }
  // console.log(yay, votes.length);
  // console.log('users yay percentage is ', yay/(votes.length));
  console.log(items);
  return items;
}

function displayData(obj) {
  let html = ``;
  for(let key in obj) {
    // console.log((key.yay/(key.nay + key.yay)) * 100);
    let per = Math.ceil((obj[key].yay/ (obj[key].yay + obj[key].nay)*100));
    console.log(key, per );
    html += `<li>${key}: ${per}%</li>`;
  }
  return html;
}