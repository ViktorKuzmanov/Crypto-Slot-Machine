let eventContractAddress = "0x70aB7a467B00F9e0d58C3fC6807E3C0162026195"
let eventContractApi = [
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
			}
		],
		"name": "GenerateNumbers",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "emitEvent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

console.log("started listening for events")
const provider = new ethers.providers.Web3Provider(window.ethereum)
let eventContract = new ethers.Contract(eventContractAddress, eventContractApi, provider)

eventContract.on("GenerateNumbers", (num1, num2, num3)=>{
    console.log("numbers were generated")
    console.log(num1.toString())
    console.log(num2.toString())
    console.log(num3.toString())
})