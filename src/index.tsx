import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { render } from 'react-dom';
import App from './App';
import './App.global.css';

const AppWrapper = () => {
  return (
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
};

render(<AppWrapper />, document.getElementById('root'));
