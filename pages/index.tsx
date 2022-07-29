import React, { useCallback, useEffect, useState } from "react"
import styled from 'styled-components'
import Head from 'next/head'
import meImage from '../public/me.jpg'
import Image from 'next/image'
import getConfig from 'next/config'

const ImageContainer = styled.div`
  border-radius: 50%;
  overflow: hidden;
  height: 200px;
  width: 200px;
  margin: auto;
`

const Grid = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 36px;
`

const ColorLink = styled.a<{color: string}>`
  color: black;
  text-decoration: none;
  &:visited {
    color: black;
  }
  &:hover {
    color: white;
    background-color: ${(props) => props.color};
    transition: all linear 0.1s;
    box-shadow: 2px 2px 6px 1px #b8b8b8;
  }
  padding: 4px 6px;
  border-radius: 6px;
  display: inline-block;
`

const Title = styled.div`
  text-align: center;
`

const H1 = styled.h1`
  font-size: 20pt;
  color: #714ef2;
`

const Subtitle = styled.div`
  text-align: center;
`

const Container = styled.div`
  font-family: "Arial";
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const CenterContainer = styled.div`
  font-family: "Arial";
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addListener(updateTarget);

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeListener(updateTarget);
  }, []);

  return targetReached;
};

const { publicRuntimeConfig } = getConfig()

const Home: React.FC = () => {
  const links: { color: string; url: string; name: string }[] = publicRuntimeConfig.siteMetadata.links
  const title = publicRuntimeConfig.siteMetadata.title ?? "kylejs";
  return (
    <Container>
      <Head>
        <title>
          {title}
        </title>
      </Head>
      <ImageContainer>
        <Image src={meImage} placeholder="blur" />
      </ImageContainer>
      <Title>
        <H1>
          {title}
        </H1>
      </Title>
      <Subtitle>
        I like to build teams, products and software.
      </Subtitle>
      <Grid>
        {links.map((link => (
          <div key={link.url}>
            <ColorLink color={link.color} href={link.url}>
              {link.name}
            </ColorLink>
          </div>    
        )))}
      </Grid>
    </Container>
  )
}

export default Home;
