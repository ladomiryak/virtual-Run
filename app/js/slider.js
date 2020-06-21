import gsap, { Power1 } from "gsap";
import { splitWord, debounce } from "./utils.js";

// step page gradients
const gradientColors = {
  1: {
    color1: "#ffefeb",
    color2: "#ceabe6",
  },
  2: {
    color1: "#f8ebcd",
    color2: "#faae8e",
  },
  3: {
    color1: "#f1fdcb",
    color2: "#7abd82",
  },
};

function splitTitles(titles) {
  titles.forEach((title) => {
    splitWord(title);
  });
}

let currentSlide = 0;
let nextSlide = 0;
let slides = document.querySelectorAll(".slide");
let slideLength = slides.length;
let sliding = false;

let titles = document.querySelectorAll(".section .section-title");
let text = document.querySelectorAll(".section .section-text");
let buttons = document.querySelectorAll(".section .btn");

splitTitles(titles);

const slide = () => {
  const $currentSlide = slides[currentSlide];
  nextSlide = currentSlide >= slideLength - 1 ? 0 : currentSlide + 1;

  const $nextSlide = slides[nextSlide];
  const $body = document.body;
  const $currentSlideTitleChars = titles[currentSlide].children;
  const $nextSlideTitleChars = titles[nextSlide].children;
  const $slideText = text[nextSlide].children;
  const $slideButton = buttons[nextSlide];
  const ease = { ease: Power1.easeInOut };

  sliding = true;

  gsap
    .to([...$currentSlideTitleChars], {
      opacity: 0,
      stagger: 0.01,
      ...ease,
    })
    .delay();

  gsap
    .to($currentSlide, {
      duration: 0.5,
      x: -130,
      y: 0,
      z: -150,
      opacity: 0,
      ...ease,
    })
    .eventCallback("onComplete", () => {
      $currentSlide.classList.remove("active");
      $nextSlide.classList.add("active");
      currentSlide = nextSlide;
      $body.classList.add(`step-${currentSlide + 1}`);
      $body.classList.remove(
        `step-${currentSlide === 0 ? slideLength : currentSlide}`
      );
      setActiveNavItem();
      scroll = 0;

      gsap.to($body, {
        backgroundImage: `linear-gradient(${
          gradientColors[currentSlide + 1].color1
        },${gradientColors[currentSlide + 1].color2})`,
        duration: 1,
        ...ease,
      });

      gsap
        .fromTo(
          $nextSlide,
          0.5,
          { x: 130, y: 0, z: 150, opacity: 0, ...ease },
          { x: 0, y: 0, z: 0, opacity: 1, ...ease }
        )
        .eventCallback("onComplete", () => {
          sliding = false;
        });

      gsap.fromTo(
        [...$nextSlideTitleChars],
        {
          opacity: 0,
        },
        {
          opacity: 1,
          stagger: 0.04,
        }
      );

      gsap
        .from([...$slideText], 0.5, {
          y: 35,
          opacity: 0,
          stagger: 0.1,
          ...ease,
        })
        .delay(0.2);

      gsap
        .from($slideButton, {
          duration: 0.5,
          y: 35,
          opacity: 0,
          ...ease,
        })
        .delay(0.3);
    });
};

const setActiveNavItem = () => {
  const navItems = document.querySelectorAll(".slider-nav")[0].children;
  [...navItems].map((item, i) => {
    item.classList.remove("active");
    if (i === currentSlide) {
      item.classList.add("active");
    }
  });
};

const initSlideNav = () => {
  const body = document.body;
  const nav = document.createElement("ul");
  nav.classList.add("slider-nav");

  for (let i = 0; i < slideLength; i++) {
    const li = document.createElement("li");
    nav.appendChild(li);
  }
  body.appendChild(nav);

  setActiveNavItem();
};

initSlideNav();

window.addEventListener(
  "wheel",
  debounce((event) => {
    if (event.wheelDelta < 0 && !sliding) {
      slide();
    }
  }, 2000)
);

document.body.addEventListener(
  "click",
  debounce(() => {
    slide();
  }, 2000)
);
