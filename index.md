---
layout: single-page
title: "Tejas Prabhu - Software, DevOps & Cloud Engineer"
---

<!-- Hero Section -->
<section id="hero" class="hero-section">
  <div class="hero-content">
    <h1>Hi, I'm Tejas Prabhu</h1>
    <p>Software, DevOps & Cloud Engineer</p>
    <a href="#projects" class="button">Explore My Work</a>
  </div>
</section>

<!-- About Section -->
<section id="about" class="about-section">
  <div class="about-container">
    <img src="/assets/images/avatar.jpg" alt="Tejas Prabhu" class="profile-pic">
    <div class="about-content">
      <h2>About Me</h2>
      <p>Back in 2012, I decided to try my hand at creating custom Tumblr themes and tumbled head first into the rabbit hole of coding and web development. Fast-forward to today, and I’ve had the privilege of building software for an advertising agency, a start-up, a huge corporation, and a digital product studio.</p>
      <p>My main focus these days is building accessible user interfaces for our customers at Klaviyo. I most enjoy building software in the sweet spot where design and engineering meet — things that look good but are also built well under the hood. In my free time, I've also released an online video course that covers everything you need to know to build a web app with the Spotify API.</p>
      <p>When I’m not at the computer, I’m usually rock climbing, reading, hanging out with my wife and two cats, or running around Hyrule searching for Korok seeds.</p>
    </div>
  </div>
</section>

<!-- Skills Section -->
<section id="skills" class="skills-section">
  <div class="skills-container">
    <h2>Skills</h2>
    <div class="skill">
      <h3>Python</h3>
      <div class="progress">
        <div class="progress-bar python"></div>
      </div>
    </div>
    <div class="skill">
      <h3>Golang</h3>
      <div class="progress">
        <div class="progress-bar golang"></div>
      </div>
    </div>
    <div class="skill">
      <h3>AWS</h3>
      <div class="progress">
        <div class="progress-bar aws"></div>
      </div>
    </div>
    <!-- Add more skills similarly -->
  </div>
</section>

<!-- Experience Section -->
<section id="experience" class="experience-section">
  <h2>Experience</h2>
  <div class="experience-item">
    <h3>Seagate Technologies</h3>
    <p>Led an 8-person global team, enhancing RAID product quality by developing and expanding a test automation framework. Achieved a 37% reduction in test time and improved resource allocation efficiency by 15%.</p>
  </div>
  <div class="experience-item">
    <h3>North Carolina Institute for Climate Studies</h3>
    <p>Cloud Engineer Intern responsible for optimizing cloud solutions and accelerating climate science research. Developed and optimized ETL pipelines using AWS services, reducing data processing time by 60% and automating data pipelines with Infrastructure as Code (IaC).</p>
  </div>
  <!-- Add more experience items as needed -->
</section>

<!-- Projects Section -->
<section id="projects" class="projects-section">
  <div class="projects-container">
    <h2>Projects</h2>
    <div class="projects-grid">
      
      {% include project-card.html
        image="/assets/images/projects/ironclad.png"
        title="Ironclad"
        description="A comprehensive CI/CD environment on AWS using Terraform and Ansible."
        repo="https://github.com/TejasPrabhu/Ironclad"
        demo="https://ironclad-demo.com"
      %}
      
      {% include project-card.html
        image="/assets/images/projects/donatify.png"
        title="Donatify"
        description="Developed a donation platform with user authentication and automated testing."
        repo="https://github.com/TejasPrabhu/Donatify"
        demo="https://donatify-demo.com"
      %}
      
      <!-- Add more project includes similarly -->
      
    </div>
  </div>
</section>

<!-- Testimonials Section -->
<section id="testimonials" class="testimonials-section">
  <div class="testimonials-container">
    <h2>Testimonials</h2>
    <div class="carousel">
      
      <div class="testimonial">
        <blockquote>"Tejas consistently demonstrated exceptional skills in DevOps and cloud engineering, significantly improving our infrastructure efficiency."</blockquote>
        <p>— John Doe, Senior Engineer at Seagate Technologies</p>
      </div>
      
      <div class="testimonial">
        <blockquote>"His ability to lead a global team and streamline our automation processes was invaluable."</blockquote>
        <p>— Jane Smith, Project Manager at North Carolina Institute for Climate Studies</p>
      </div>
      
      <!-- Add more testimonials as needed -->
      
    </div>
  </div>
</section>

<!-- Contact Section -->
<section id="contact" class="contact-section">
  <div class="contact-container">
    <h2>Contact Me</h2>
    <p>I'm always open to discussing new opportunities, collaborations, or just a friendly chat. Feel free to reach out!</p>
    
    <div class="contact-info">
      <p><strong>Email:</strong> <a href="mailto:tejas.prabhu.career@gmail.com">tejas.prabhu.career@gmail.com</a></p>
      <p><strong>Phone:</strong> 919-771-4660</p>
      <p><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/tejasprabhu" target="_blank">linkedin.com/in/tejasprabhu</a></p>
      <p><strong>GitHub:</strong> <a href="https://github.com/TejasPrabhu" target="_blank">github.com/TejasPrabhu</a></p>
    </div>
    
    <div class="contact-form">
      <form action="https://formspree.io/f/your-form-id" method="POST">
        <label for="name">Name</label>
        <input type="text" name="name" id="name" required>
        
        <label for="email">Email</label>
        <input type="email" name="_replyto" id="email" required>
        
        <label for="message">Message</label>
        <textarea name="message" id="message" rows="5" required></textarea>
        
        <button type="submit">Send Message</button>
      </form>
    </div>
    
    <a href="/assets/docs/resume.pdf" class="button" download>Download My Resume</a>
  </div>
</section>
