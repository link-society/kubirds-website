$(function() {
  $('.navbar-burger').on('click', function() {
    const burger = $(this)
    const targetID = burger.data('target')
    const target = $(`#${targetID}`)

    target.toggleClass('is-active')
    burger.toggleClass('is-active')
  })
})
