import React, { useState } from "react";

function MessageModal({ isOpen, onClose, onSend, sellerEmail }) {
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.length === 0) {
      setError("Message cannot be empty.");
      return;
    }
    if (messageText.length > 500) {
      setError("Message cannot exceed 500 characters.");
      return;
    }

    setError(""); // Clear any previous errors

    // Send message along with seller email
    onSend({ messageText, sellerEmail });

    setMessageText("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Contact Seller</h2>

        {/* Display Seller's Email Only */}
        {sellerEmail ? (
          <p className="text-gray-700 text-sm mb-2">
            <strong>Email:</strong> {sellerEmail}
          </p>
        ) : (
          <p className="text-red-500">Seller email not available</p>
        )}

        {error && <div className="text-red-500 mb-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message here..."
            className="w-full border p-2 rounded"
            rows="5"
            maxLength="500"
          />
          <div className="flex justify-between mt-4">
            <button type="button" className="text-gray-500" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bg-[#1DBF73] text-white px-4 py-2 rounded">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MessageModal;
