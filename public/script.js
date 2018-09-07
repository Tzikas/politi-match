



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



let room = 'high';
// Socket
$(function () {
    var socket = io();
    $('#chat-form').submit(function(){
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
  });
  // var room = "abc123";
  // socket.on('connect', function() {
  //    // Connected, let's sign-up for to receive messages for this room
  //   socket.emit('room', room);
  // });
});

// var map = AmCharts.makeChart("mapdiv",{
//   type: "map",
//   theme: "light",
//   panEventsEnabled : true,
//   backgroundColor : "#535364",
//   backgroundAlpha : 1,
//   zoomControl: {
//   zoomControlEnabled : true
//   },
//   dataProvider : {
//   map : "usaHigh",
//   getAreasFromMap : true,
//   areas :
//   []
//   },
//   areasSettings : {
//   autoZoom : true,
//   color : "#B4B4B7",
//   colorSolid : "#84ADE9",
//   selectedColor : "#84ADE9",
//   outlineColor : "#666666",
//   rollOverColor : "#9EC2F7",
//   rollOverOutlineColor : "#000000"
//   }
//   });
 
//   map.addListener("clickMapObject", function(event) {
//       console.log(event);
//       console.log(event.mapObject.id.split('-')[1]);
//       let st = event.mapObject.id.split('-')[1];
//       $.post("/test", {state: st}, function(result){
//         console.log("RESULT",result);
//       });
//   });


