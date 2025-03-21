import Image from "next/image";
import React from "react";
import { BsCheckCircle } from "react-icons/bs";

function Everything() {
  const everythingData = [
    {
      title: "Celebrate Artistry and Craftsmanship",
      subtitle:
        "Discover a curated collection of handcrafted items, showcasing the dedication and talent of small businesses and artisans.",
    },
    {
      title: "Custom Orders Made Easy",
      subtitle:
        "Enjoy the freedom to customize your order according to your preferences, ensuring a truly one-of-a-kind experience.",
    },
    {
      title: "Support Local Artisans",
      subtitle:
        "Every purchase directly contributes to the growth and sustainability of talented artisans, helping them reach a broader audience.",
    },
    {
      title: "Seamless Shopping Experience",
      subtitle:
        "Our user-friendly platform ensures smooth navigation, secure payments, and reliable support to meet all your needs.",
    },
  ];

  return (
    <div className="bg-[#f1fdf7] flex py-20 justify-between px-24">
      <div>
        <h2 className="text-4xl mb-5 text-[#404145] font-bold">
          Why Choose CustomeCraft?
        </h2>
        <ul className="flex flex-col gap-10">
          {everythingData.map(({ title, subtitle }) => {
            return (
              <li key={title}>
                <div className="flex gap-2 items-center text-xl">
                  <BsCheckCircle className="text-[#62646a]" />
                  <h4>{title}</h4>
                </div>
                <p className="text-[#62646a]">{subtitle}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="relative h-98 w-2/5">
        <Image
          src="/customcraft.webp"
          fill
          alt="CustomeCraft Features"
        />
      </div>
    </div>
  );
}

export default Everything;
