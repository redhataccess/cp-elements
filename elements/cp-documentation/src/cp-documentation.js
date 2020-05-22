import PFElement from "../../pfelement/dist/pfelement.js";

// Config for mutation observer to see if things change inside of the component
const lightDomObserverConfig = {
  characterData: true,
  attributes: true,
  subtree: true,
  childList: true
};

class PfeDocumentation extends PFElement {
  static get tag() {
    return "cp-documentation";
  }

  get schemaUrl() {
    return "cp-documentation.json";
  }

  get templateUrl() {
    return "cp-documentation.html";
  }

  get styleUrl() {
    return "cp-documentation.scss";
  }

  static get events() {
    return {
      change: `${this.tag}:change`,
      loaded: `${this.tag}:loaded`
    };
  }

  // Declare the type of this component
  static get PfeType() {
    return PFElement.PfeTypes.Container;
  }

  static get observedAttributes() {
    return ["pfe-loaded", "pfe-endpoint", "pfe-css"];
  }

  constructor() {
    super(PfeDocumentation, { type: PfeDocumentation.PfeType });

    // Ensure 'this' is tied to the component object in these member functions
    this._processLightDom = this._processLightDom.bind(this);
    this._loadCss = this._loadCss.bind(this);
    this.loadData = this.loadData.bind(this);
    this.getData = this.getData.bind(this);

    // Setup mutation observer to watch for content changes
    this._observer = new MutationObserver(this._processLightDom);

    // Initialize object to store data in
    this._moduleData = {};
  }

  connectedCallback() {
    super.connectedCallback();

    this._processLightDom();

    this._observer.observe(this, lightDomObserverConfig);

    this.addEventListener(PfeDocumentation.events.change, this._changeHandler);
    this.addEventListener(PfeDocumentation.events.loaded, this._loadedHandler);

    if (this.hasAttribute("pfe-css")) {
      this._loadCss();
    }
  }

  disconnectedCallback() {
    this.removeEventListener(
      PfeDocumentation.events.change,
      this._changeHandler
    );
    this.removeEventListener(
      PfeDocumentation.events.loaded,
      this._loadedHandler
    );
  }

  /**
   * Handle initialization or changes in light DOM
   * Clone them into the shadowRoot
   */
  _processLightDom() {
    // @todo Check for window.shadyCss, if that exists need to disconnect mutationObserver, see IE11 & Edge
    const shadowWrapper = this.shadowRoot.getElementById("wrapper"),
      oldContentWrapper = this.shadowRoot.getElementById("content"),
      // An element that light dom content will be put into and replaces the shadowWrapper at the end
      newContentWrapper = document.createElement("div");

    this.childNodes.forEach(childNode => {
      const cloneNode = childNode.cloneNode(true);
      newContentWrapper.append(cloneNode);
    });

    if (oldContentWrapper) {
      shadowWrapper.replaceChild(newContentWrapper, oldContentWrapper);
    } else {
      shadowWrapper.append(newContentWrapper);
    }
    newContentWrapper.setAttribute("id", "content");
    // @todo Check for shadyCss, if that exists need to reconnect mutationObserver, see IE11 & Edge
  }

  _loadCss() {
    // If we have an attribute and the CSS hasn't been loaded yet
    if (
      this.hasAttribute("pfe-css") &&
      !this.shadowRoot.getElementById("pfe-css")
    ) {
      const pfeCssUrl = this.getAttribute("pfe-css");
      const linkTag = document.createElement("link");
      linkTag.setAttribute("id", "pfe-css");
      linkTag.setAttribute("href", pfeCssUrl);
      linkTag.setAttribute("rel", "stylesheet");
      this.shadowRoot.append(linkTag);
    }
  }

  /**
   * Get the content from pfe-endpoint attribute
   *
   * Also loads the body content
   */
  loadData() {
    const endpointUrl = this.getAttribute("pfe-endpoint");
    // @todo local caching?
    if (endpointUrl) {
      fetch(endpointUrl)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (typeof data.module === "object") {
            this.setAttribute("pfe-loaded", "");
            this._moduleData = data.module;
            if (this._moduleData.body) {
              this.innerHTML = this._moduleData.body;
            }
          }
        })
        .catch(error => console.log(`${this.tag}: ${error}`));
    }
  }

  /**
   * Allows parent DOM to access the module data
   */
  getData() {
    if (Object.keys(this._moduleData).length) {
      return this._moduleData;
    }

    return null;
  }


  // Process the attribute change
  attributeChangedCallback(attr, oldValue, newValue) {
    super.attributeChangedCallback(attr, oldValue, newValue);
  }

  _changeHandler(event) {
    this.emitEvent(PfeDocumentation.events.change, {
      detail: {}
    });
  }

  _loadedHandler(event) {
    this.emitEvent(PfeDocumentation.events.loaded, {
      detail: {}
    });
  }
}

PFElement.create(PfeDocumentation);

export default PfeDocumentation;
