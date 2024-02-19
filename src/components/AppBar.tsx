import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const Tab = ({ label, link }: { label: string; link: string }) => {
  return (
    <>
      <Link href={link} target="_black" rel="noopener noreferrer">
        <p className="rounded-md p-2 text-center text-sm text-theme-blue hover:bg-theme-blue hover:text-white md:text-sm">
          {label}
        </p>
      </Link>
    </>
  );
};

const Tabs = [
  {
    label: "Blog",
    link: "https://mattheww277.sg-host.com/category/blog/",
  },
  {
    label: "For Accounts",
    link: "https://mattheww277.sg-host.com/category/for-accountants/",
  },
  {
    label: "Services",
    link: "https://mattheww277.sg-host.com/category/services/",
  },
];

const AppBar = () => {
  return (
    <>
      <div className="sticky top-0 z-50 flex flex-row justify-between border bg-white px-5 py-2 shadow-xl lg:px-32">
        <div className="flex flex-row items-center sm:space-x-3 md:space-x-4">
          <Link href="/">
            <Image
              src={"/images/logos/logo.png"}
              alt="Crypto Tax Made Easy Logo"
              width={188 / 2.5}
              height={184 / 2.5}
            />
          </Link>
          <h1 className="hidden text-center font-bold text-theme-blue sm:block sm:text-sm md:text-lg">
            Crypto Tax Made Easy
          </h1>
        </div>
        <div className="flex flex-row items-center space-x-2 sm:space-x-2">
          {Tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} link={tab.link} />
          ))}
          <Button className="hidden bg-theme-blue hover:bg-theme-blue-100 sm:flex sm:text-sm">
            Let&apos;s Talk
          </Button>
        </div>
      </div>
    </>
  );
};

export default AppBar;
