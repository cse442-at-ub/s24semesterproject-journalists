import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import './App.css';

const HomePage = () => {
  return (
    <div className="App">
      <div style={{ width: 1512, height: 982, position: 'relative', background: 'white' }}>
        <div style={{ width: 766, height: 918, left: 709, top: 28, position: 'absolute', background: 'linear-gradient(0deg, #F0F9FD 0%, #F0F9FD 100%), linear-gradient(0deg, rgba(240, 249, 253, 0.20) 0%, rgba(240, 249, 253, 0.20) 100%)', borderRadius: 27 }} />
        <div style={{ width: 618, height: 546, left: 795, top: 218, position: 'absolute' }}>
          <div style={{ width: 516.39, height: 392.35, left: 54.50, top: 0, position: 'absolute', background: '#D7D7D8' }}></div>
          <div style={{ width: 507.15, height: 383.14, left: 59.12, top: 4.60, position: 'absolute', background: 'white' }}></div>
          <div style={{ width: 3.69, height: 388.09, left: 310.84, top: 2.35, position: 'absolute', background: '#D7D7D8' }}></div>
          <div style={{ width: 10.44, height: 10.40, left: 285.54, top: 55.14, position: 'absolute', background: '#D7D7D8' }}></div>
          <div style={{ width: 10.44, height: 10.40, left: 329.39, top: 55.14, position: 'absolute', background: '#D7D7D8' }}></div>
          <div style={{ width: 10.44, height: 10.40, left: 285.54, top: 123.06, position: 'absolute', background: '#D7D7D8' }}></div>
          <div style={{ width: 10.44, height: 10.40, left: 329.39, top: 123.06, position: 'absolute', background: '#D7D7D8' }}></div>
          <div style={{ width: 10.44, height: 10.40, left: 285.54, top: 190.97, position: 'absolute', background: '#D7D7D8' }}></div>
          <div style={{ width: 10.44, height: 10.40, left: 329.39, top: 190.97, position: 'absolute', background: '#D7D7D8' }}></div>
          <div style={{ width: 10.44, height: 10.40, left: 285.54, top: 258.90, position: 'absolute', background: '#D7D7D8' }}></div>
          <div style={{ width: 10.44, height: 10.40, left: 329.39, top: 258.90, position: 'absolute', background: '#D7D7D8' }}></div>
          <div style={{ width: 10.44, height: 10.40, left: 285.54, top: 326.81, position: 'absolute', background: '#D7D7D8' }}></div>
          <div style={{ width: 10.44, height: 10.40, left: 329.39, top: 326.81, position: 'absolute', background: '#D7D7D8' }}></div>
          <div style={{ width: 44.87, height: 8.04, left: 290.27, top: 49.90, position: 'absolute', background: '#D7D7D8' }}></div>
          {/* ... (other div styles remain unchanged) ... */}
          <div style={{ width: 44.87, height: 8.04, left: 290.27, top: 260.93, position: 'absolute', background: '#D7D7D8' }}></div>
          <div style={{ width: 44.87, height: 8.04, left: 290.27, top: 322.77, position: 'absolute', background: '#D7D7D8' }}></div>
          <div style={{ width: 44.87, height: 8.04, left: 290.27, top: 329.15, position: 'absolute', background: '#D7D7D8' }}></div>
          <div style={{ width: 60.13, height: 76.64, left: 408.51, top: 102.33, position: 'absolute', background: '#2F2E43' }}></div>
          <div style={{ width: 20.63, height: 29.56, left: 431.51, top: 147.42, position: 'absolute', background: '#F3A3A6' }}></div>
          <div style={{ width: 22.42, height: 49.87, left: 372.61, top: 299.07, position: 'absolute', background: '#F3A3A6' }}></div>
          <div style={{ width: 30.52, height: 102.75, left: 405.79, top: 425.63, position: 'absolute', background: '#F3A3A6' }}></div>
          <div style={{ width: 60.74, height: 31.15, left: 379.32, top: 513.76, position: 'absolute', background: '#2F2E43' }}></div>
          <div style={{ width: 30.53, height: 102.75, left: 449.43, top: 425.63, position: 'absolute', background: '#F3A3A6' }}></div>
          <div style={{ width: 60.74, height: 31.15, left: 422.98, top: 513.76, position: 'absolute', background: '#2F2E43' }}></div>
          <div style={{ width: 93.88, height: 110.56, left: 391.63, top: 165.43, position: 'absolute', background: '#F74923' }}></div>
          <div style={{ width: 57.07, height: 157, left: 374.22, top: 165.44, position: 'absolute', background: '#F74923' }}></div>
          <div style={{ width: 41.11, height: 40.92, left: 413.50, top: 114.68, position: 'absolute', background: '#F3A3A6' }}></div>
          <div style={{ width: 19.43, height: 67.10, left: 410.28, top: 110.46, position: 'absolute', background: '#2F2E43' }}></div>
          <div style={{ width: 147.55, height: 155.85, left: 370.61, top: 275.99, position: 'absolute', background: '#2F2E43' }}></div>
          <div style={{ width: 618, height: 2.19, left: 0, top: 543.81, position: 'absolute', background: '#2F2E43' }}></div>
          <div style={{ width: 64.71, height: 85.46, left: 441.09, top: 164.60, position: 'absolute', background: '#F74923' }}></div>
          <div style={{ width: 54.13, height: 40.47, left: 419.34, top: 147.42, position: 'absolute', background: '#2F2E43' }}></div>
          <div style={{ width: 36.01, height: 45.79, left: 431.47, top: 163.01, position: 'absolute', background: '#F3A3A6' }}></div>
          <div style={{ width: 40.26, height: 41.70, left: 444.21, top: 185.90, position: 'absolute', background: '#F74923' }}></div>
          <div style={{ width: 148.37, height: 6.39, left: 101.10, top: 66.12, position: 'absolute', background: '#F74923' }}></div>
          <div style={{ width: 148.37, height: 6.39, left: 101.10, top: 97.34, position: 'absolute', background: '#2F2E43' }}></div>
          <div style={{ width: 116.71, height: 5.26, left: 101.11, top: 127.88, position: 'absolute', background: '#2F2E43' }}></div>
          <div style={{ width: 124.70, height: 5.28, left: 101.12, top: 159.13, position: 'absolute', background: '#2F2E43' }}></div>
          <div style={{ width: 111.48, height: 5.51, left: 101.11, top: 189.21, position: 'absolute', background: '#2F2E43' }}></div>
          <div style={{ width: 148.37, height: 6.39, left: 101.10, top: 222.23, position: 'absolute', background: '#2F2E43' }}></div>
        </div>
        <div style={{ width: 194, height: 50, left: 46, top: 43, position: 'absolute' }}>
          <div style={{ width: 194, height: 50, left: 0, top: 0, position: 'absolute', color: 'black', fontSize: 40, fontFamily: 'JejuGothic', fontWeight: 400, wordWrap: 'break-word' }}>Journalist</div>
          <div style={{ width: 85, height: 8, left: 0, top: 42, position: 'absolute', background: '#F74923' }}></div>
        </div>
        <div style={{ left: 966, top: 312, position: 'absolute', color: 'black', fontSize: 40, fontFamily: 'jsMath-cmsy10', fontWeight: 500, wordWrap: 'break-word' }}> to  JO TO JOURNALIST TO </div>
        <div style={{ width: 454, height: 50, left: 131, top: 244, position: 'absolute' }}>
          <span style={{ color: 'black', fontSize: 45, fontFamily: 'Josefin Sans', fontWeight: 600, wordWrap: 'break-word' }}>Welcome to </span>
          <span style={{ color: '#F74923', fontSize: 45, fontFamily: 'Josefin Sans', fontWeight: 600, wordWrap: 'break-word' }}>Journalist</span>
          <span style={{ color: 'black', fontSize: 45, fontFamily: 'Josefin Sans', fontWeight: 600, wordWrap: 'break-word' }}> </span>
        </div>
        <div style={{ width: 170, height: 25, left: 158, top: 356, position: 'absolute', color: 'rgba(0, 0, 0, 0.70)', fontSize: 22, fontFamily: 'Inika', fontWeight: 400, wordWrap: 'break-word' }}>Email </div>
        <div style={{ width: 116, height: 30, left: 157, top: 470, position: 'absolute', color: 'rgba(0, 0, 0, 0.70)', fontSize: 22, fontFamily: 'Inika', fontWeight: 400, wordWrap: 'break-word' }}>Password</div>
        <div style={{ width: 400, height: 50, left: 157, top: 389, position: 'absolute' }}>
          <div style={{ width: 400, height: 50, left: 0, top: 0, position: 'absolute', background: 'linear-gradient(0deg, #F7F5F5 0%, #F7F5F5 100%), linear-gradient(0deg, #F3F3F3 0%, #F3F3F3 100%)', borderRadius: 10, border: '1px #F74923 solid' }}></div>
          <div style={{ width: 247, height: 26, left: 15, top: 17, position: 'absolute', color: 'rgba(0, 0, 0, 0.40)', fontSize: 20, fontFamily: 'JejuGothic', fontWeight: 400, wordWrap: 'break-word' }}>Enter email address</div>
        </div>
        <div style={{ width: 400, height: 50, left: 157, top: 624, position: 'absolute' }}>
          <div style={{ width: 400, height: 50, left: 0, top: 0, position: 'absolute', background: '#F74923', borderRadius: 10, border: '1px #F9785B solid' }}></div>
          <Link to="/second-page">     
 <div style={{ width: 70, height: 26, left: 160, top: 5, position: 'absolute', color: 'white', fontSize: 25, fontFamily: 'Chalkboard SE', fontWeight: 700, wordWrap: 'break-word' }}>Login</div>
        </Link>
        </div>
        <div style={{ width: 400, height: 50, left: 158, top: 500, position: 'absolute' }}>
          <div style={{ width: 400, height: 50, left: 0, top: 0, position: 'absolute', background: 'linear-gradient(0deg, #F7F5F5 0%, #F7F5F5 100%), linear-gradient(0deg, #F3F3F3 0%, #F3F3F3 100%)', borderRadius: 10, border: '1px #F74923 solid' }}></div>
          <div style={{ width: 247, height: 26, left: 15, top: 17, position: 'absolute', color: 'rgba(0, 0, 0, 0.40)', fontSize: 20, fontFamily: 'JejuGothic', fontWeight: 400, wordWrap: 'break-word' }}>Enter password</div>
        </div>
        <div style={{ width: 249, height: 18, left: 232, top: 703, position: 'absolute' }}>
          <span style={{ color: 'black', fontSize: 15, fontFamily: 'JejuGothic', fontWeight: 400, wordWrap: 'break-word' }}>Don’t have an account? </span>
          <span style={{ color: '#F9785B', fontSize: 15, fontFamily: 'JejuGothic', fontWeight: 400, wordWrap: 'break-word' }}>Register</span>
        </div>
        <div style={{ width: 121, height: 18, left: 444, top: 562, position: 'absolute', color: 'rgba(0, 0, 0, 0.80)', fontSize: 14, fontFamily: 'JejuGothic', fontWeight: 400, wordWrap: 'break-word' }}>Forgot Password</div>
      </div>
    </div>
  );
};

const SecondPage = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          This is the Second Page!
        </p>
        <Link to="/">
          <button
            style={{
              backgroundColor: 'blue',
              padding: '10px 20px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Go back
          </button>
        </Link>
      </header>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/second-page" element={<SecondPage />} />
      </Routes>
    </Router>
  );
}

export default App;
