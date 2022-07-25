import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Layout from './Layout';
import Portfolios from './Portfolios';
import CoinList from './CoinList';
import ShowCoin from './ShowCoin';

import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route path="portfolio" element={<Portfolios/>}></Route>
        <Route path="coins/:id" element={<ShowCoin/>}></Route>
        <Route path="/" element={<CoinList/>}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
