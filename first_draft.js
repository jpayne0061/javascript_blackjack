var values = ['A', 'K', 'Q', 'J', 10, 9, 8, 7, 6, 5, 4, 3, 2];
var suits  = ['C', 'S', 'D', 'H'];
var cards = [];
var countTotal = 0;
//var playerHand = [];
var playerAces = 0;
var dealerAces = 0;
var dealersTurn = false;
var dealerCountTotal = 0;
var dealer_deal2;
var dealerBust = false;
var playerBust = false;
var playerDecided = false;

function generateCards() {
  for(var i = 0; i < suits.length; i++) {
    var suit = suits[i];
    for(var j = 0; j < values.length; j++) {
      var suit_value_pair = [];
      suit_value_pair.push(suit);
      suit_value_pair.push(values[j]);
      cards.push(suit_value_pair);
    }
  } 
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
 // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}


function get_card_image(card_array) {
  if(card_array[0] == 'H') {
    var suit = 'hearts';
   } else if(card_array[0] == 'C') {
   	var suit = 'clubs';
   } else if(card_array[0] == 'D') {
   	var suit = 'diamonds';
   } else if(card_array[0] == 'S') {
   	var suit = 'spades';
   }

  if        (card_array[1] == 'A') {
    var value = 'ace';
   } else if(card_array[1] == 'K') {
   	var value = 'king';
   } else if(card_array[1] == 'Q') {
   	var value = 'queen';
   } else if(card_array[1] == 'J') {
   	var value = 'jack';
   } else {
     var value = card_array[1];
   } 
   var image_url = "<img src='cards/" + suit + "_" + value + ".jpg' class='card'/>";
   return image_url;
}

function getCoverCard(){
  
  return "<img src='cards/cover.jpg' class='card' id='coverCard'/>";
  
}

function calculateValue(card) {
   if        (card[1] == 'A') {
    var value = 11;
    if(dealersTurn === false){
      playerAces += 1;
    }
    if(dealersTurn === true) {
      dealerAces += 1;
    }
   } else if(card[1] == 'K') {
   	var value = 10;
   } else if(card[1] == 'Q') {
   	var value = 10;
   } else if(card[1] == 'J') {
   	var value = 10;
   } else {
     var value = card[1];
   }
   if(dealersTurn === false){ 
     countTotal += value;
   } else if(dealersTurn){
     dealerCountTotal += value;
   }
   
   //REMOVE 10 FROM COUNT FOR EACH ACE IF OVER 21
   if(dealersTurn === false) {
     for(var i = 0; i < playerAces; i += 1){
       if(countTotal > 21){
         countTotal -= 10;
         playerAces -= 1;
       }
     }
   } else if(dealersTurn) {
     for(var i = 0; i < dealerAces; i += 1){
       if(dealerCountTotal > 21){
         dealerCountTotal -= 10;
         dealerAces -= 1;
       }
     }
     
   }
 
   $('#score').html(countTotal);
   if(playerDecided === false) {
     $('#dealer-score').html(' ?');
   } else if(playerDecided === true || playerBust === true) {
     $('#dealer-score').html(dealerCountTotal);
   }
   bust();
   
}

function stopGame(){
  $('#card-div').addClass('grayed');
  $('#score').addClass('grayed');
  $('#dealer-score').addClass('grayed');
  $('.your-total').addClass('grayed');
  $('.dealer-total').addClass('grayed');
  $('#hit').hide();
  $('#stand').hide();
  $('#play-again').show();
}

function bust(){
  if(countTotal > 21) {
    //LOSE MONEY
    playerBust = true;
    $('#coverCard').replaceWith(get_card_image(dealer_deal2));
    stopGame();
    $('#bust-message').show();
  }
  
  if(dealerCountTotal > 21) {
    dealerBust = true;
    stopGame();
    $('#dealer-bust-message').show();
  }
  
}

function firstDeal(){
  var deal1 = cards.pop();
  //playerHand.push(deal1);
  $('#card-div').html(get_card_image(deal1));
  calculateValue(deal1);
  var deal2 = cards.pop();
  //playerHand.push(deal2);
  $('#card-div').append(get_card_image(deal2));
  calculateValue(deal2);
  
  dealersTurn = true;
  
  var dealer_deal1 = cards.pop();
  //playerHand.push(deal1);
  $('#dealer-card-div').html(get_card_image(dealer_deal1));
  calculateValue(dealer_deal1);
  dealer_deal2 = cards.pop();
  //playerHand.push(deal2);
  $('#dealer-card-div').append(getCoverCard());
  calculateValue(dealer_deal2);
  
}

function startNewGame() {
  $('#card-div').removeClass('grayed');
  $('#score').removeClass('grayed');
  $('#dealer-score').removeClass('grayed');
  $('.your-total').removeClass('grayed');
  $('.dealer-total').removeClass('grayed');
  countTotal = 0;
  dealerCountTotal = 0;
  
  cards = [];
  playerAces = 0;
  dealerAces = 0;
  dealersTurn = false;
  dealer_deal2 = null;
  dealerBust = false;
  playerBust = false;
  playerDecided = false
  
  $('#score').html(countTotal);
  $('#hit').show();
  $('#stand').show();
  $('#play-again').hide();
  $('#bust-message').hide();
  $('#dealer-bust-message').hide();
  $('#player-win').hide();
  $('#dealer-win').hide();
  $('.cards').remove();
  $('#push').hide();
  //playerHand = [];
  
  generateCards();
  cards = shuffle(cards);
  firstDeal();
}

startNewGame();

//HIT!!!
$('#hit').click(function(){
  dealersTurn = false;
  var hitCard = cards.pop();
  //playerHand.push(hitCard);
  $('#card-div').append(get_card_image(hitCard));
  calculateValue(hitCard);
});

$('#play-again').click(function(){
  startNewGame();
});

$('#stand').click(function(){
  dealersTurn = true;
  playerDecided = true;
  $('#coverCard').replaceWith(get_card_image(dealer_deal2));
  while(dealerCountTotal < 17){
    var hitCard = cards.pop();
    //playerHand.push(hitCard);
    $('#dealer-card-div').append(get_card_image(hitCard));
    calculateValue(hitCard);
    bust();
  }
  
  if(dealerCountTotal > countTotal && dealerBust === false) {
    $('#dealer-win').show();
    $("#dealer-score").html(dealerCountTotal);
    stopGame();
  }
  
  if(countTotal > dealerCountTotal && playerBust === false) {
    $('#player-win').show();
    $("#dealer-score").html(dealerCountTotal);
    stopGame();
  }
  
  if(countTotal === dealerCountTotal && playerBust === false) {
    $('#push').show();
    $("#dealer-score").html(dealerCountTotal);
    stopGame();
  }
  
});




