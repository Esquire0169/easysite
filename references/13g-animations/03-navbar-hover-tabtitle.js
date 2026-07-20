function handleNavbarLogoOpacity() {
  const logo = document.querySelector('.navbar__logo');
  const scrollThreshold = 0.05;

  logo.style.transition = 'opacity 0.3s ease';

  window.addEventListener('scroll', () => {
    const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    
    if (scrollPercentage >= scrollThreshold) {
      logo.style.opacity = '0';
    } else {
      logo.style.opacity = '1';
    }
  });
}

document.addEventListener('DOMContentLoaded', handleNavbarLogoOpacity);


$(document).ready(function () {
  $(".button__contact__nav").hover(
    function () {
      gsap.to($(this).find(".fake-arrow-width"), {
        width: "100%",
        duration: 0.8,
        ease: "power2.inOut",
      });

      gsap.to(this, {
        paddingLeft: "1.11rem",
        paddingRight: "3.4rem",
        backgroundColor: "#8ddd8d",
        color: "#131313",
        duration: 0.8,
        ease: "power2.inOut",
      });

      gsap.to($(this).find(".icon-arrow-green-block"), {
        backgroundColor: "#131313",
        duration: 0.8,
        ease: "power2.inOut",
      });

      gsap.to($(this).find(".icon-arrow-green-block svg"), {
        color: "#ffffff",
        duration: 0.8,
        ease: "power2.inOut",
      });
    },
    function () {
      gsap.to($(this).find(".fake-arrow-width"), {
        width: "0%",
        duration: 0.8,
        ease: "power2.inOut",
      });

      gsap.to(this, {
        paddingLeft: "3.4rem",
        paddingRight: "1.11rem",
        backgroundColor: "#2b2b2b",
        color: "#ffffff",
        duration: 0.8,
        ease: "power2.inOut",
      });

      gsap.to($(this).find(".icon-arrow-green-block"), {
        backgroundColor: "#8ddd8d",
        duration: 0.8,
        ease: "power2.inOut",
      });

      gsap.to($(this).find(".icon-arrow-green-block svg"), {
        color: "#131313",
        duration: 0.8,
        ease: "power2.inOut",
      });
    },
  );
});


    function changeTabTitle(newTitle) {
        document.title = newTitle;
      }
      
      const originalTitle = document.title;
      
      document.addEventListener("visibilitychange", function() {
        if (document.hidden) {
          changeTabTitle("👋 Pssssht!");
        } else {
          changeTabTitle(originalTitle);
        }
      });