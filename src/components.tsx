import * as React from 'react'
// @ts-ignore
const { useState, useEffect } = React
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
  src: string
  selected: boolean
  visible: boolean
}

export const Thumbnail = styled.div`
  width: calc(20% - 2px);
  height: calc(20vh - 2px);
  background-image: ${(props: ThumbnailProps) =>
    props.visible ? 'url("' + props.src + '")' : 'none'};
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
}

export const PoolView = styled.div`
  display: flex;
  width: 90vw;
  height: 100vh;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
`

export const PoolComponent: React.SFC<Pool> = ({ images, selectedIndex }) => (
  <PoolView>
    {images.map(({ src }, i) => (
      <Thumbnail
        key={src}
        src={src}
        selected={selectedIndex === i}
        visible={true}
      />
    ))}
  </PoolView>
)

export const PoolContainer: React.SFC<{}> = () => {
  const [loaded, setLoaded] = useState(true)
  const [poolImages, setPoolImages] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(
    async () => {
      const res = await fetch('/pool')
      const { images = [] } = await res.json()
      setPoolImages(images)
      setLoaded(true)
    },
    [loaded],
  )

  useEffect(
    () => {
      const keyHandler = evt => {
        console.log(evt.which, selectedIndex)
        // let newIndex = selectedIndex
        switch (evt.which) {
          // right arrow
          case 39: {
            setSelectedIndex(selectedIndex + 1)
            break
          }
          // left arrow
          case 37: {
            setSelectedIndex(selectedIndex - 1)
            break
          }
          // down arrow
          case 38: {
            setSelectedIndex(selectedIndex - 5)
            break
          }
          // up arrow
          case 40: {
            setSelectedIndex(selectedIndex + 5)
            break
          }
        }
      }
      window.addEventListener('keydown', keyHandler)
      return () => {
        window.removeEventListener('keydown', keyHandler)
      }
    },
    [loaded, selectedIndex],
  )

  return <PoolComponent images={poolImages} selectedIndex={selectedIndex} />
}
