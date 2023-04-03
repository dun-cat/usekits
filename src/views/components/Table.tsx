import React from 'react';

const { useState, useEffect } = React;
// Destructuring useState and useEffect from React
import tableData from '@src/data/table';

import { Box, Text, Newline } from 'ink';
// Destructuring the components we need from ink

// import axios from 'axios';



const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Clitecoin%2Cmatic-network%2Cethereum%2Ctether%2Cbinancecoin%2Csolana%2Caave%2Ccardano%2Ctron&order=market_cap_desc&per_page=100&page=1&sparkline=false'

export default () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    console.log(tableData)
    setData(tableData)
    // axios.get(url)
    //   .then(response => setData(response.data))
    //   .catch(e => console.log(e));
  }, []);

  return (
    <Box borderStyle='single' padding={2}>
      {
        data.length === 0 ?
          <Box>
            <Text>Loading ...</Text>
          </Box> :
          <Box flexDirection='column'>
            <Box>
              <Box width='25%'><Text>Tools</Text></Box>
              <Box width='25%'><Text>CURRENT PRICE (USD)</Text></Box>
              <Box width='25%'><Text>24 HOUR CHANGE</Text></Box>
              <Box width='25%'><Text>ALL TIME HIGH</Text></Box>
            </Box>
            <Newline />
            {
              data.map(({ id, title, current_price, price_change_percentage_24h, ath }) => (
                <Box key={id}>
                  <Box width='25%'>
                    <Text>{title}</Text>
                  </Box>
                  <Box width='25%'>
                    <Text color='cyan'>{'$' + 99}</Text>
                  </Box>
                  <Box width='25%'>
                    <Text backgroundColor={Math.sign(12) < 0 ? 'red' : 'green'}>
                      {123 + '%'}
                    </Text>
                  </Box>
                  <Box width='25%'>
                    <Text color='green'>{'$' + "122"}</Text>
                  </Box>
                </Box>
              ))
            }
          </Box>
      }
    </Box>
  )
}