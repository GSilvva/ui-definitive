const events = ["DOMContentLoaded", "scroll", "load"]

// SECTIONS
events.forEach(event =>  {
  window.addEventListener(event, () => {
    document.querySelectorAll("[data-animate]").forEach(element => {
      let top = element.getBoundingClientRect().top
      let height = (window.innerHeight || document.documentElement.clientHeight)
    
      top <= height / 1.1 ? element.classList.add("active") : false
    })
  })
})

// NAVBAR
const nav = document.querySelector(".nav")

events.forEach(event =>  {
  window.addEventListener(event, () => {
    if(document.body.scrollTop > 24 || document.documentElement.scrollTop > 24) nav.classList.add("fixed")
    else nav.classList.remove("fixed")
  })
})

// VIDEO
const btnVideo = document.querySelector(".page__header__top__video button")
const modalVideo = document.querySelector(".video")
const closeVideo = modalVideo.querySelector("button")

btnVideo.addEventListener("click", () => modalVideo.classList.add("open"))
closeVideo.addEventListener("click", () => modalVideo.classList.remove("open"))

// BUTTONS
const buttons = document.querySelectorAll(".button")
const modal = document.querySelector(".modal")

buttons.forEach(button => {
  const rect = button.getBoundingClientRect()
  const light = button.querySelector("div")

  gsap.set(light, { xPercent: -50, yPercent: -50 })

  button.addEventListener("mousemove", e => {
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    gsap.to(light, {
      x: mouseX,
      y: mouseY,
      duration: 0.1
    })
  })

  button.addEventListener("click", () => modal.classList.add("open"))
})

modal.querySelector("[data-close]").addEventListener("click", () => modal.classList.remove("open"))

// CASES
const marquee = gsap.utils.toArray(".page__cases__marquee__images__image")
const loop = horizontalLoop(marquee, {
  paused: false,
  repeat: -1,
  speed: 1,
})

function increaseSpeedOnScroll(loop, maxSpeed, acceleration) {
  let currentSpeed = 1;
  let isScrolling;

  // Ajuste a velocidade baseada no evento de rolagem
  function adjustSpeed() {
    // Aumenta a velocidade conforme o usuário rola para baixo
    currentSpeed = Math.min(maxSpeed, currentSpeed + acceleration);
    loop.timeScale(currentSpeed);
  }

  // Adiciona o ouvinte de evento de rolagem
  window.addEventListener("scroll", () => {
    // Limpa o temporizador para evitar chamadas duplicadas
    clearTimeout(isScrolling);
    // Define um temporizador para verificar se o usuário parou de rolar
    isScrolling = setTimeout(adjustSpeed, 150);
  });
}

// Chame a função para aumentar a velocidade enquanto o usuário rola
increaseSpeedOnScroll(loop, 2, 0.1);

function horizontalLoop(items, config) {
	items = gsap.utils.toArray(items)
	config = config || {}
	let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
		length = items.length,
		startX = items[0].offsetLeft,
		times = [],
		widths = [],
		xPercents = [],
		curIndex = 0,
		pixelsPerSecond = (config.speed || 1) * 100,
		snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1),
		totalWidth, curX, distanceToStart, distanceToLoop, item, i
	gsap.set(items, {
		xPercent: (i, el) => {
			let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"))
			xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"))
			return xPercents[i]
		}
	})
	gsap.set(items, {x: 0})
	totalWidth = items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0)
	for (i = 0; i < length; i++) {
		item = items[i];
		curX = xPercents[i] / 100 * widths[i];
		distanceToStart = item.offsetLeft + curX - startX;
		distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
		tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
		  .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
		  .add("label" + i, distanceToStart / pixelsPerSecond);
		times[i] = distanceToStart / pixelsPerSecond;
	}
	function toIndex(index, vars) {
		vars = vars || {};
		(Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length);
		let newIndex = gsap.utils.wrap(0, length, index),
			time = times[newIndex];
		if (time > tl.time() !== index > curIndex) {
			vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
			time += tl.duration() * (index > curIndex ? 1 : -1);
		}
		curIndex = newIndex;
		vars.overwrite = true;
		return tl.tweenTo(time, vars);
	}
	tl.next = vars => toIndex(curIndex+1, vars);
	tl.previous = vars => toIndex(curIndex-1, vars);
	tl.current = () => curIndex;
	tl.toIndex = (index, vars) => toIndex(index, vars);
	tl.times = times;
  tl.progress(1, true).progress(0, true);
  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
	return tl;
}

// EXPANSÍVEIS
const exps = document.querySelectorAll("dt")

exps.forEach(exp => {
  exp.addEventListener("click", e => {
    e.currentTarget.classList.toggle("open")
    e.currentTarget.nextElementSibling?.classList.toggle("open")
  })
})

// FEATURES
const icons = document.querySelectorAll("[data-balloon]");

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function checkVisibilityAndAnimate() {
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const scrollY = window.scrollY || window.pageYOffset;

  if (icons) {
    icons.forEach(icon => {
      if (isElementInViewport(icon)) {
        let y = scrollY / 70;
        icon.style.transform = `translate3d(0px, -${y}px, 0px)`;
      }
    });
  }
}

events.forEach(event => window.addEventListener(event, checkVisibilityAndAnimate));

window.addEventListener("load", checkVisibilityAndAnimate);

// PHRASE
const linesTitle = document.querySelectorAll("[data-title] p")
linesTitle.forEach(line => line.innerHTML += "<div></div>")

function AnimationTitles(title, elem) {
  const lines = gsap.utils.toArray(elem)

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: title,
      start: "top 80%",
      end: "bottom 30%",
      scrub: true,
      markers: false
    }
  })

  lines.forEach(lines => {
    tl.to(lines, {
      width: 0,
      duration: 1,
      scrub: true,
      ease: "power2.easeIn"
    })
  })
}

AnimationTitles("[data-title]", "[data-title] div")

// QUESTIONS
new Swiper(".page__questions .swiper", {
  effect: "fade",
  navigation: {
    prevEl: ".page__questions [data-prev]",
    nextEl: ".page__questions [data-next]"
  },
  pagination: {
    el: ".page__questions [data-pagination]",
    clickable: true
  }
})

// BACK TO TOP
const btnTop = document.querySelector("[data-top]")

btnTop.addEventListener("click", () => {
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
})