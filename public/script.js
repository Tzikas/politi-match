



$('.chosen-select').chosen();



function handleYesNoBtn() {
  $('ul').on('click','.js-btn-choice', function(event){
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
           $('#newDiv').append('<br></br>', key, ' yay ',a[key]['yay'], ' nay ',a[key]['nay'])
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
  areas :
  []
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
 
  map.addListener("clickMapObject", function(event) {
      console.log(event);
      console.log(event.mapObject.id.split('-')[1]);
      let st = event.mapObject.id.split('-')[1];
      $.post("/test", {state: st}, function(result){
        console.log("BILLS", result);
        let billHtml = '';
        result.bills.forEach(function(bill){
          billHtml += `<li class="js-bill" data-bill_uri="${bill.results[0].bill_uri}" data-sponsor="${bill.results[0].sponsor}">
            <h4>${bill.results[0].title}</h4>
                <div>${bill.results[0].summary}</div>

                <div>${bill.results[0].summary_short}</div>
            
            <p>
                ${bill.results[0].sponsor}
            </p>
            <p>
                ${bill.results[0].latest_major_action}
            </p>
            <a>${bill.results[0].govtrack_url}</a>
            <div>
                <button type="button" name="button" class="js-btn-choice js-btn-yes" value="yay">YES</button>
                <button type="button" name="button" class="js-btn-choice js-btn-no" value="nay">NO</button>
            </div>
            <br><br><br>
        </li>`;
        });
        console.log(billHtml);
        $(".bills-ul").html(billHtml);
        nextQuestion();
      });
  });
