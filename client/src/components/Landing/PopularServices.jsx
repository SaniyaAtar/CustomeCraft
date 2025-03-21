import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function PopularServices() {
  const router = useRouter();
  const popularServicesData = [
    { name: "String Art", label: "Make art by Strings", image: "/service1.png" },
    { name: "Logo Design", label: "Build your brand", image: "/service2.png" },
    { name: "Resin Art", label: "Give your Touch", image: "/service3.jpg" },
    { name: "Doddle Art", label: "Express yourself through your art", image: "/service4.jpg" },
    { name: "Wedding card", label: "Invite your Loved Ones", image: "/service5.jpg" },
    { name: "Photography", label: "Capture Your Moment", image: "/service6.jpeg" },
  ];

  return (
    <div className="mx-20 my-16">
      <h2 className="text-4xl mb-5 text-[#404145] font-bold">Popular Services</h2>
      <ul className="flex flex-wrap gap-16">
        {popularServicesData.map(({ name, label, image }) => (
          <li
            key={name}
            className="relative cursor-pointer"
            onClick={() => router.push(`/search/${name.toLowerCase()}`)} // Redirect to dynamic route
          >
            <div className="absolute z-10 text-white left-5 top-4">
              <span>{label}</span>
              <h6 className="font-extrabold text-2xl">{name}</h6>
            </div>
            <div className="h-80 w-72 relative">
              <Image src={image} fill alt="service" className="rounded-lg" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PopularServices;