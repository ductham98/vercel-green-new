document.querySelectorAll(".footer-btn").forEach(btn => {

    btn.onclick = () => {

        const content = btn.nextElementSibling
        const icon = btn.querySelector("img")

        const isOpen = content.classList.contains("max-h-96")

        document.querySelectorAll(".footer-content").forEach(c => {
            c.classList.remove("max-h-96")
            c.classList.add("max-h-0")
        })

        document.querySelectorAll(".footer-btn img").forEach(i => {
            i.style.transform = "rotate(0deg)"
        })

        if (!isOpen) {
            content.classList.remove("max-h-0")
            content.classList.add("max-h-96")
            icon.style.transform = "rotate(180deg)"
        }

    }

})