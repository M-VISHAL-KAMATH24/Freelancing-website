import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger,SplitText } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger,SplitText);
import './index.css';
import Navbar from './components/Navbar';
const App = () => {
  return (
    <Router>
      <div>
        <Navbar/>
      </div>

    </Router>
  )
}

export default App