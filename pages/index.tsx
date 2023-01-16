import React from "react";
import Head from "next/head";
import meImage from "../public/me.jpg";
import TwitterSvg from "../public/socials/twitter.svg";
import InstagramSvg from "../public/socials/instagram.svg";
import GithubSvg from "../public/socials/github.svg";
import LinkedinSvg from "../public/socials/linkedin.svg";
import SpotifySvg from "../public/socials/spotify.svg";
import MastodonSvg from "../public/socials/mastodon.svg";
import Image from "next/image";
import getConfig from "next/config";

const SocialLink = ({
  SvgFile,
  link,
  color,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  SvgFile: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  link: string;
  color: string;
}) => (
  <a href={link}>
    <SvgFile style={{ fill: color }} className={`h-10 w-10 ${color}`} />
  </a>
);

const { publicRuntimeConfig } = getConfig();
const Home: React.FC = () => {
  const title = publicRuntimeConfig.siteMetadata.title ?? "kylejs";
  const socials = [
    {
      name: "Twitter",
      url: "https://twitter.com/_kylejs_",
      color: "hover:fill-[#00acee]",
      svg: TwitterSvg,
    },
    {
      name: "GitHub",
      url: "https://github.com/ky1ejs",
      color: "hover:fill-[#333]",
      svg: GithubSvg,
    },
    {
      name: "Spotify",
      url: "https://open.spotify.com/user/kylejm_",
      color: "hover:fill-[#1db954]",
      svg: SpotifySvg,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/kylejs/",
      color: "hover:fill-[#0077b5]",
      svg: LinkedinSvg,
    },
    {
      name: "Instagram",
      url: "https://instagram.com/_kylejs_",
      color: "hover:fill-[#e1306c]",
      svg: InstagramSvg,
    },
    {
      name: "Mastodon",
      url: "https://techhub.social/@kylejs",
      color: "hover:fill-[#5d50e6]",
      svg: MastodonSvg,
    },
  ];
  return (
    <div className="transform-minus-half fixed top-1/2 left-1/2 text-center">
      <Head>
        <title>{title}</title>
      </Head>
      <div className="fade-in mx-auto mb-4 h-36 w-36 overflow-hidden rounded-full">
        <Image
          src={meImage}
          placeholder="blur"
          aria-label="Headshot of Kyle Satti"
        />
      </div>
      <div className="mb-4">
        <div className="text-3xl font-bold text-violet-500">Kyle Satti</div>
        <div className="text-xl text-violet-400">kylejs</div>
      </div>
      <div className="pb-5">I like to build teams, products and software.</div>
      <div className="flex gap-4">
        {socials.map((s) => (
          <SocialLink
            key={s.name}
            SvgFile={s.svg}
            link={s.url}
            color={s.color}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
