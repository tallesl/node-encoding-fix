var fs = require('fs')
  , iconv = require('iconv-lite')
  , path = require('path')
  
module.exports = convert

function convert (args) {
  args._.forEach(function (filepath) {
    (fs.lstatSync(filepath).isDirectory() ? convertDirectory : convertFile)(filepath, args.from, args.to, args.ext, args.verbose)
  })
}

function convertDirectory (dir, from, to, ext, verbose) {
  fs.readdir(dir, function (err, paths) {
    if (err) throw err

    paths.forEach(function (relativePath) {
      process.nextTick(function () {
        convert(path.join(dir, relativePath), from, to, ext, verbose)
      })
    })
  })
}

function convertFile (filepath, from, to, ext, verbose) {
  fs.readFile(filepath, function (err, buffer) {
    if (err) throw err

    if (!ext || ext === path.extname(filepath)) {
      var decoded = iconv.decode(buffer, from)
      var encoded = iconv.encode(decoded, to)

      fs.writeFile(filepath, encoded, function (err) {
        if (err) throw err
        else if (verbose) console.log('Converted ' + filepath)
      })
    }
  })
}