#!/usr/bin/env node

"use strict";

var _ = require("lodash");
require("colors");
var path = require('path');
var readlineSync = require('readline-sync');

var options = ['Hit','Stay'];

var generateCard = function(){
	return _.random(2,14);
}
function getMask(num){
	var mask = num;
	switch(num){
		case 11:
			mask = 'J';
			break;
		case 12:
			mask = 'Q';
			break;
		case 13:
			mask = 'K';
			break;
		case 14:
			mask = 'A';
			break;
	}
	return mask;
}
function lose(participant){
	player.isMyTurn = false;
	dealer.isMyTurn = false;

	console.log((participant.type + " has lost!").yellow);
}
function blackJack(participant){
	player.isMyTurn = false;
	dealer.isMyTurn = false;

	console.log((participant.type + " got blackjack!").yellow);
}
function push(){
	console.log("Player and dealer have tied".orange);
}
function calcSum(cards){
	cards = _.sortBy(cards);
	var sum = _.sum(_.map(cards,cardValues));

	while(sum>21 && _.last(cards) == 14){
			sum-=10;
			_.dropRight(cards);
	}
	return sum;
}
function checkConditions(){

	player.sum = calcSum(player.cards);
	dealer.sum = calcSum(dealer.cards);

	if(player.sum >21)
		lose(player);
	else if(dealer.sum > 21)
		lose(dealer);
	else if(player.sum == 21)
		blackJack(player);
	else if(dealer.sum == 21)
		blackJack(dealer);
	else if(dealer.isMyTurn && dealer.sum>=17){
		if(dealer.sum > player.sum)
			lose(player);
		else if(player.sum > dealer.sum)
			lose(dealer);
		else
			push();
	}
}
function cardValues(cardVal){
	if(cardVal == 14)
		return 11;
	else
		return cardVal>=10? 10 : cardVal;
}
function printCards(){
	console.log(("Dealer:" + mapCards(dealer.cards,player.isMyTurn)).red);
	console.log(("Player:" + mapCards(player.cards)).green);
	console.log("\r\r");
}
function mapCards(Cards,faceDown){
	if(faceDown)
		return getMask(_.first(Cards)) +","+String.fromCharCode(127136);
	else
		return _.map(Cards,getMask);
}

var player = {
	cards: [generateCard(),generateCard()],
	sum: 0,
	type: 'player',
	isMyTurn: true
}
var dealer = {
	cards: [generateCard(),generateCard()],
	sum: 0,
	type: 'dealer',
	isMyTurn: false
}
	
	printCards();
	checkConditions();
while(player.isMyTurn || dealer.isMyTurn){

	if(player.isMyTurn){
		var selection = readlineSync.keyInSelect(options, 'Hit or Stay?');
		if(options[selection] == 'Hit')
			player.cards.push(generateCard());
		else{
			player.isMyTurn = false;
			dealer.isMyTurn = true;
		}
	}
	else if(dealer.isMyTurn){
		dealer.cards.push(generateCard());
	}

	printCards();
	checkConditions();
}
