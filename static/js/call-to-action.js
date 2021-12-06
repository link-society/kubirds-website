$(() => {
  $('*[data-call-to-action]').click(function() {
    const el = $(this)
    window.location.href = el.data('call-to-action')
  })
})