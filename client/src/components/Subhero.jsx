import React from 'react'

function SubHero() {
  const categories = [
    { title: "Web Development", image: "/images/web_development.jpeg" },
    { title: "Graphic Design", image: "/images/graphic_design.jpeg" },
    { title: "Content Writing", image: "/images/content-writing.jpeg" },
    { title: "Digital Marketing", image: "/images/digital-marketing.jpeg" },
    { title: "Video Editing", image: "/images/video-editing.jpeg" },
    { title: "Mobile Development", image: "/images/mobile-development.jpeg" },
    { title: "Prompt writing", image: "/images/prompt-writing.jpeg" },
    { title: "Animation", image: "/images/animation.jpeg" },
  ];

  return (
    <section className="subhero-container">
      <h2 className="subhero-heading">Explore Our Services</h2>
      <div className="subhero-grid">
        {categories.map((category, index) => (
          <div key={index} className="subhero-card">
            <img src={category.image} alt={category.title} className="subhero-image" />
            <h3 className="subhero-card-heading">{category.title}</h3>
          </div>
        ))}
      </div>
      <div className='flex justify-center items-center px-8 py-4'>
        <button className="animated-button text-xl px-8 py-4 w-56 mx-auto ">
  <span className="text">Explore more</span>
  <svg className="arr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
  </svg>
  <svg className="arr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
  </svg>
  <span className="circle"></span>
</button>
      </div>
    </section>
  );
}

export default SubHero;