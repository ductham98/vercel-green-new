document.querySelectorAll(".feedback").forEach((feedback) => {

  const track = feedback.querySelector("#testimonial-track");
  const dots = feedback.querySelectorAll("#dots button");
  const prev = feedback.querySelector("#prev");
  const next = feedback.querySelector("#next");

  let index = 0;
  const total = dots.length;

  function updateSlider(i) {
    index = (i + total) % total;

    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((dot, d) => {
      dot.classList.toggle("bg-gray-900", d === index);
      dot.classList.toggle("bg-gray-300", d !== index);
    });
  }

  dots.forEach((dot, i) => {
    dot.onclick = () => updateSlider(i);
  });

  if (prev) prev.onclick = () => updateSlider(index - 1);
  if (next) next.onclick = () => updateSlider(index + 1);

});