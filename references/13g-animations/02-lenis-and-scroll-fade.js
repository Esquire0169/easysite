const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing standard
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  smoothTouch: true,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)



var tricksWord = document.getElementsByClassName("tricks");
for (var i = 0; i < tricksWord.length; i++) {
    var wordWrap = tricksWord.item(i);
    wordWrap.innerHTML = wordWrap.innerHTML.replace(/(^|<\/?[^>]+>|\s+)([^\s<]+)/g, '$1<span class="tricksword">$2</span>');
}
var tricksLetter = document.getElementsByClassName("tricksword");
for (var i = 0; i < tricksLetter.length; i++) {
    var letterWrap = tricksLetter.item(i);
    letterWrap.innerHTML = letterWrap.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
}
// animation stagger scroll
function myFade() {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.defaults({
    markers: false
  });
  // animation stagger scroll
  $("[fade-up-holder]").each(function () {
    let trigger = $(this)[0];
    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: "top bottom-=10%",
        once: false,
        markers: false
      },
      delay: 0.2
    });
    let elements = $(this).find(
      "[fade-up], [fade-nav], [fade-up-hero-delay], .tricksword, .divider, .divider .vertical, [fade-right], [fade-left]"
    );
    elements.each(function () {
      if ($(this).hasClass("tricksword")) {
        gsap.set($(this)[0], {
          y: 30
        });
        timeline.to(
          $(this)[0],
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out"
          },
          "<0.005"
        );
      } else if ($(this).hasClass("divider")) {
        if ($(this).hasClass("vertical")) {
          gsap.set($(this)[0], {
            height: "0%"
          });
          timeline.to(
            $(this),
            {
              height: "100%",
              opacity: 1,
              duration: 1.2,
              ease: "expo.out"
            },
            "<0.29"
          );
        } else {
          gsap.set($(this)[0], {
            width: "0%"
          });
          timeline.to(
            $(this),
            {
              width: "90%",
              opacity: 1,
              duration: 1.2,
              ease: "expo.out"
            },
            "<0.29"
          );
        }
      } else if ($(this).is("[fade-nav]")) {
        gsap.set($(this)[0], {
          y: -50
        });
        timeline.to(
          $(this),
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out"
          },
          "<0.06"
        );
      } else if ($(this).is("[fade-up-hero-delay]")) {
        gsap.set($(this)[0], {
          y: 100
        });
        timeline.to(
          $(this),
          {
            y: 0,
            opacity: 1,
            duration: 1.8,
            ease: "expo.out"
          },
          "<0.20"
        );
      } else if ($(this).is("[fade-right]")) {
        gsap.set($(this)[0], {
          x: -50,
          opacity: 0
        });
        timeline.to(
          $(this),
          {
            x: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out"
          },
          "<0.09"
        );
      } else if ($(this).is("[fade-left]")) {
        gsap.set($(this)[0], {
          x: 50,
          opacity: 0
        });
        timeline.to(
          $(this),
          {
            x: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out"
          },
          "<0.09"
        );
      } else {
        gsap.set($(this)[0], {
          y: 50,
          opacity: 0
        });
        timeline.to(
          $(this),
          {
            y: 0,
            opacity: 1,
            duration: 1.8,
            ease: "expo.out"
          },
          "<0.09"
        );
      }
    });
  });
}