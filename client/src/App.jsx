import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger,SplitText } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger,SplitText);
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Subhero from './components/Subhero';
const App = () => {
  return (
    <Router>
      <div>
        <Navbar/>
        <Hero/>
        <Subhero/>
      </div>

    </Router>
  )
}

export default App