const express = require('express');
const router = express.Router();
const ercToken=require('../Controllers/ercToken.controller');

// router.get('/test',async(req,res)=>
// {
//     console.log("~~~~~~~~~~~~~~~test api~~~~~~~~~")
//     return "asdfghjk"
// })
// erc token routing
router.get('/getName',ercToken.getName.bind());
router.get('/getSymbol', ercToken.getSymbol.bind());
router.post('/getBalance',ercToken.getBalance.bind());
router.post('/getEthBalance',ercToken.getEthBalance.bind());
router.post('/mintToken',ercToken.getMintTransactionObj.bind());
router.post('/transferToken',ercToken.transferToken.bind());
router.post('/signTx',ercToken.signTx.bind());

module.exports = router;