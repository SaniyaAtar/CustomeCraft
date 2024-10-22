import { useStateProvider } from "../../../context/StateContext";
import { GET_BUYER_ORDERS_ROUTE } from "../../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { format } from 'date-fns'; // For date formatting

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [{ userInfo }] = useStateProvider();
  
  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(GET_BUYER_ORDERS_ROUTE, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setOrders(response.data.orders);
        } else {
          throw new Error('Failed to fetch orders');
        }
      } catch (err) {
        setError('Error fetching orders. Please try again later.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) getOrders();
  }, [userInfo]);

  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32">
      <h3 className="m-5 text-2xl font-semibold">All your Orders</h3>
      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Order Id</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3">Delivery Time</th>
                <th scope="col" className="px-6 py-3">Order Date</th>
                <th scope="col" className="px-6 py-3">Send Message</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50"
                    key={order.id}
                  >
                    <th scope="row" className="px-6 py-4 ">{order.id}</th>
                    <th scope="row" className="px-6 py-4 font-medium">
                      {order.gig.title}
                    </th>
                    <td className="px-6 py-4">{order.gig.category}</td>
                    <td className="px-6 py-4">{order.price}</td>
                    <td className="px-6 py-4">{order.gig.deliveryTime}</td>
                    <td className="px-6 py-4">{format(new Date(order.createdAt), 'yyyy-MM-dd')}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/buyer/orders/messages/${order.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Send
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No orders found. <Link href="/gigs" className="text-blue-600 hover:underline">Browse gigs</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Orders;
