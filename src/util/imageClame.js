

const imageClame = (clima) => {
  let numImagen = 0
  if (clima < 10) {
    numImagen = 1
  } else if (clima < 20) {
        numImagen=2
  } else if (clima < 25) {
    numImagen = 3
  } else if (clima <=29) {
    numImagen= 6
  } else {
    numImagen = 7
  }
  
  return numImagen
}

export default imageClame