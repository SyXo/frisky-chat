import * as React from 'react'
const { useState, useEffect, useRef } = React
import styled, { css, createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  html, body {
    background-color: black;
    padding: 0;
    margin: 0;
  }
`

export const NotFound = () => <div>Not Found</div>

interface ThumbnailProps {
  url: string
  selected: boolean
  visible: boolean
}

export const Thumbnail = styled.div`
  width: calc(20% - 2px);
  height: calc(20vh - 2px);
  background-image: ${(props: ThumbnailProps) =>
    props.visible ? 'url("' + props.url + '")' : 'none'};
  background-size: cover;
  ${(props: ThumbnailProps) =>
    props.selected ? 'outline: 2px solid white;' : ''} margin: 1px;
`

interface Image {
  src: string
}

interface Pool {
  images: Image[]
  selectedIndex: number
  clickOpenHandler: (index: number) => () => void
}

export const PoolView = styled.div`
  display: flex;
  width: 90vw;
  height: 100vh;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
`

export const PoolComponent: React.SFC<Pool> = ({
  images,
  selectedIndex,
  clickOpenHandler,
}) => (
  <PoolView>
    {images.map(({ src }, i) => (
      <Thumbnail
        key={src}
        url={src}
        selected={selectedIndex === i}
        visible={true}
        onClick={clickOpenHandler(i)}
      />
    ))}
  </PoolView>
)

interface RouteProps {
  route: string
  setRoute: (route: string) => void
  id: string
  setID: (id: string) => void
  imagesLength: number
  setImagesLength: (length: number) => void
}

const createKeyHandler = (
  route: string,
  selectedIndex: number,
  setRoute,
  setID,
  setSelectedIndex,
  poolImagesLength = 0,
) => evt => {
  let newIndex = selectedIndex
  switch (evt.which) {
    // right arrow
    case 39: {
      newIndex = selectedIndex + 1
      break
    }
    // left arrow
    case 37: {
      newIndex = selectedIndex - 1
      break
    }
    // down arrow
    case 38: {
      newIndex = selectedIndex - 5
      break
    }
    // up arrow
    case 40: {
      newIndex = selectedIndex + 5
      break
    }
    // spacebar
    case 32: {
      route === 'image' ? setRoute('pool') : setRoute('image')
      setID(selectedIndex.toString())
    }
  }
  if (newIndex < 0) {
    newIndex += poolImagesLength
  } else if (newIndex >= poolImagesLength) {
    newIndex -= poolImagesLength
  }
  if (newIndex !== selectedIndex) {
    setSelectedIndex(newIndex)
    setID(newIndex.toString())
  }
}

export const PoolContainer: React.SFC<RouteProps> = ({
  route,
  setRoute,
  id,
  setID,
  setImagesLength,
}) => {
  const [loaded, setLoaded] = useState(true)
  const [poolImages, setPoolImages] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(parseInt(id))

  useEffect(
    async () => {
      const res = await fetch('/pool')
      const { images = [] } = await res.json()
      setPoolImages(images)
      setImagesLength(images.length)
      setLoaded(true)
    },
    [loaded],
  )

  useEffect(
    () => {
      const keyHandler = createKeyHandler(
        route,
        selectedIndex,
        setRoute,
        setID,
        setSelectedIndex,
        poolImages.length,
      )
      window.addEventListener('keydown', keyHandler)
      return () => {
        window.removeEventListener('keydown', keyHandler)
      }
    },
    [loaded, selectedIndex],
  )

  const clickOpenHandler = index => () => {
    setSelectedIndex(index)
    setID(index.toString())
    setRoute('image')
  }

  return (
    <PoolComponent
      images={poolImages}
      selectedIndex={selectedIndex}
      clickOpenHandler={clickOpenHandler}
    />
  )
}

interface FullscreenImageProps {
  url: string
}

export const FullscreenImage = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url("${(props: FullscreenImageProps) => props.url}");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 50% 50%;
`

interface ImageContainerProps {}

export const ImageContainer: React.SFC<ImageContainerProps & RouteProps> = ({
  route,
  setRoute,
  id,
  setID,
  imagesLength,
}) => {
  const ID = parseInt(id)
  const [selectedIndex, setSelectedIndex] = useState(ID)

  useEffect(() => {
    const keyHandler = createKeyHandler(
      route,
      selectedIndex,
      setRoute,
      setID,
      setSelectedIndex,
      imagesLength,
    )
    window.addEventListener('keydown', keyHandler)
    return () => {
      window.removeEventListener('keydown', keyHandler)
    }
  })

  const clickCloseHandler = () => {
    setRoute('pool')
  }

  return (
    <FullscreenImage
      onClick={clickCloseHandler}
      url={`cypress/fixtures/images/${id}.jpg`}
    />
  )
}
