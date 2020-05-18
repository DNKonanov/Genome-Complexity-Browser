// функция для убийства всех объектов тултипов (без нее временами забаговывалиль тултипы после загрузки нового графа)
export default function removeAllTips() {
    var elements = document.getElementsByClassName('tippy-popper');
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}