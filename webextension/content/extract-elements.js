function extractElements() {
    const els = document.querySelectorAll("*"),
        elements = [];

    for(const el of els) {
        if(el.id || el.classList.length) {
            const element = {
                classes: []
            };
            if(el.id) {
                element.id = el.id;
            }

            if(el.classList.length) {
                element.classes = Array.from(el.classList.values());
            }
            elements.push(element);
        }
    }

    return elements;
}
extractElements();
