const body = document.querySelector('body')(() => {
  const imgUrl = await fetch(
    'https://source.unsplash.com/featured/?camping,camp'
  )
  body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)) ,url(${imgUrl.url})`
})()
