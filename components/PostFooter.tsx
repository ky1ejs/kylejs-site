import Link from "next/link";
import WaveLabel from "./WaveLabel";

const PostFooter = () => (
  <div className="mb-20 mt-16 text-center text-sm text-muted">
    <hr />
    <p className="mt-6">Thank you for reading 🙏🏼</p>
    <WaveLabel>
      Links to my socials where I post more content are{" "}
      <Link className="underline hover:text-primary" href="/">
        here
      </Link>
    </WaveLabel>
  </div>
);

export default PostFooter;
