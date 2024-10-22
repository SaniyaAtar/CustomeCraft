import { useStateProvider } from "../../context/StateContext";
import { GET_SELLER_DASHBOARD_DATA } from "../../utils/constants";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function Index() {
  const [{ userInfo }] = useStateProvider();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(undefined);

  useEffect(() => {
    const getBuyerDashboardData = async () => {
      try {
        const response = await axios.get(GET_SELLER_DASHBOARD_DATA, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setDashboardData(response.data.dashboardData); // Ensure this matches your API response structure
        } else {
          console.error("Unexpected response status:", response.status);
          console.error("Failed to fetch data:", response.data); // Log on unexpected status
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error); // Log the error
      }
    };

    if (userInfo) {
      getBuyerDashboardData(); // Only fetch if userInfo exists
    }
  }, [userInfo]);

  return (
    <>
      {userInfo && (
        <div className="flex min-h-[80vh] my-10 mt-0 px-32 gap-5">
          <div className="shadow-md h-max p-10 flex flex-col gap-5 min-w-96 w-96">
            <div className="flex gap-5 justify-center items-center">
              <div>
                {userInfo?.imageName ? (
                  <Image
                    src={userInfo.imageName}
                    alt="Profile"
                    width={140}
                    height={140}
                    className="rounded-full"
                  />
                ) : (
                  <div className="bg-purple-500 h-24 w-24 flex items-center justify-center rounded-full relative">
                    <span className="text-5xl text-white">
                      {userInfo.email[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#62646a] text-lg font-medium">
                  {userInfo.username}
                </span>
                <span className="font-bold text-md">{userInfo.fullName}</span>
              </div>
            </div>
            <div className="border-t py-5">
              <p>{userInfo.description}</p>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-3 gap-10 w-full">
              <div
                className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => router.push("/seller/gigs")}
              >
                <h2 className="text-xl">Total Gigs</h2>
                <h3 className="text-[#1DBF73] text-3xl font-extrabold">
                  {dashboardData?.gigs || 0} {/* Default to 0 if undefined */}
                </h3>
              </div>
              <div
                className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => router.push("/seller/orders")}
              >
                <h2 className="text-xl">Total Orders</h2>
                <h3 className="text-[#1DBF73] text-3xl font-extrabold">
                  {dashboardData?.orders || 0} {/* Default to 0 if undefined */}
                </h3>
              </div>
              <div
                className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => router.push("/seller/unread-messages")}
              >
                <h2 className="text-xl"> Unread Messages</h2>
                <h3 className="text-[#1DBF73] text-3xl font-extrabold">
                  {dashboardData?.unreadMessages || 0} {/* Default to 0 if undefined */}
                </h3>
              </div>

              <div className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl">Earnings Today</h2>
                <h3 className="text-[#1DBF73] text-3xl font-extrabold">
                  ${dashboardData?.dailyRevenue || 0} {/* Default to 0 if undefined */}
                </h3>
              </div>
              <div className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl">Earnings Monthly</h2>
                <h3 className="text-[#1DBF73] text-3xl font-extrabold">
                  ${dashboardData?.monthlyRevenue || 0} {/* Default to 0 if undefined */}
                </h3>
              </div>
              <div className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl">Earnings Yearly</h2>
                <h3 className="text-[#1DBF73] text-3xl font-extrabold">
                  ${dashboardData?.revenue || 0} {/* Default to 0 if undefined */}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Index;
