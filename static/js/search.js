$(() => {
  const params = new URLSearchParams(window.location.search)
  const searchIndex = params.get('s') ?? 'docs'
  const userQuery = params.get('q') ?? ''

  const searchQuery = userQuery
    .split(' ')
    .filter(term => term.length > 0)
    .map(term => `*${term}*`)
    .join(' ')

  $('#search-index').val(searchIndex)
  $('#search-query').val(userQuery)

  const renderResults = results => {
    let html = `
      <p class="title is-size-4">
        Found ${results.length} result${results.length > 1 ? 's' : ''}
      </p>
      <table class="table is-hoverable"><tbody>
    `

    for (const result of results) {
      html += `
        <tr>
          <td class="is-vcentered">
            <a href="${result.relpermalink}">${result.title}</a>
            <br/>
            ${result.description}
          </td>
        </tr>
      `
    }

    html += '</tbody></table>'

    $('#document').html(html)
  }

  const renderEmpty = () => {
    $('#document').html(`
      <p class="title is-size-4">No result found ☹️</p>
    `)
  }

  const execSearch = async () => {
    const resp = await fetch(`/search-${searchIndex}.json`)
    if (!resp.ok) {
      console.error(resp)
    }
    else {
      const { index: idxData, documents } = await resp.json()
      const idx = lunr.Index.load(idxData)
      const results = idx.search(searchQuery).map(
        result => documents[result.ref]
      )

      if (results.length > 0){
        renderResults(results)
      }
      else {
        renderEmpty()
      }
    }
  }

  execSearch().catch(console.error)
})
