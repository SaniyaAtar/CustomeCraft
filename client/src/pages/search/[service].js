import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

// Mock data for services (replace with actual API call)
const servicesData = {
  "string art": {
    name: "String Art",
    label: "Make art by Strings",
    images: ["/service1-1.jpeg", "/service1-2.jpeg", "/service1-3.jpeg","/service1-4.jpeg"],
    description: "String art is a unique form of art where designs are created using strings and nails. It's a creative way to express yourself and decorate your space.",
    detailedDescription: `
      <p>String art is a form of art where colorful strings are wrapped around nails or pins to create intricate designs. It's a versatile art form that can be used to create:</p>
      <ul>
        <li>Wall decor</li>
        <li>Personalized gifts</li>
        <li>Geometric patterns</li>
      </ul>
      <p>Whether you're a beginner or an experienced artist, string art offers endless possibilities for creativity.</p>
    `,
  },
  "logo design": {
    name: "Logo Design",
    label: "Build your brand",
    images: ["/service2-1.jpeg", "/service2-2.jpeg", "/service2-3.jpeg","/service2-4.jpeg"],
    description: "A professional logo design service to help you create a unique and memorable brand identity.",
    detailedDescription: `
      <p>Your logo is the face of your brand. Our logo design service offers:</p>
      <ul>
        <li>Custom designs tailored to your brand</li>
        <li>Multiple revisions until you're satisfied</li>
        <li>High-quality vector files for all platforms</li>
      </ul>
      <p>Let us help you create a logo that stands out and represents your brand perfectly.</p>
    `,
  },
  "resin art" :{
    name:"Resin Art",
    label:"Store your Love" ,
    images:["/resinArt5.jpg", "/resinArt4.jpg", "/resinArt2.jpg","/resinArt3.jpg" ,"/resinArt.jpg"],
    description: "A Your Art, Your Identity – Custom Resin Art Designs",
    detailedDescription: `
     
      <ul> <li>Unique, handcrafted resin designs tailored to your vision</li>
       <li>Multiple revisions to ensure perfection</li> 
       <li>High-quality, durable artwork suitable for home décor, gifting, or branding</li>
        </ul> 
        <p>Let us help you create a stunning resin masterpiece that reflects your style and individuality.</p>   
        <br>`,
  },
  "doodle art" :{
    name:"Doodle Art",
    label:"Doodling is the art of thinking with a pen." ,
    images:["/resinArt5.jpg", "/resinArt4.jpg", "/resinArt2.jpg","/resinArt3.jpg" ,"/resinArt.jpg"],
    description: "Doodling is the art of thinking with a pen.",
    detailedDescription: `
       <ul>
        <li><strong>Creativity Unleashed:</strong> Express yourself freely with spontaneous, abstract designs.</li>
        <li><strong>Unique & Playful:</strong> Every doodle tells a different story with fun patterns and details.</li>
        <li><strong>Mindful & Relaxing:</strong> A great way to relieve stress and boost creativity.</li>
        <li><strong>Storytelling Through Art:</strong> Doodles can represent emotions, thoughts, or even personal journeys.</li>
        <li><strong>Versatile & Customizable:</strong> Perfect for custom illustrations, branding, and décor.</li>
    </ul>
        <br>`,
  },
  "wedding card": {
    name: "Wedding Card",
    label: "Build your brand",
    images: ["/photo1.png", "/photo2.jpeg", "/photo3.jpeg","/photo4.png"],
    description: <strong>Happily ever after starts here.</strong>,
    detailedDescription: `
      <ul>
        <li><strong>Elegant Design:</strong> Crafted with beautiful themes and intricate details.</li>
        <li><strong>Customization:</strong> Personalize with names, dates, and heartfelt messages.</li>
        <li><strong>Premium Quality:</strong> High-quality printing on luxurious paper.</li>
        <li><strong>Theme-Based Options:</strong> Choose from classic, floral, royal, or modern styles.</li>
        <li><strong>Digital & Print Versions:</strong> Available in both e-invite and printed formats.</li>
    </ul><br>
    `,
  },
  "photography": {
    name: "PhotoGraphy",
    label: "Build your photo",
    images: ["/photography5.jpg", "/photography2.jpg", "/photography3.jpg","/photography6.jpg" ,"/photography4.jpg"],
    description: <strong>A picture is worth a thousand words, but the memories are priceless.</strong>,
    detailedDescription: `
      <ul>
        <li><strong>Captures Moments:</strong> Preserves special memories for a lifetime.</li>
  <li><strong>Expresses Emotions:</strong> Tells a story beyond words.</li>
  <li><strong>Artistic Vision:</strong> Showcases creativity and perspective.</li>
  <li><strong>Timeless Beauty:</strong> Freezes fleeting moments forever.</li>
  <li><strong>Universal Language:</strong> Speaks to all without words.</li>
    </ul><br>
    `,
  },
};

export default function ServiceDetails() {
  const router = useRouter();
  const { service } = router.query; // Get the service name from the URL
  const [serviceDetails, setServiceDetails] = useState(null);

  useEffect(() => {
    if (service) {
      // Fetch service details based on the service name
      const details = servicesData[service.toLowerCase()];
      if (details) {
        setServiceDetails(details);
      } else {
        // Redirect to a 404 page or show an error message
        router.push("/404");
      }
    }
  }, [service]);

  if (!serviceDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-20 ">
      {/* Back Button */}
      <button
        className="px-3 py-2 bg-[#1DBF73] text-white rounded-lg font-semibold hover:bg-[#1aa862] transition-colors flex items-center justify-center"
        onClick={() => router.push("/")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Service Name and Details */}
      <h2 className="text-4xl mt-0 text-[#404145] font-bold">{serviceDetails.name}</h2>
      <div className="flex flex-col gap-8">
        {/* Display Multiple Images */}
        <div className="flex gap-4 overflow-x-auto">
          {serviceDetails.images.map((image, index) => (
            <div key={index} className="w-96 h-64 relative flex-shrink-0">
              <img
                src={image}
                alt={`${serviceDetails.name} ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* Display Description */}
        <div className="space-y-4">
          <p className="text-lg text-gray-700">{serviceDetails.description}</p>
          <div
            className="text-gray-600"
            dangerouslySetInnerHTML={{ __html: serviceDetails.detailedDescription }}
          />
        </div>
      </div>
    </div>
  );
}