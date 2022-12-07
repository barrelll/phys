import { LitElement, html } from 'lit';

export class RenderRoot extends LitElement {
  static properties = {
    id: { String },
  };
  constructor() {
    super();
    this.id = 'c';
  }

  getCanvas() {
    let childElement = this.shadowRoot.querySelector("#c");
    return childElement;
  }

  // Render the UI as a function of component states
  render() {
    return html`<canvas id="${this.id}"></canvas>`;
  }
}
customElements.define('render-root', RenderRoot);
