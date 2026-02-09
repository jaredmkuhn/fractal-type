export function createButton(
    document: Document,
    innerText: string,
    size: number,
    positionTop: string,
): HTMLButtonElement {
    const translateTop = positionTop === '50%' ? ', -50%' : '';
    const button = document.createElement('button');
    button.innerText = innerText;
    button.style.position = 'absolute';
    button.style.top = positionTop;
    button.style.left = '50%';
    button.style.transform = `translate(-50%${translateTop})`;
    button.style.fontSize = `${size}px`;
    button.style.padding = '10px 20px';
    button.style.zIndex = '100';
    return button;
}
