import React from 'react';
import logo from './logo.svg';
import Layout from './layouts/Layout';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import 'antd/dist/antd.min.css';
import './styles/app.scss';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
      </Routes>
    </Layout>
  );
}

export default App;
