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

