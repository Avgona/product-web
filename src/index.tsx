import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ProductList from './product/ProductList';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ProductList />
  </React.StrictMode>
);

