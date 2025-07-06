import meImage from "../public/me.jpg";
import InstagramSvg from "../public/socials/instagram.svg";
import GithubSvg from "../public/socials/github.svg";
import LinkedinSvg from "../public/socials/linkedin.svg";
import SpotifySvg from "../public/socials/spotify.svg";
import ThreadsBwSvg from "../public/socials/threads-bw.svg";
import ThreadsColorSvg from "../public/socials/threads-color.svg";
import BlueskyIconSvg from "../public/socials/bluesky.svg";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Copyright from "@/components/Copyright";
import WaveLabel from "@/components/WaveLabel";
import HomeThemeButton from "@/components/HomeThemeButton";

const ThreadsIcon = () => {
  return (
    <div className="relative h-[36px] w-[36px]">
      <a href="https://www.threads.net/@_kylejs_">
        <ThreadsBwSvg className="fill-secondary" />
        <ThreadsColorSvg className="absolute left-0 top-0 h-full w-full opacity-0 hover:opacity-100" />
      </a>
    </div>
  );
};

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
    <Svg className={`h-10 w-10 fill-secondary ${color}`} alt={""} />
  </a>
);

export const metadata: Metadata = {
  title: "kylejs",
  description: "Kyle Satti | Product Engineer based in Brooklyn, NY.",
};

export default async function Home() {
  const socials = [
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
      name: "Bluesky",
      url: "https://bsky.app/profile/kylejs.me",
      color: "hover:fill-[#0085ff]",
      svg: BlueskyIconSvg,
    },
  ];
  return (
    <>
      <HomeThemeButton />
      <div className="mt-16 flex items-center justify-center sm:absolute sm:bottom-0 sm:left-0 sm:right-0 sm:top-0 sm:m-auto sm:mt-0">
        <div className="w-[85%] text-center sm:w-fit">
          <div className="background-and-shadow border-grey-300 rounded-xl border-b-2 bg-background-secondary px-6 pb-6 pt-8 shadow-lg dark:border-none dark:shadow-none">
            <div className="fade-in three mx-auto mb-4 h-36 w-36 overflow-hidden rounded-full">
              <Image
                src={meImage}
                placeholder="blur"
                aria-label="Headshot of Kyle Satti"
                priority
                alt="Headshot of Kyle Satti"
              />
            </div>
            <div className="rise-up mb-2">
              <div className="text-3xl font-bold text-primary">Kyle Satti</div>
              <div className="text-xl text-secondary">kylejs</div>
            </div>
            <div className="fade-in two pb-10">
              I like to build teams and create things, <br /> mostly with an
              IDE, camera or 3D printer.
            </div>
            <div className="fade-in three flex items-center justify-center gap-4 pb-4">
              <ThreadsIcon />
              {socials.map((s) => (
                <SocialLink
                  key={s.name}
                  Svg={s.svg}
                  link={s.url}
                  color={s.color}
                />
              ))}
            </div>
          </div>
          <div className="my-4 text-center text-gray-500">
            I sometimes blog{" "}
            <Link className="underline hover:text-primary" href="/posts">
              here
            </Link>{" "}
            ✍️
            <div className="">
              <WaveLabel>
                <Link href="/about">About me</Link>
              </WaveLabel>
            </div>
            <Copyright />
          </div>
        </div>
      </div>
    </>
  );
}
