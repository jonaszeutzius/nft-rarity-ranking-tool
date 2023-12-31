# NFT RARITY RANKING TOOL


## HOW TO USE THE BLOCKSPAN API TO FIND NFT RARITY DATA

Blockspan is a leading provider of NFT API services, enabling developers to easily interact with the world of non-fungible tokens (NFTs). NFTs represent ownership of a unique item or piece of content on the blockchain. An nft rarity ranking tool will provide users with an overview of nft rarity data, which can help users make informed decisions about which NFTs to buy or sell based on their rarity.


## REQUIREMENTS:
- Node.js and npm installed on your system.
- Basic knowledge of React.js
- Blockspan API key


## STEP 1: SET UP YOU REACT APPLICATION

First, you'll need to set up your React application. If you already have a React application set up, you can skip this step.

`npx create-react-app nft-rarity-ranking-tool` 
`cd nft-rarity-ranking-tool`

This will create a new React application named `nft-rarity-ranking-tool` and navigate into the new directory.


## STEP 2: INSTALL AXIOS

We'll be using Axios to send HTTP requests to the Blockspan API. Install it with the following command:

`npm install axios`


## STEP 3: CREATE YOUR REACT COMPONENT

Next, you'll need to create a React component that uses the Blockspan API to fetch portfolio data. Create a new file in the `src` directory called `RankingTool.js` and include the following code:

```
import React, { useState } from 'react';
import axios from 'axios'
import './App.css'

const RankingTool = () => {
  const [contractAddress, setcontractAddress] = useState('');
  const [blockchain, setBlockchain] = useState('eth-main');
  const [collection, setCollection] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const getCollection = async () => {
    setCollection(null)
    setLoading(true)
    const url = `https://api.blockspan.com/v1/collections/contract/${contractAddress}?chain=${blockchain}`;
    const headers = {
      accept: 'application/json',
      'X-API-KEY': 'YOUR_BLOCKSPAN_API_KEY',
    };

    try {
      const response = await axios.get(url, { headers });
      setCollection(response)
      console.log('response:', response)
      setError(null);
      setLoading(false)
    } catch (error) {
      console.error(error);
      setError('No NFTs found on this chain in this contract address!');
      setCollection(null);
      setLoading(false)
    }
  };

  const checkData = (data) => {
    if (!data || isNaN(data)) {
        return 'N/A'
    } 
    return data
  }

  const rarityCountStats = (array) => {
    const length = array.length
    let total = 0
    let max = 0
    let min = 0
    
    array.forEach((element) => {
      const value = parseInt(element.count)
      total += value
      if (max < value) {
        max = value
      }
      if (min > value || min === 0) {
        min = value
      }
    })
    let average = 0
    if (length !== 0){
      average = (total / length).toFixed(1);
    }
    return {average, min, max}
  }



  return (
    <div>
      <h1 className="title">NFT Rarity Ranking Tool</h1>
      <p className="message">
          Select a blockchain and input a contract address to see NFT rarity information.
      </p>
      <div className="inputContainer">
        <select name="blockchain"
          value={blockchain}
          onChange={e => setBlockchain(e.target.value)}>
          <option value="eth-main">eth-main</option>
          <option value="arbitrum-main">arbitrum-main</option>
          <option value="optimism-main">optimism-main</option>
          <option value="poly-main">poly-main</option>
          <option value="bsc-main">bsc-main</option>
          <option value="eth-goerli">eth-goerli</option>
        </select>
        <input type="text" placeholder="Contract Address" onChange={e => setcontractAddress(e.target.value)}/>
        <button onClick={getCollection}>Get Collection</button>
      </div>
      {loading && (
        <p className='message'>Loading...</p>
      )}
      {error && !loading && (
        <p className='errorMessage'>Error: verify chain and contract address are valid</p>
      )}
      {collection && collection.data && (
        <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Token Type: {collection.data.token_type ? collection.data.token_type : 'N/A'} | 
          Total Tokens: {checkData(collection.data.total_tokens)} | 
          Total Transfers: {checkData(collection.data.total_transfers)}
        </p>
      )}
      {collection && collection.data && collection.data.trait_rarity_counts && (
        <div>
          <table className='tableContainer'>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>Traits</th>
                <th>Unique Values</th>
                <th>Average Rarity Count</th>
                <th>Lowest Rarity Count</th>
                <th>Highest Rarity Count</th>
              </tr>
            </thead>
            <tbody>
              {collection.data.trait_rarity_counts.map((element) => ( 
                <tr style={{ backgroundColor: '#f2f2f2' }} key={element.trait}>
                  <td>{element.trait}</td>
                  <td>{element.rarity_counts.length}</td>
                  <td>{rarityCountStats(element.rarity_counts).average}</td>
                  <td>{rarityCountStats(element.rarity_counts).min}</td>
                  <td>{rarityCountStats(element.rarity_counts).max}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default RankingTool;

```

Remember to replace `YOUR_BLOCKSPAN_API_KEY` with your actual Blockspan API key.


## STEP 4: UPDATING THE STYLES WITHIN CSS FILE

To enhance the user interface in the browser, replace all code in the App.css file with the following:

```
.App {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: auto;
}

.title {
  margin-top: 20px;
  margin-bottom: 0;
  text-align: center;
}

.errorMessage {
  text-align: center;
  color: red;
  font-weight: bold;
}

.successMessage {
  text-align: center;
  color: green;
  font-weight: bold;
}

.message {
  text-align: center;
}

.image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.inputContainer {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.inputContainer input {
  padding: 10px;
  font-size: 1em;
  width: 200px;
}

.inputContainer button {
  padding: 10px;
  font-size: 1em;
  background-color: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
}

.inputContainer button:hover {
  background-color: #0056b3;
}

.imageContainer {
  display: flex;
  justify-content: center;
  width: 100%; 
}

.imageContainer img {
  width: 100%; 
  max-width: 500px;
  height: auto; 
}
.nftData {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.nftData .image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.nftData h2 {
  margin: 10px 0;
}

.nftData p {
  font-size: 1.2em;
  font-weight: bold;
}

td {
  padding: 10px;
  text-align: center;
}

th {
  padding: 10px;
  text-align: center;
}

.tableContainer {
  width: 100%;
  border-collapse: separate;
  border-spacing: 4px; 
}

```

## STEP 5: INTEGRATING COMPONENTS IN THE APP

Finally, let's use the `RankingTool` component in our main `App` component.

Open App.js and modify it as follows:

```
import React from 'react';
import './App.css';
import RankingTool from './RankingTool';

function App() {
  return (
    <div className="App">
      <RankingTool/>
    </div>
  );
}

export default App;
```

Now, start the app with the following command:

`npm start`

You should now see the following:

- A drop down menu to select a blockchain
- A text box for contract address
- A get collection button

Input the chain and contract address for the collection you want data for, and click the get collection button. You should then see a bold line with general collection information, and a grey table with NFT rarity data if it exists. 

## CONCLUSION

Congratulations! You've just built a simple yet powerful NFT rarity ranking tool using the Blockspan API and React.js. As you've seen, the Blockspan API is intuitive to use and provides detailed and accurate information, making it a perfect choice for this kind of application. This tutorial is just a starting point - there are many ways you can expand and improve your tool. For example, you could add more error checking, improve the UI, or display additional data.

As the world of NFTs continues to grow and evolve, tools like this will become increasingly important. Whether you're an NFT enthusiast, a developer, or a startup, understanding NFTs is a valuable skill. We hope you found this tutorial helpful.