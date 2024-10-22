import React, { useState } from "react";
import { FiClock, FiRefreshCcw } from "react-icons/fi";
import { BiRightArrowAlt } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { useStateProvider } from "../../context/StateContext";
import { useRouter } from "next/router";
import MessageModal from "./MessageModal"; // Adjust the import path accordingly

function Pricing() {
  const [{ gigData, userInfo }, dispatch] = useStateProvider();
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);

  if (!gigData || !userInfo) {
    return <div>Loading...</div>;
  }

  const handleSendMessage = async (message) => {
    try {
      // Implement your message sending logic here
      const response = await axios.post(`${ADD_MESSAGE}/${gigData.id}`, {
        message,
        recipientId: gigData.userId,
      }, {
        withCredentials: true,
      });

      if (response.status === 201) {
        console.log("Message sent:", response.data.message);
        // Optionally, show a success message to the user
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <>
      {gigData && (
        <div className="sticky top-36 mb-10 h-max w-96">
          <div className="border p-10 flex flex-col gap-5">
            <div className="flex justify-between">
              <h4 className="text-md font-normal text-[#74767e]">
                {gigData.shortDesc}
              </h4>
              <h6 className="font-medium text-lg">${gigData.price}</h6>
            </div>

            <div className="text-[#62646a] font-semibold text-sm flex gap-6">
              <div className="flex items-center gap-2">
                <FiClock className="text-xl" />
                <span>{gigData.deliveryTime} Days Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <FiRefreshCcw className="text-xl" />
                <span>{gigData.revisions} Revisions</span>
              </div>
            </div>

            <ul className="flex gap-1 flex-col">
              {gigData.features.length > 0 ? (
                gigData.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <BsCheckLg className="text-[#1DBF73] text-lg" />
                    <span className="text-[#4f5156]">{feature}</span>
                  </li>
                ))
              ) : (
                <li className="text-[#74767e]">No features available</li>
              )}
            </ul>

            {gigData.userId === userInfo.id ? (
              <button
                className="flex items-center bg-[#1DBF73] text-white py-2 justify-center font-bold text-lg relative rounded"
                onClick={() => router.push(`/seller/gigs/${gigData.id}`)}
              >
                <span>Edit</span>
                <BiRightArrowAlt className="text-2xl absolute right-4" />
              </button>
            ) : (
              <button
                className="flex items-center bg-[#1DBF73] text-white py-2 justify-center font-bold text-lg relative rounded"
                onClick={() => router.push(`/checkout?gigId=${gigData.id}`)}
              >
                <span>Continue</span>
                <BiRightArrowAlt className="text-2xl absolute right-4" />
              </button>
            )}
          </div>

          {gigData.userId !== userInfo.id && (
            <div className="flex items-center justify-center mt-5">
              <button
                className="w-5/6 hover:bg-[#74767e] py-1 border border-[#74767e] px-5 text-[#6c6d75] hover:text-white transition-all duration-300 text-lg rounded font-bold"
                onClick={() => setModalOpen(true)}
              >
                Contact Me
              </button>
            </div>
          )}
        </div>
      )}

      {/* Message Modal */}
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSend={handleSendMessage}
      />
    </>
  );
}

export default Pricing;
