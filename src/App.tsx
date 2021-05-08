import React from 'react';
import './App.css';
import Builder from './components/Builder/builder';
function App() {
  return (
    <div>
      <Builder></Builder>
      
      
      <footer className="bg-light text-center text-lg-start">
        <div className="text-center p-3" style={{backgroundColor: "rgba(0, 0, 0, 0.2)",position:"absolute",bottom:0}}>
          Developed by:
          <a className="text-dark" href="https://mdbootstrap.com/">Darshan Jain</a>
        </div>
      </footer>
     </div>
  );
}

export default App;
