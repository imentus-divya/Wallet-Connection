import Web3 from 'web3';
import contract from './deployed_contracts/SomeToken-11155111.json'

// let contractFileLocation = "./deployed_contracts/SomeToken-11155111.json"
// let contractJSON = JSON.parse(fs.readFileSync(contractFileLocation, 'utf8'));

const ALCHEMY_API_SEPOLIA_ID = 'https://eth-sepolia.g.alchemy.com/v2/vYdUf8CmUd6OkKn3RF4U7Hv3aKuRCM1C'
const web3 = new Web3(ALCHEMY_API_SEPOLIA_ID);

// Replace with your contract's ABI
// const contractABI = JSON.parse(contractJSON.abi);
// const contractBytecode = contractJSON.bytecode;

const contractABI =JSON.parse(contract.abi);
const contractBytecode = contract.bytecode;

const provider = new Web3(window.ethereum);

// const signer = provider.signer();

// Replace with your contract's deployed address
const contractAddress = contract.contract_address;
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);


export default contractInstance;
