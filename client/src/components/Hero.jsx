import React from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/all';
import { useMediaQuery } from 'react-responsive';


const Hero=()=> {
    const isMobile=useMediaQuery({maxWidth:767});
    useGSAP(()=>{
        const heroSplit=new SplitText('.title',{type:'chars,words'});
        const subheroSplit=new SplitText('.subheading',{type:'lines'});
        const subparaSplit=new SplitText('.sub2heading',{type:'lines'});
        gsap.from(heroSplit.chars,{
            yPercent:500,
            duration:1.8,
            ease:'expo.out',
            stagger:0.03
        });
        gsap.from(subheroSplit.lines,{
            opacity:0,
            yPercent:300,
            duration:1.8,
            ease:'expo.out',
            stagger:0.05,
            delay:1
        });
        gsap.from(subparaSplit.lines,{
            opacity:0,
            yPercent:100,
            duration:1.8,
            ease:'expo.out',
            stagger:0.05,
            delay:1.5
        });
    },[]);
  return (
    <div className="hero-container">
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src="/videos/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="hero-overlay">
        <h1 className="hero-heading title">Discover Your Next Freelance Opportunity</h1>
        <h2 className="hero-subheading subheading">Connect with Top Talent Worldwide</h2>
        <p className="hero-paragraph sub2heading ">
            <b>
          Welcome to our Freelance Marketplace, where clients and freelancers come together to create amazing projects. Whether you're looking to hire skilled professionals or showcase your expertise, our platform makes it easy to collaborate and succeed.
          </b>
        </p>
       
      </div>
    </div>
  );
}


export default Hero