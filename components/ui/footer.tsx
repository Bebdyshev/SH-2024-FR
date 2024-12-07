import Logo from "./logo";
import Image from "next/image";
import FooterIllustration from "@/public/images/footer-illustration.svg";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Footer illustration */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -translate-x-1/2"
          aria-hidden="true"
        >
          <Image
            className="max-w-none"
            src={FooterIllustration}
            width={1076}
            height={378}
            alt="Footer illustration"
          />
        </div>
        <div className="grid grid-cols-2 justify-between gap-12 py-8 md:py-12">
          {/* Title and Description */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h1 className="text-3xl font-bold text-gray-100">CandyData</h1>
            <p className="mt-2 text-indigo-200/65">
              An AI agents driven recruitment platform that pre-selects top candidates and 
              automates negotiations, boosting hiring efficiency effortlessly.
            </p>
          </div>
          {/* Logo and Info */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 lg:text-right">
            <div className="text-sm">
              <p className="text-indigo-200/65 underline">
                <Link href="https://cal.com/gabitov/30min">Request Demo</Link>
              </p>
              <p className="text-indigo-200/65 underline">
                <Link href="https://www.linkedin.com">
                  LinkedIn
                </Link>
              </p>
              <p className="text-indigo-200/65 underline">
                <Link href="https://github.com">
                  GitHub
                </Link>
              </p>
              <p className="mt-3 text-indigo-200/65">
                Aktobe, Kazakhstan
              </p>
              <p className="mb-3 text-indigo-200/65">
                CandyData, Inc. © 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
