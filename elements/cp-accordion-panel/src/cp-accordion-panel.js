import Rhelement from "../rhelement/rhelement.js";

/*
 * DO NOT EDIT. This will be autopopulated with the
 * html from cp-accordion-panel.html and css from
 * cp-accordion-panel.css
 */
const template = document.createElement("template");
template.innerHTML = ``;
/* end DO NOT EDIT */

class CpAccordionPanel extends Rhelement {
  constructor() {
    super("cp-accordion-panel", template);
  }

  get expanded() {
    return this.hasAttribute("expanded");
  }

  set expanded(val) {
    const value = Boolean(val);

    if (value) {
      this.setAttribute("expanded", "");
    } else {
      this.removeAttribute("expanded");
    }
  }
}

window.customElements.define("cp-accordion-panel", CpAccordionPanel);
