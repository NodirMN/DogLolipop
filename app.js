console.clear();

gsap.registerPlugin(Observer, Draggable);

const SVG = document.querySelector("#SVG");

// ADD BACKGROUND ANIMATION
gsap.to(".bg", {
    xPercent: -50,
    repeat: -1,
    ease: "none",
    duration: 10
});

// LEGS ANIMATION - lil runsss
gsap.to('.legs', {
    keyframes: {
        yPercent: [-5, 0, 20, 0, -5],
        xPercent: [0, 10, 0, -10, 0],
        easeEach: 'none',
        ease: 'power1.inOut'
    },
    duration: 0.4,
    ease: 'none',
    repeat: -1,
    transformOrigin: 'center center'
})

// FACE ANIMATION - bopping about
gsap.to('#face', {
    keyframes: {
        yPercent: [-10, 0, 10, 0, -10],
        xPercent: [0, 5, 0, -5, 0],
        easeEach: 'none',
        ease: 'power1.inOut'
    },
    duration: 0.4,
    ease: 'none',
    repeat: -1,
    transformOrigin: 'center center'
})

// RAINBOW BUTT EXPLOSION TIME
let rainbowExplosion = gsap.timeline({})
rainbowExplosion.to("#rainbow rect", {
        opacity: 1
    })
    .fromTo("#rainbow rect", {
        yPercent: i => i % 2 === 0 ? -2 : 2
    }, {
        yPercent: i => i % 2 === 0 ? 2 : -2,
        repeat: 10,
        duration: 0.2,
        yoyo: true,
        ease: "sine.inOut",
    })
    .to("#rainbow rect", {
        opacity: 0,
        duration: 3
    }, '<')

// clamp and map our values into a useable range
var transformer = gsap.utils.pipe(
    gsap.utils.clamp(-21000, 21000),
    gsap.utils.mapRange(-21000, 21000, -40, 40)
);

// quickTo is new in GSAP 3.10
let yTo = gsap.quickTo(SVG, "y");
let xTo = gsap.quickTo(SVG, "x");
let rotationTo = gsap.quickTo("#corgi", "rotation")
gsap.set("#corgi", {
    transformOrigin: "center center"
});

/*
Also brand new in GSAP 3.10

Use Observer as a standalone plugin...
https://greensock.com/docs/v3/Plugins/Observer

or use the minimal version included in ScrollTrigger... 
https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.observe()

*/

Observer.create({
    type: "wheel,touch,scroll,pointer", // comma-delimited list of what to listen for
    onChangeY: (self) => {
        yTo(self.deltaY);
        rotationTo(transformer(self.velocityY));
    }
});

// Add some tasty snax!
let container = document.querySelector(".container")

function addFood() {
    const lollypop = document.createElement("span");
    lollypop.classList.add("lollypop")
    lollypop.innerHTML = '🍭'
    container.appendChild(lollypop);

    gsap.set(lollypop, {
        left: window.innerWidth + 'px',
        top: gsap.utils.random(40, window.innerHeight - 40, 5) + 'px',
    })

    gsap.to(lollypop, {
        x: -1 * (window.innerWidth + 300),
        duration: gsap.utils.random(1, 6, 0.5),
        ease: 'power1.in',
        onUpdate: () => {
            checkHit(lollypop)
        }
    })
}

// HIT TEST!!
function checkHit(elem) {
    console.log(Draggable.hitTest("#SVG", elem))
    if (Draggable.hitTest("#SVG", elem)) {
        console.log('boop')
        rainbowExplosion.restart();
        gsap.to(elem, {
            scale: 0,
            transformOrigin: 'left center',
            duration: 0.1,
            onComplete: function () {
                elem.remove()
            }
        })
    }
}

gsap.set(addFood, {
    onRepeat: addFood,
    repeat: -1,
    duration: 1,
    repeatDelay: 1
})