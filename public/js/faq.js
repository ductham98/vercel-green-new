document.querySelectorAll(".faq-item").forEach((item, index) => {

    const btn = item.querySelector(".faq-btn")
    const content = item.querySelector(".faq-content")
    const icon = item.querySelector(".faq-icon")
  
    btn.onclick = () => {
  
      const isOpen = content.classList.contains("max-h-40")
  
      document.querySelectorAll(".faq-content").forEach(c=>{
        c.classList.remove("max-h-40","grid-rows-[1fr]","opacity-100")
        c.classList.add("max-h-0","grid-rows-[0fr]","opacity-0")
      })
  
      document.querySelectorAll(".faq-icon").forEach(i=>{
        i.classList.remove("rotate-180")
      })
  
      if(!isOpen){
        content.classList.remove("max-h-0","grid-rows-[0fr]","opacity-0")
        content.classList.add("max-h-40","grid-rows-[1fr]","opacity-100")
        icon.classList.add("rotate-180")
      }
  
    }
  
  })