export default function injectElement(html, parent_id) {
    const parent = document.getElementById(parent_id)
    parent.innerHTML = html
}
