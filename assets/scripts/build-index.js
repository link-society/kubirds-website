const lunr = require('../../static/js/lunr.js')

const { promises: fs } = require('fs')
const matter = require('gray-matter')
const toml = require('toml')
const glob = require('glob')

const getRelPermalink = filename => {
  const prefix = './content'
  const suffix = '.md'
  const path = filename.slice(prefix.length, filename.length - suffix.length)
  return `${path}/`.replace('/_index/', '/')
}

const getMetadata = async filename => {
  const content = await fs.readFile(filename, { encoding: 'utf-8' })
  const parsed = matter(content.replace(/\r\n/g, '\n'), {
    language: 'toml',
    delimiters: '+++',
    engines: {
      toml: toml.parse.bind(toml)
    }
  })

  return {
    relpermalink: getRelPermalink(filename),
    ...parsed.data
  }
}

const buildIndex = async globPattern => {
  const files = await new Promise((resolve, reject) => {
    glob(globPattern, (err, files) => {
      if (err !== null) {
        reject(err)
      }
      else {
        resolve(files)
      }
    })
  })

  const documents = await Promise.all(files.map(getMetadata))

  const index = lunr(function() {
    this.ref('relpermalink')
    this.field('title')
    this.field('description')
    this.field('tags')
    this.field('keywords')

    for (const doc of documents) {
      this.add(doc)
    }
  })

  return {
    index,
    documents: Object.fromEntries(documents.map(doc => [doc.relpermalink, doc]))
  }
}

const writeJSON = async (target, data) => {
  await fs.writeFile(target, JSON.stringify(data))
}

const generateIndex = async (globPattern, target) => {
  const res = await buildIndex(globPattern)
  await writeJSON(target, res)
}

const main = async () => {
  await Promise.all([
    generateIndex(
      './content/docs/**/*.md',
      './static/search-docs.json'
    ),
    generateIndex(
      './content/integrations/**/*.md',
      './static/search-integrations.json'
    )
  ])
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
