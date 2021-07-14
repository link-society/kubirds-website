$(function () {
  tocbot.init({
    tocSelector: '#toc-content',
    contentSelector: '#document',
    headingSelector: 'h1, h2, h3',
    orderedList: false,
    activeLinkClass: 'is-active',
    hasInnerContainers: true,
    headingsOffset: 52,
    scrollSmoothOffset: -52
  })
})
