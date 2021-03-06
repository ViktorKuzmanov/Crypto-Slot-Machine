// WARNING: THIS CONTRACT IS DEPRICATED
// this SlotMachine contract is deployed on the kovan testnet
let slotMachineContractAddress = "0xC174d0bcD0b20F9723Eec70e931cAd9Db9b51dc0"
let slotMachineContractAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "GenerateNumbers",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "GenerateOneNumber",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "randomValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "n",
				"type": "uint256"
			}
		],
		"name": "getMultipleRandomNumbers",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "expandedValues",
				"type": "uint256[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRandomNumber",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "requestId",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "requestId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "randomness",
				"type": "uint256"
			}
		],
		"name": "rawFulfillRandomness",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "randomNumbers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "randomResult",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

// send transaction when user clicks on button
// wait(spin) until the transaction is mined
// once trnasction is mined read event and show numbers

// ! Logic for the slot machine

var doing = false;
var spin = [new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3")];
var coin = [new Audio("res/sounds/coin.mp3"),new Audio("res/sounds/coin.mp3"),new Audio("res/sounds/coin.mp3")]
var win = new Audio("res/sounds/win.mp3");
var lose = new Audio("res/sounds/lose.mp3");
var audio = false;
let status = document.getElementById("status")
var info = true;

async function doSlot(){
	if (doing){return null;}
	doing = true;

	const provider = new ethers.providers.Web3Provider(window.ethereum)
    let slotContract = new ethers.Contract(slotMachineContractAddress, slotMachineContractAbi, provider.getSigner())
    await slotContract.getRandomNumber()

	var numChanges
	// this is how much time before the slot sign is revealed(how much time it spins)
	// and also how much time a0 through a7 is spinned till we end up on a random aNumber
	var numberSlot1
	var numberSlot2
	var numberSlot3
    
    slotContract.on("GenerateNumbers", (num0, num1, num2, num3) => {
        console.log("4 numbers were generated - i listeded GenerateNumbers event")

		numChanges = parseInt(num0.toString().substring(0,2)) * 7
		numberSlot1 = numChanges + parseInt(num0.toString().substring(0,2))
		numberSlot2 = numChanges+2*7+parseInt(num2.toString().substring(0,2))
		numberSlot3 = numChanges+4*7+parseInt(num3.toString().substring(0,2))

		console.log(numChanges)
		console.log(numberSlot1)
		console.log(numberSlot2)
		console.log(numberSlot3)
    })

	await new Promise(r => setTimeout(r, 200000));

	var i1 = 0;
	var i2 = 0;
	var i3 = 0;
	var sound = 0
	status.innerHTML = "SPINNING"
	slot1 = setInterval(spin1, 50);
	slot2 = setInterval(spin2, 50);
	slot3 = setInterval(spin3, 50);
	function spin1(){
		i1++;
		if (i1>=numberSlot1){
			coin[0].play()
			clearInterval(slot1);
			return null;
		}
		slotTile = document.getElementById("slot1");
		if (slotTile.className=="a7"){
			slotTile.className = "a0";
		}
 		slotTile.className = "a"+(parseInt(slotTile.className.substring(1))+1)
	}
	function spin2(){
		i2++;
		if (i2>=numberSlot2){
			coin[1].play()
			clearInterval(slot2);
			return null;
		}
		slotTile = document.getElementById("slot2");
		if (slotTile.className=="a7"){
			slotTile.className = "a0";
		}
		slotTile.className = "a"+(parseInt(slotTile.className.substring(1))+1)
	}
	function spin3(){
		i3++;
		if (i3>=numberSlot3){
			coin[2].play()
			clearInterval(slot3);
			testWin();
			return null;
		}
		slotTile = document.getElementById("slot3");
		if (slotTile.className=="a7"){
			slotTile.className = "a0";
		}
		sound++;
		if (sound==spin.length){
			sound=0;
		}
		spin[sound].play();
		slotTile.className = "a"+(parseInt(slotTile.className.substring(1))+1)
	}
}

function testWin(){
	var slot1 = document.getElementById("slot1").className
	var slot2 = document.getElementById("slot2").className
	var slot3 = document.getElementById("slot3").className

	if (((slot1 == slot2 && slot2 == slot3) ||
		(slot1 == slot2 && slot3 == "a7") ||
		(slot1 == slot3 && slot2 == "a7") ||
		(slot2 == slot3 && slot1 == "a7") ||
		(slot1 == slot2 && slot1 == "a7") ||
		(slot1 == slot3 && slot1 == "a7") ||
		(slot2 == slot3 && slot2 == "a7") ) && !(slot1 == slot2 && slot2 == slot3 && slot1=="a7")){
		status.innerHTML = "YOU WIN!";
		win.play();
	}else{
		status.innerHTML = "YOU LOSE!"
		lose.play();
	}
	doing = false;
}

function toggleAudio(){
	if (!audio){
		audio = !audio;
		for (var x of spin){
			x.volume = 0.5;
		}
		for (var x of coin){
			x.volume = 0.5;
		}
		win.volume = 1.0;
		lose.volume = 1.0;
	}else{
		audio = !audio;
		for (var x of spin){
			x.volume = 0;
		}
		for (var x of coin){
			x.volume = 0;
		}
		win.volume = 0;
		lose.volume = 0;
	}
	document.getElementById("audio").src = "res/icons/audio"+(audio?"On":"Off")+".png";
}

// creates random number between min and max including min and max
function randomInt(min, max){
	return Math.floor((Math.random() * (max-min+1)) + min);
}

let currentBetInEther = 0.1
const betAmount = document.getElementById("betAmount")
// TODO: put upper and lower limit on how much eth can you bet
function lowerBet() {
	currentBetInEther = (currentBetInEther * 10 - 0.1 * 10) / 10
	betAmount.innerHTML = currentBetInEther
}

function raiseBet() {
	// we are just adding 0.1 here but because floating point aritmetic 
	// is not always corrent we have to multipy and divide by 10
	currentBetInEther = (currentBetInEther * 10 + 0.1 * 10) / 10
	betAmount.innerHTML = currentBetInEther
	console.log(currentBetInEther)
}