const sass = require('sass')
const fs = require('fs')

const result = sass.renderSync({
  file: './assets/styles/kubirds.scss',
  quietDeps: true,
  importer: [
    url => {
      if (url[0] == '~') {
        return {
          file: `node_modules/${url.slice(1)}`
        }
      }

      return null
    }
  ]
})

fs.writeFileSync('./static/css/kubirds.css', result.css)

console.log('Done.')
