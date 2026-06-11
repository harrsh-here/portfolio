const formatDisplayTitle = (title) => {
  let clean = title.trim()
  clean = clean.replace(/\s\(\d{4}\)\s*$/, '').trim()
  clean = clean.replace(/\s*\([^)]*\)\s*$/, '').trim()
  clean = clean.replace(/^(.*),\s*(The|A|An)$/i, '$2 $1').trim()
  return clean
}

console.log(formatDisplayTitle('Matrix, The (1999)'))
