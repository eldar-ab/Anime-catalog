/** TableHeaderButton. */
export class TableHeaderButton {
  /** Element. */
  public element: HTMLElement;

  /** Click handler. */
  public clickHandler: () => void;

  public constructor(id: string, clickHandler: () => void) {
    this.element = document.querySelector(id) as HTMLElement;
    this.clickHandler = clickHandler;
  }

  /** Set event listener. */
  public setEventListener(): void {
    this.element.addEventListener('click', () => {
      this.setButtonActive();
      this.changeActiveStatus();
      this.clickHandler();
      this.setButtonActive();
    });
  }

  /** Change active status. */
  private changeActiveStatus(): void {
    this.element.parentNode?.childNodes.forEach((item: ChildNode) => {
      if (item.nodeName !== '#text') {
        if ((item as HTMLElement).classList.contains('activated')) {
          (item as HTMLElement).classList.remove('activated');
        }
      }
    });
    this.setButtonActive();
  }

  /** Set button active. */
  public setButtonActive(): void {
    this.element.classList.add('activated');
  }
}
