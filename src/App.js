import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [unsignedJsonData, setUnsignedJsonData] = useState(null);
  const [signedJsonData, setSignedJsonData] = useState(null);

  async function uploadUnsignedFile(event) {
    console.log("UploadUnsignedFile");
    const reader = new FileReader();
    reader.onload = function() {
      setUnsignedJsonData(JSON.parse(reader.result));
      console.log("jsonData:::::::::");
    };
    reader.readAsText(event.target.files[0]);
  }

  async function uploadSignedFile(event) {
    console.log("UploadSignedFile");
    const reader = new FileReader();
    reader.onload = function() {
      setSignedJsonData(JSON.parse(reader.result));
      console.log("jsonData:::::::::");
    };
    reader.readAsText(event.target.files[0]);
  }

  async function signAndSend() {
    console.log("signAndSend");
    try {
      if (!window.ethereum) {
        throw new Error("Metamask not found");
      }
      if(!unsignedJsonData) {
        throw new Error("No unsigned transactions found");
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const sender = accounts[0];
      console.log("Using account:", sender);
    
      for (const tx of unsignedJsonData) {
        tx.from = sender;
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [tx],
        });
    
        console.log("Transaction sent:", txHash);
      }
    } catch (error) {
      console.error("Error signing or sending transactions:", error);
    }
  }

  async function send() {
    console.log("send");
    try {
      if (!window.ethereum) {
        throw new Error("Metamask not found");
      }
      if(!signedJsonData) {
        throw new Error("No signed transactions found");
      }
      for (const tx of signedJsonData) {
        const txHash = await window.ethereum.request({
          method: "eth_sendRawTransaction",
          params: [tx.raw],
        });
    
        console.log("Transaction sent:", txHash);
      }
    } catch (error) {
      console.error("Error sending transactions", error);
    }
  }

  return (
    <div className="App">
      <h3>Upload Unsigned Transactions File</h3>
      <input type="file" accept=".json" id="unsignedFile" onChange={uploadUnsignedFile}/>
      <pre id="output"></pre>

      <h3>Sign and Send Transactions</h3>
      <button id="signAndSend" onClick={signAndSend}>SignAndSend</button>
      
      <h3>Upload Signed Transactions File</h3>
      <input type="file" accept=".json" id="signedFile" onChange={uploadSignedFile}/>
      <h3>Send Signed Transactions</h3>
      <button id="send" onClick={send}>Send</button>
    </div>
  );
}

export default App;
