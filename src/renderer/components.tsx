import * as React from 'react'
const { useState, useEffect, useRef } = React
import styled, { css, createGlobalStyle } from 'styled-components'
import { ipcRenderer } from 'electron'
import { mapFilesList } from './helpers'

const dev = (window as any).Cypress && (window as any).Cypress.env().DEV

export const cy = name => (dev ? { 'data-cy': name } : {})

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
  visibility: ${(props: ThumbnailProps) =>
    props.visible ? 'visible' : 'hidden'};
  background-image: ${(props: ThumbnailProps) =>
    props.visible ? 'url("' + props.url + '")' : 'none'};
  background-size: cover;
  ${(props: ThumbnailProps) =>
    props.selected ? 'outline: 2px solid white;' : ''} margin: 1px;
`

export const PoolNav = styled.div`
  flex-direction: row;
`

export const PoolNavLink = styled.a`
  color: white;
`

interface Pool {
  images: string[]
  selectedIndex: number
  clickOpenHandler: (index: number) => () => void
  rangeStart: number
  dragHandler: React.DragEventHandler
}

export const PoolView = styled.div`
  display: flex;
  width: 100%;
  height: 100vh; // TODO navbar
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
`

export const PoolComponent: React.SFC<Pool> = ({
  images,
  selectedIndex,
  clickOpenHandler,
  rangeStart,
  dragHandler,
}) => (
  <PoolView onDragStart={dragHandler}>
    {images.map((src, i) => (
      <Thumbnail
        key={`${src.split('://')[1]}-${i}`}
        url={src}
        selected={selectedIndex === i}
        visible={i >= rangeStart && i < rangeStart + 30}
        onClick={clickOpenHandler(i)}
        {...cy(`thumbnail-${i}`)}
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
  poolImages: string[]
  setPoolImages: (images: string[]) => void
}

const createKeyHandler = (
  route: string,
  selectedIndex: number,
  setRoute,
  setID,
  setSelectedIndex,
  poolImagesLength = 0,
  rangeStart = 0,
) => evt => {
  evt.preventDefault()
  let newIndex = selectedIndex
  const itemHeight = window.innerHeight / 5

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
    // up arrow
    case 38: {
      newIndex = selectedIndex - 5
      const scrollY = Math.max(
        itemHeight * Math.round(newIndex / 5) - itemHeight * 2,
        0,
      )
      window.scrollTo({
        top: scrollY,
        left: 0,
        behavior: 'smooth',
      })
      break
    }
    // down arrow
    case 40: {
      newIndex = selectedIndex + 5
      const scrollY = Math.max(
        itemHeight * Math.round(newIndex / 5) - itemHeight * 2,
        0,
      )
      window.scrollTo({
        top: scrollY,
        left: 0,
        behavior: 'smooth',
      })
      break
    }
    // escape key
    case 27:
    // spacebar
    case 32: {
      route === 'image' ? setRoute('pool') : setRoute('image')
      break
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
  poolImages,
  setPoolImages,
}) => {
  const [loaded, setLoaded] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(parseInt(id))
  const [rangeStart, setRangeStart] = useState(0)
  const [upload, setUpload] = useState('upload!')

  useEffect(
    async () => {
      ipcRenderer.send('fetch-pool-images')
      ipcRenderer.on('fetched-pool-images', (event, imagePaths) => {
        setPoolImages(imagePaths.map(path => `frisky-pool://${path}`))
        setImagesLength(imagePaths.length)
      })
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
        rangeStart,
      )
      window.addEventListener('keydown', keyHandler)
      return () => {
        window.removeEventListener('keydown', keyHandler)
      }
    },
    [loaded, selectedIndex],
  )

  useEffect(
    () => {
      if (route === 'pool') {
        const itemHeight = window.innerHeight / 5
        const scrollY = Math.max(
          itemHeight * Math.round(selectedIndex / 5) - itemHeight * 2,
          0,
        )
        window.scrollTo({
          top: scrollY,
          left: 0,
          behavior: 'instant',
        })
      }
    },
    [route],
  )

  useEffect(
    () => {
      const scrollHandler = () => {
        const itemHeight = window.innerHeight / 5
        const start = Math.floor(window.scrollY / itemHeight) * 5
        setRangeStart(start)
      }
      window.addEventListener('scroll', scrollHandler)
      return () => {
        window.removeEventListener('scroll', scrollHandler)
      }
    },
    [loaded, selectedIndex],
  )

  const clickOpenHandler = (index: number) => () => {
    setSelectedIndex(index)
    setID(index.toString())
    setRoute('image')
  }

  const dragHandler = (evt: React.DragEvent) => {
    evt.preventDefault()
    console.log(evt.dataTransfer.files)
    ipcRenderer.send('ondragstart', evt.dataTransfer.files)
  }

  const saveImagesHandler = (evt: Event) => {
    ipcRenderer.send(
      'save-images',
      mapFilesList((evt.target as HTMLInputElement).files, 'path'),
    )
  }

  const uploadHandler = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('multiple', 'true')
    input.setAttribute('webkitdirectory', 'true')
    // input.setAttribute('accept', '.png, .jpg, .jpeg, .webp')
    // input.setAttribute('accept', 'image/*')
    input.removeEventListener('change', saveImagesHandler)
    input.addEventListener('change', saveImagesHandler)
    input.click()
  }

  useEffect(
    () => {
      ipcRenderer.on(
        'save-images-progress',
        (evt, progress: number, total: number) => {
          setUpload(`uploading ${progress} of ${total}...`)
          ipcRenderer.send('fetch-pool-images')
        },
      )
    },
    [loaded],
  )

  useEffect(
    () => {
      ipcRenderer.on('save-images-finished', (evt, count: number) => {
        setUpload(`uploaded ${count} images.`)
        ipcRenderer.send('fetch-pool-images')
      })
    },
    [loaded],
  )

  return (
    <>
      <PoolNav>
        <PoolNavLink onClick={uploadHandler}>{upload}</PoolNavLink>
      </PoolNav>
      <PoolComponent
        images={poolImages}
        selectedIndex={selectedIndex}
        clickOpenHandler={clickOpenHandler}
        rangeStart={rangeStart}
        dragHandler={dragHandler}
      />
    </>
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
  poolImages,
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
      url={poolImages[selectedIndex]}
    />
  )
}
