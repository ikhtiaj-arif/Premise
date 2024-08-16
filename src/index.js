import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from "react-router-dom";
import App from './App';
import { GlobalProvider } from './app/Hooks/Global';
import { store } from './app/store';
import './index.css';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <HashRouter>
    <GlobalProvider>
      <App />
      </GlobalProvider>
    </HashRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
