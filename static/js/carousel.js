$(function() {
  const capitalize = str => `${str[0].toUpperCase()}${str.slice(1)}`

  $('.carousel').each(function() {
    /* workaround: hugo lowercase all keys */
    const hugoOptions = Object.entries($(this).data('carousel-options'))
    const options = Object.fromEntries(hugoOptions.map(([key, val]) => {
      const snake_case_parts = key.split('_')
      const camelCase = [
        snake_case_parts[0],
        snake_case_parts.slice(1).map(capitalize)
      ].join('')

      return [camelCase, val]
    }))

    const [carousel] = bulmaCarousel.attach(this, options)

    /* workaround: bulma-carousel navigation is shown when infinite or loop are enabled */
    if (!carousel.options.navigation) {
      $(this).find('.slider-navigation-previous').addClass('is-hidden')
      $(this).find('.slider-navigation-next').addClass('is-hidden')
    }

  })

})
