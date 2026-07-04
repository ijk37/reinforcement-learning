// MathJax config for pymdownx.arithmatex (generic mode).
// arithmatex wraps math as \( ... \) / \[ ... \] inside .arithmatex spans;
// MathJax typesets only those. Re-typeset on Material's instant navigation.
window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true,
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex",
  },
};

if (typeof document$ !== "undefined") {
  document$.subscribe(function () {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  });
}
