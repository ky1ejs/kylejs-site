import Link from "next/link";
import WaveLabel from "./WaveLabel";

const PostFooter = () => (
  <div className="text-muted mt-10 text-center text-sm">
    {/* <hr className="border-t-[0.5px]" /> */}
    <p className="mt-6">Thank you for reading 🙏🏼</p>
    <WaveLabel>
      Links to my socials where I post more content are{" "}
      <Link className="hover:text-primary underline" href="/">
        here
      </Link>
    </WaveLabel>
  </div>
);

export default PostFooter;
