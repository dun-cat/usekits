import React, { useState, useEffect } from 'react';
import { render, Text, Box } from 'ink';
import Gradient from 'ink-gradient';
import Table from './components/Table';

const BigText = require('ink-big-text');

export default () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter(previousCounter => previousCounter + 1);
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <>
    <Gradient name="cristal">
      <BigText text="work cli" align='center' font='chrome' />
    </Gradient>
    <Table />
    {/* <Text color="green">{counter} tests passed</Text>; */}
  </>

};