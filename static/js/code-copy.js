$(function() {
  $('.content .highlight').each(function() {
    const wrapper = $('<div/>', { class: 'highlight-wrapper'})
    const button = $('<kubirds-code-copy/>')

    $(this).prepend(button)
    $(this).wrap(wrapper)
  })
})
