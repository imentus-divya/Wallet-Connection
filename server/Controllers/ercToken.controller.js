// const Web3 = require("web3"
const { Web3 } = require('web3');
require("dotenv").config();
const fs = require("fs");
const url=process.env.ALCHEMY_API_SEPOLIA_ID;
const web3 = new Web3(process.env.ALCHEMY_API_SEPOLIA_ID);

let contractFileLocation = "deployed_contracts/SomeToken-11155111.json"
let contractJSON = JSON.parse(fs.readFileSync(contractFileLocation, 'utf8'));

// Replace with your contract's ABI
const contractABI = JSON.parse(contractJSON.abi);
const contractBytecode = contractJSON.bytecode;

// Replace with your contract's deployed address
const contractAddress = contractJSON.contract_address;
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

exports.getName = async (req, res) => {
    try {
        // Invoke the 'name' method
        const name = await contractInstance.methods.name().call();
        console.log("🚀 ~ name:", name)

        return res.status(200).json({ name: name });

    }
    catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });

    }


}
exports.getSymbol = async (req, res) => {
    try {
        const symbol = await contractInstance.methods.symbol().call();
        console.log("🚀 ~ symbol:", symbol)
        return res.status(200).json({ symbol: symbol });
    }
    catch (error) {
        console.log("🚀 ~ error:", error)
        return res.status(500).json({ error: 'Internal Server Error' });

    }
}
exports.getBalance = async (req, res) => {
    try {
        const  invokerAccount  = req.body.data.accountAddress;
        console.log("~~~~~~~~~~~invoker account~~~~~",invokerAccount)
        if (!invokerAccount) {
            return res.status(400).json({ error: 'Invoker account is required' });
        }
        const balanceOf = await contractInstance.methods.balanceOf(invokerAccount).call({ from: invokerAccount });
        const tokenBalance=balanceOf.toString();
        return res.status(200).json({ balance: tokenBalance });
    } catch (error) {
        console.error("Error in getBalance:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.getEthBalance = async (req, res) => {
console.log("🚀 ~ exports.getEthBalance= ~ getEthBalance:", req.body)

    try {
        const  accountAddress  = req.body.data.accountAddress;
        if (!accountAddress) {
            return res.status(400).json({ error: 'Account Address is Required' })
        }
        let balance = await web3.eth.getBalance(accountAddress);
        let ethBal=balance.toString();
        console.log("🚀 ~ getEthBalance ~ balance:", ethBal);
        return res.status(200).json({ EthBalance: ethBal });
    }
    catch (error) {
        console.error("Error in getBalance:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}
exports.getMintTransactionObj = async (req, res) => {
    try {
        const { toAccount, amount, fromAccount } = req.body;
        let mint = contractInstance.methods.mint(toAccount, amount);
        let estimatedGas = await mint.estimateGas({ from: fromAccount });
        console.log("🚀 ~ estimatedGas:", estimatedGas)
        let tx = {
            from: fromAccount,
            nonce: await web3.eth.getTransactionCount(fromAccount, 'latest'),
            to: contractAddress,
            data: mint.encodeABI(),
            gas: estimatedGas,
            gasPrice: await web3.eth.getGasPrice()
        };
        console.log("🚀 ~ tx:", tx)
        return res.status(200).json({ transaction: tx });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.transferToken=async(req,res)=>
{
    console.log(" transfer data to : ", req.body)
   try{
 
    const to=req.body.data.to;
    const from=req.body.data.from;
    const amount=req.body.data.amount;
    let transfer = contractInstance.methods.transfer(to, amount);
    let estimatedGas = await transfer.estimateGas({ from: from });
    let txObj = {
        from: from,
        nonce: (await web3.eth.getTransactionCount(from, 'latest')).toString(),
        to: to,
        // token will be sent here in data
        data: transfer.encodeABI(),
        gas: estimatedGas.toString(),
        gasPrice: (await web3.eth.getGasPrice()).toString()
    };
    console.log("🚀 ~ txObj:", txObj)
 
  return res.status(200).send(txObj);
   }
   catch(error)
   {
    console.log("error at transfer token is : ",error)
    return res.status(500).json({Error:error})

   }

}
exports.signTx=async(req,res)=>
{
    console.log("request at sign transaction is  : ",req.body)
//     const {txObj}=req.body;
//     console.log("🚀 ~ txObj:", txObj)
//    const abc= window.ethereum.request({ 
//         method: 'eth_signTypedData_v4',
//          params: [from, message]
//     })
//     console.log("🚀 ~ abc:", abc)

}
