/**
 * 13g.fr — loader + soft page leave (from https://13g.netlify.app/loader.js)
 * Vite export: `export { s as i }` → main.js calls it on window "load".
 *
 * Depends on: gsap, global myFade() from inline scroll-fade script.
 */

export function initLoader() {
  // Replay full loader at most once per hour
  if (!shouldPlayLoader()) return;
  playLoader();
}

function shouldPlayLoader() {
  const lastVisit = localStorage.getItem("lastVisit");
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  if (!lastVisit || now - parseInt(lastVisit, 10) > oneHour) {
    localStorage.setItem("lastVisit", String(now));
    return true;
  }
  return false;
}

function playLoader() {
  if (localStorage.getItem("loaderPlayed") === "true") {
    document.querySelector(".loader").style.display = "none";
    myFade();
    return;
  }

  const loader = document.querySelector(".loader");
  const logo = document.querySelector(".logo-loader-gsap");
  const colors = ["#131313", "#faaafa", "#e0e055", "#8ddd8d", "#6066ee", "#FFFFFF"];

  setTimeout(() => {
    gsap.fromTo(
      logo,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        onComplete: () => {
          gsap.to(logo, {
            y: "-100%",
            duration: 1,
            ease: "power3.out",
            onComplete: flashColors,
          });
        },
      },
    );
  }, 200);

  function flashColors(index = 0) {
    if (index >= colors.length) {
      exitLoader();
      return;
    }
    gsap.to(loader, {
      backgroundColor: colors[index],
      duration: 0.2,
      ease: "power1.inOut",
      onComplete: () => {
        if (index < colors.length - 1) {
          setTimeout(() => flashColors(index + 1), 300);
        } else {
          exitLoader();
        }
      },
    });
  }

  function exitLoader() {
    gsap.to(loader, {
      y: "-100%",
      duration: 1.2,
      ease: "power3.out",
      onComplete: () => {
        loader.style.display = "none";
        myFade();
        localStorage.setItem("loaderPlayed", "true");
      },
    });
  }
}

/** Soft leave: fade/slide page-wrapper before navigating internal links */
function leavePage(instant = false) {
  const page = document.querySelector(".page-wrapper");
  if (instant) {
    gsap.set(page, { opacity: 1, y: 0 });
    return Promise.resolve();
  }
  return gsap.to(page, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power2.inOut",
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href) return;
    if (href.startsWith("/") || href.includes("/projets")) {
      event.preventDefault();
      leavePage().then(() => {
        window.location.href = href;
      });
    }
  });

  window.addEventListener("popstate", () => {
    leavePage(true);
  });
});

window.onpageshow = function (event) {
  if (event.persisted) {
    const page = document.querySelector(".page-wrapper");
    gsap.set(page, { opacity: 1, y: 0 });
  }
};

// Boot (mirrors original)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (shouldPlayLoader()) playLoader();
  });
} else if (shouldPlayLoader()) {
  playLoader();
}
