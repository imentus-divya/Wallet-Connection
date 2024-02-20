import React from "react";
import styles from './styles/style.module.css'
import Web3 from 'web3';
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from "primereact/inputtextarea";

import "primereact/resources/themes/lara-light-indigo/theme.css";

// contract info
import contract from '../contract';


const Home = () => {
  const BACKEND_URL = 'http://localhost:8001/api';
  const [web3, setWeb3] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  // OPTIONS
  const [showOptions, setShowOptions] = useState(false);
  // name
  const [tokenName, setTokenName] = useState('')
  // symbol
  const [tokenSymbol, setTokenSymbo] = useState('')
  // ethereum balance
  const [ethBal, setEthBal] = useState(null)
  // token balance
  const [tokenBal, setTokenBal] = useState(null);
  // invoker address
  const [toAddress, setAddress] = useState('');
  // token to send/mint
  const [tokenAmount, setTokenAmount] = useState('');
  // copy text
  const [copyStatus, setCopyStatus] = useState(false);
  // POPUP
  const [visible, setVisible] = useState(false);
  // paste tx box
  const [visibleBox, setVisibleBox] = useState(false);
  // paste tx value
  const [txValue, setxValue] = useState('');

  const [tx, setTx] = useState(null);
 
  const connectWallet = async () => {

    if (!currentAccount) {
      if (window.ethereum) {
        console.log("metamask present")
        try {
          const web3Instance = new Web3(window.ethereum);
          console.log("🚀 ~ connectWal ~ web3Instance:", web3Instance)
          setWeb3(web3Instance);
          if (web3) {
            const accounts = await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] }).
              then(() => window.ethereum.request({ method: 'eth_requestAccounts' }))
            console.log("🚀 ~ connectWal ~ accounts:", accounts)
            setCurrentAccount(accounts[0])
            setShowOptions(true);

          }

        } catch (error) {
          console.log("🚀 ~ Home ~ error:", error)
        }
      }
    }
    else {
      setShowOptions(!showOptions);
    }

    // if(!currentAccount)
    // {
    //   const provider= new Web3(window.ethereum);
    //   const accounts=await provider.request({method:'wallet_requestPermissions',params:[{eth_accounts : {}}]}).
    //   then(()=>window.ethereum.request({method:'eth_requestAccounts'}))
    //   console.log("🚀 ~ connectWal ~ accounts:", accounts)
    //   setCurrentAccount(accounts[0])
    //   setWeb3(provider);
    // }
    // else{
    //   setShowOptions(true);
    // }


  }
  // GET TOKEN NAME
  const getName = async () => {
    await axios.get(`${BACKEND_URL}/getName`)
      .then((response) => {
        if (response.status === 200) {
          console.log("~~~~~response of name~~~~~~~~~~~", response.data);
          setTokenName(response.data.name);
        } else {
          console.log("Unexpected status:", response.status);

        }
      })
      .catch((error) => {
        console.log("Error present at token name API:", error);

      });
    // FROM UI
    // const name = await contract.methods.name().call();
    // console.log("🚀 ~ getName ~ name:", name)
    // setTokenName(name);

  };
  // GET TOKEN SYMBOL
  const getSymbol = async () => {
    await axios.get(`${BACKEND_URL}/getSymbol`)
      .then((response) => {
        if (response.status === 200) {
          console.log("~~~~~response of symbol~~~~~~~~~~~", response.data);
          setTokenSymbo(response.data.symbol);
        } else {
          console.log("Unexpected status:", response.status);

        }
      })
      .catch((error) => {
        console.log("Error present at token name API:", error);
      });
    // FROM UI
    // const symbol = await contract.methods.symbol().call();
    // console.log("🚀 ~ getSymbol ~ symbol:", symbol)
    // setTokenSymbo(symbol)
  };
  // GET ETH BALANE
  const getEthBalance = async () => {
    const data = { accountAddress: currentAccount };
    try {
      await axios.post(`${BACKEND_URL}/getEthBalance`, { data }).then(
        (response) => {
          if (response.status == 200) {
            const eth_bal = response.data.EthBalance.toString();
            console.log("🚀 ~ Home ~ eth_bal:", eth_bal)
            setEthBal(eth_bal);
            console.log("~~~~eth balance : ", ethBal)
          }
        }
      )
    }
    catch (error) {
      toast.error("Please connect wallet")
    }
    // FROM UI
    // let balance = await web3.eth.getBalance(currentAccount);
    // let ethBal = balance.toString();
    // setEthBal(ethBal);
    // console.log("🚀 ~ Home ~ data:", data)
  }
  // GET TOKEN BALANCE
  const getTokenBalance = async () => {
    console.log("token balance")
    const data = { accountAddress: currentAccount };
    try {
      await axios.post(`${BACKEND_URL}/getBalance`, { data }).then(
        (response) => {
          if (response.status == 200) {
            const token_bal = response.data.balance.toString();
            console.log("🚀 ~ Home ~ token_bal:", token_bal)
            setTokenBal(token_bal);
            console.log("🚀 ~ Home ~ token_bal:", token_bal)
          }
          else {
            console.log("response not 200 ")
          }
        }
      )
    }
    catch (error) {
      toast.error("Please connect wallet !")
    }

    // FROM UI
    // console.log("🚀 ~ Home ~ data:", data)
    // const balanceOf = await contract.methods.balanceOf(currentAccount).call({ from: currentAccount });
    // const tokenBalance = balanceOf.toString();
    // setTokenBal(tokenBalance)
  }
  // Validate input address and token amount

  // TOKEN TRANSFER
  const TokenTransfer = async (e) => {
    // FROM UI
    // e.preventDefault();
    // console.log("in transfer function")
    // let transfer = contract.methods.transfer(toAddress, tokenAmount).send({ from: currentAccount }).then((e) => {
    //   console.log("eeeeee", e)
    // });
    if (currentAccount) {
      try {
        const data = { to: toAddress, amount: web3.utils.toWei(tokenAmount, 'ether'), from: currentAccount }
        console.log("🚀 ~ TokenTransfer ~ data:", data)
        await axios.post(`${BACKEND_URL}/transferToken`, { data }).then((response) => {
          if (response.status == 200) {
            console.log("transaction object", response.data)
            const data = response.data;
            console.log("🚀 ~ awaitaxios.post ~ data:", data)

            setVisible(true);
            setTx(data);
          }
          else {
            console.log("not succesfull")
          }
        })
      }
      catch (error) { console.log("🚀 ~ TokenTransfer ~ error:", error) }
    }
    else {
      toast.error('Please connect wallet !')
    }

  }
  // COPY ADDRESS
  const copyAddress = async () => {
    await navigator.clipboard.writeText(currentAccount);
    toast.success("Address Copied !");

  }
  // DISCONNECT ACCOUNT
  const Disconnect = async () => {
    console.log("disconnected")
    setCurrentAccount(null);
    console.log('Disconnected from MetaMask');
  }
  // PASTE TRANSACTION
  const PasteTransaction = () => {
    setVisibleBox(true)
    console.log('transaction object pasted  : ', txValue)
  }
  const signPasteTx = async () => {
    console.log("transaction objected entered ", txValue)
    const t = JSON.parse(txValue)
    const transactionHash = await web3.eth.sendTransaction(t)
    toast.success(
      <>
        <p>Transaction Successfull </p>
        <p>Check your transaction here:</p>
        <a href={`https://sepolia.etherscan.io/tx/${transactionHash.transactionHash}`} target="_blank" rel="noopener noreferrer">
          Click here
        </a>
      </>
    );
    console.log("🚀 ~ Home ~ transactionHash:", transactionHash)
  }
  // HEADER ELEMENT FOR PASTING TX BOX
  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">Paste Transaction Object Here</span>
    </div>
  );
  // FOOTER OF TEXT AREA TO PASTE TX
  const footerContentBox = (
    <div>
      <Button label="Sign Transaction" icon="pi pi-check" onClick={signPasteTx} autoFocus />
    </div>
  );
  // SIGN TRANSACTION
  const signTx = async () => {
    setVisible(false);
    console.log(typeof (tx.value))
    const txObj = { data: tx.data, from: tx.from, gas: tx.gas, gasPrice: tx.gasPrice, nonce: tx.nonce, to: tx.to };
    console.log("🚀 ~ Home ~ 44 txObj:", txObj)
    const transactionHash = await web3.eth.sendTransaction(txObj);
    toast.success(
      <>
        <p>Transaction Successfull </p>
        <p>Check your transaction here:</p>
        <a href={`https://sepolia.etherscan.io/tx/${transactionHash.transactionHash}`} target="_blank" rel="noopener noreferrer">
          Click here
        </a>
      </>
    );
    console.log("🚀 ~ Home ~ transactionHash:", transactionHash)

  }
  // txobj -no input
  const footerContent = (
    <div>
      <Button label="Cancel" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
      <Button label="Sign Transaction" icon="pi pi-check" onClick={signTx} autoFocus />
    </div>
  );

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.wallet_container}>
        <h3>Wallet Connection</h3>
        <div className={styles.wallet_options}>

          <button class={styles.wallet_btn} role="button" onClick={connectWallet}>
            {currentAccount ?
              <p className={styles.selectWallet}>{currentAccount} </p>
              : <p className={styles.selectWallet}>Select Wallet</p>}
          </button>

          {showOptions ? <ul className={styles.options}>
            <li onClick={copyAddress}>Copy Address</li>
            <li onClick={Disconnect}>Disconnect</li>
          </ul> : ''}




        </div>
      </div>

      <div className={styles.container_two}>
        <div className={styles.head_container}>
          <h2>Track Wallet Wealth with Ease. Explore Balances and Make Transactions effortlessly with our
            User-Friendly Web App!</h2>
        </div>
        <div className={styles.balance_container}>
          {/* token name */}
          <div className={styles.eth_bal} style={{ backgroundColor: '#FFCF96' }}>
            <button class={styles.button_bal} role="button" onClick={getName}>Token Name</button>
            <div className={styles.bal_div}>
              {tokenName ? <h4 className={styles.tokenHeading}>{tokenName}</h4> : ''}
            </div>
          </div>
          {/* token symbol */}
          <div className={styles.eth_bal} style={{ backgroundColor: '#D2E0FB' }}>
            <button class={styles.button_bal} role="button" onClick={getSymbol}>Symbol</button>
            <div className={styles.bal_div}>
              {tokenSymbol ? <h4 className={styles.tokenHeading}>{tokenSymbol}</h4> : ''}
            </div>
          </div>
          {/* ethereum balance */}
          <div className={styles.eth_bal} style={{ backgroundColor: '#CBFFA9' }}>
            <button class={styles.button_bal} role="button" onClick={getEthBalance}>Ethereum Balance</button>
            <div className={styles.bal_div}>
              {ethBal ? <h4 className={styles.tokenHeading}>{ethBal}</h4> : ''}
            </div>
          </div>
          {/* token balance */}
          <div className={styles.eth_bal} style={{ backgroundColor: '#FFD966' }}>
            <button class={styles.button_bal} role="button" onClick={getTokenBalance}>Token Balance</button>
            <div className={styles.bal_div}>
              {tokenBal ? <h4 className={styles.tokenHeading}>{tokenBal} </h4> : ''}
            </div>
          </div>

          {/* <div className={styles.token_bal}>
            <button class={styles.button_bal} role="button">Token Balance</button>
            <div className={styles.bal_div}>
              <h2>qwerty</h2>
            </div>
          </div> */}
        </div>
      </div>

      <div className={styles.sign_container}>

        <div className={styles.transfer}>
          <div className={styles.sign_head}>
            <h4>Transfer Tokens</h4>
          </div>
          <form >
            <label for="address">Address</label>
            <input type="text" name="adress" placeholder="Enter Address" className={styles.input} onChange={(e) => setAddress(e.target.value)} />
            <label for="token_number">Token Amount</label>
            <input type="text" name="token_number" placeholder="Enter Token Number" className={styles.input} onChange={(e) => setTokenAmount(e.target.value)} />
            <input type="button" value="Transfer" className={styles.transfer_btn} onClick={TokenTransfer} />
            <input type="button" value="Paste Transaction Object" className={styles.transfer_btn} onClick={PasteTransaction} />
          </form>
          {/* SEND TX  */}
          <Dialog header="Header" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent}>
            <p className="m-0" style={{ padding: '5px' }}>
              {tx ? `From: ${tx.from}, Nonce: ${tx.nonce}, To: ${tx.to}, Data: ${tx.data}, Gas: ${tx.gas}, Gas Price: ${tx.gasPrice}` : ''}
            </p>
          </Dialog>
          {/* PASTE TX OBJECT */}
          <Dialog visible={visibleBox} modal header={headerElement} footer={footerContentBox} style={{ width: '50rem' }} onHide={() => setVisibleBox(false)}>
            <div className="card flex justify-content-center align-item-center" >
              <InputTextarea value={txValue} onChange={(e) => setxValue(e.target.value)} rows={5} cols={30} style={{ minWidth: '100%', maxWidth: '100%' }} />
            </div>
          </Dialog>

        </div>
      </div>
    </div>
  )
}
export default Home;