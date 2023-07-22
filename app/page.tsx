import Head from "next/head";
import meImage from "../public/me.jpg";
import TwitterSvg from "../public/socials/twitter.svg";
import InstagramSvg from "../public/socials/instagram.svg";
import GithubSvg from "../public/socials/github.svg";
import LinkedinSvg from "../public/socials/linkedin.svg";
import SpotifySvg from "../public/socials/spotify.svg";
import MastodonSvg from "../public/socials/mastodon.svg";
import ThreadsBwSvg from "../public/socials/threads-bw.svg";
import ThreadsColorSvg from "../public/socials/threads-color.svg";
import Image from "next/image";
import Link from "next/link";

const SocialLink = ({
  Svg,
  link,
  color,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Svg: any;
  link: string;
  color: string;
}) => (
  <a href={link}>
    <Svg className={`fill-red-black h-10 w-10 ${color}`} alt={""} />
  </a>
);

const ThreadsIcon = () => {
  return (
    <div className="relative h-[36px] w-[36px]">
      <a href="https://www.threads.net/@_kylejs_">
        <ThreadsBwSvg />
        <ThreadsColorSvg className="absolute left-0 top-0 h-full w-full opacity-0 hover:opacity-100" />
      </a>
    </div>
  );
};

export default async function Home() {
  const title = "kylejs";
  const firstRowSocials = [
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
  ];
  const secondRowSocials = [
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
    <>
      <Head>
        <meta
          name="description"
          content="Hi, my name's Kyle. I'm a Software Engineer based in Brooklyn, NY."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>{title}</title>
      </Head>
      <div className="mt-16 flex items-center justify-center sm:absolute sm:bottom-0 sm:left-0 sm:right-0 sm:top-0 sm:m-auto sm:mt-0">
        <div>
          <div className="border-grey-300 w-[85%] rounded-xl border-b-2 bg-white px-6 pb-10 pt-16 text-center shadow-lg sm:w-fit">
            <div className="fade-in three mx-auto mb-4 h-36 w-36 overflow-hidden rounded-full">
              <Image
                src={meImage}
                placeholder="blur"
                aria-label="Headshot of Kyle Satti"
                priority
                alt="Headshot of Kyle Satti"
              />
            </div>
            <div className="fade-in one mb-2">
              <div className="text-3xl font-bold text-violet-500">
                Kyle Satti
              </div>
              <div className="text-xl text-violet-400">kylejs</div>
            </div>
            <div className="fade-in two pb-10">
              I like to build teams, products and software.
            </div>
            <div className="fade-in three flex items-center justify-center gap-4 pb-4">
              <ThreadsIcon />
              {firstRowSocials.map((s) => (
                <SocialLink
                  key={s.name}
                  Svg={s.svg}
                  link={s.url}
                  color={s.color}
                />
              ))}
            </div>
            <div className="fade-in three flex items-center justify-center gap-4">
              {secondRowSocials.map((s) => (
                <SocialLink
                  key={s.name}
                  Svg={s.svg}
                  link={s.url}
                  color={s.color}
                />
              ))}
            </div>
          </div>
          <div className="my-4 text-center">
            <Link href="/posts">Test</Link>
          </div>
        </div>
      </div>
    </>
  );
}
