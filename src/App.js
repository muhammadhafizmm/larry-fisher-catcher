import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.scss';
import { getList } from './service';

function App() {
  useEffect(() => {
    getList()
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Larry belajar menangkap ikan.
        </p>
        <p
          className="App-link"
        >
          Nantikan kegiatan larry.
        </p>
      </header>
    </div>
  );
}

export default App;
