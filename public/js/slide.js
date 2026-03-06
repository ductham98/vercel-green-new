const FEATURES = [
"/public/meta/verified-badge.jpg",
"/public/meta/impersonation.jpg",
"/public/meta/enhanced-support.jpg",
"/public/meta/profile-features.jpg"
];

const items = document.querySelectorAll("#feature-list > div");
const image = document.getElementById("feature-image");

items.forEach((item,i)=>{
  item.addEventListener("click",()=>{

    items.forEach(el=>{
      el.classList.remove("text-[#1c2b33]");
      el.classList.add("text-gray-500");

      el.querySelector(".desc").classList.add("hidden");
      el.querySelector(".icon").src="/public/meta/ic_plus.svg";
    });

    item.classList.add("text-[#1c2b33]");
    item.classList.remove("text-gray-500");

    item.querySelector(".desc").classList.remove("hidden");
    item.querySelector(".icon").src="/public/meta/ic_apart.svg";

    image.classList.add("opacity-0","scale-110","translate-x-4");

    setTimeout(()=>{
      image.src = FEATURES[i];
      image.classList.remove("opacity-0","scale-110","translate-x-4");
    },200);

  });
});


/* mobile slider */

const slider = document.getElementById("slider");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const dots = document.querySelectorAll("#dots span");

let index = 0;

function updateSlider(i){
  const width = slider.clientWidth;
  slider.scrollTo({left: width*i, behavior:"smooth"});
  index = i;

  dots.forEach((d,di)=>{
    d.classList.toggle("bg-[#1c2b33]",di===i);
    d.classList.toggle("bg-gray-300",di!==i);
  });
}

prev.onclick = ()=> updateSlider(Math.max(index-1,0));
next.onclick = ()=> updateSlider(Math.min(index+1,dots.length-1));

slider.addEventListener("scroll",()=>{
  const width = slider.clientWidth;
  const i = Math.round(slider.scrollLeft/width);
  index = i;
});