import React from 'react'

function SubHero() {
  const categories = [
    { title: "Web Development", image: "/images/web-development.jpg" },
    { title: "Graphic Design", image: "/images/graphic-design.jpg" },
    { title: "Content Writing", image: "/images/content-writing.jpg" },
    { title: "Digital Marketing", image: "/images/digital-marketing.jpg" },
    { title: "Video Editing", image: "/images/video-editing.jpg" },
    { title: "Mobile Development", image: "/images/mobile-development.jpg" },
    { title: "Prompt writing", image: "/images/mobile-development.jpg" },
    { title: "Animation", image: "/images/mobile-development.jpg" },
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
    </section>
  );
}

export default SubHero;