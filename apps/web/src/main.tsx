import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css';

import Register from './auth/register/page';
import Login from './auth/login/page';
import Dashboard from './dashboard/page';
import Lobby from './lobby/page';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/room/:roomId' element={<Lobby />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
