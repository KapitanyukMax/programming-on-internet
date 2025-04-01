function resizeParent() {
  if (window.parent && window.parent.adjustIframeHeight) {
      window.parent.adjustIframeHeight();
  }
}
