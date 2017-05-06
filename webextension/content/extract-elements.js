function extractElements() {
    const els = document.querySelectorAll("*"),
        elements = [];

    for(const el of els) {
        if(el.id || el.classList.length > 0) {
            const element = {
                classes: []
            };
            if(el.id) {
                element.id = el.id;
            }

            if(el.classList.length > 0) {
                element.classes = Array.from(el.classList.values());
            }
            elements.push(element);
        }
    }

    return elements;
}
extractElements();
