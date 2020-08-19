import PFElement from "../../../@patternfly/pfelement/dist/pfelement.js"; // | umd

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
    this._navigationHandler = this._navigationHandler.bind(this);

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

    if (window.location.hash) {
      window.addEventListener('load', this._navigationHandler);
    }

    window.addEventListener('hashchange', this._navigationHandler);

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

  attributeChangedCallback(attr, oldVal, newVal) {
    super.attributeChangedCallback(attr, oldVal, newVal);

    switch (attr) {
      case "pfe-endpoint":
        this.loadData();
        break;
    }
  }

  /**
   * Handle any navigation action that points to an element in this element
   */
  _navigationHandler() {
    let anchorLinkTarget = this.shadowRoot.getElementById(window.location.hash.substring(1));
    if (anchorLinkTarget) {
      // Offset top may be an issue, if so see:
      // https://medium.com/@alexcambose/js-offsettop-property-is-not-great-and-here-is-why-b79842ef7582
      window.scrollTo(window.scrollX, anchorLinkTarget.offsetTop);
    }
  }

  /**
   * Handle initialization or changes in light DOM
   * Clone them into the shadowRoot
   */
  _processLightDom() {
    // Preventing issues in IE11 & Edge
    if (window.ShadyCSS) {
      this._observer.disconnect();
    }

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

    // Certain links need to be handled differently than normal
    // const validLinks = this.shadowRoot.querySelectorAll('a[href]');
    // for (let index = 0; index < validLinks.length; index++) {
    //   const validLink = validLinks[index];
    //   validLink.addEventListener('click', this._linkClickHandler);
    // }

    // Reconnecting mutationObserver for IE11 & Edge
    if (window.ShadyCSS) {
      this._observer.observe(this, lightDomObserverConfig);
    }
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
   * @return {object} The module data
   */
  getData() {
    if (Object.keys(this._moduleData).length) {
      return this._moduleData;
    }

    return null;
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
