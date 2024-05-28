import React from 'react';
import { WindowWidthProvider } from '../contexts/WindowWidthContext';

const App = ({ Component, pageProps }) => (
  <React.Fragment>
    <WindowWidthProvider>
      <Component {...pageProps} />
    </WindowWidthProvider>
  </React.Fragment>
);

export default App;
