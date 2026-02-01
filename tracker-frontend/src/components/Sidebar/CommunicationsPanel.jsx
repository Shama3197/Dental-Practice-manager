import { useState } from "react";
import axios from "axios";

export default function CommunicationsPanel() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [method, setMethod] = useState("whatsapp"); // 'whatsapp' or 'sms'
  const [feedback, setFeedback] = useState("");

  const sendMessage = async () => {
    try {
      await axios.post("/api/communications/send", {
        phone,
        message,
        method,
      });
      setFeedback(`✅ Message sent via ${method.toUpperCase()}`);
      setPhone("");
      setMessage("");
    } catch (err) {
      setFeedback("❌ Failed to send message.");
    }
  };

  return (
    <div className="p-4 rounded-2xl shadow-md bg-white w-full max-w-xs mx-auto mt-6">
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">📲 Communicate with Patient</h2>
      <div className="space-y-2">
        <input
          type="tel"
          placeholder="Patient Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-100"
        />
        <textarea
          placeholder="Type your message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 resize-none"
          rows={3}
        />
        <div className="flex gap-2">
          <button
            className={`flex-1 px-3 py-1.5 rounded text-sm font-medium border transition-colors ${method === 'whatsapp' ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700 border-gray-200 hover:bg-green-50'}`}
            onClick={() => setMethod('whatsapp')}
            type="button"
          >
            WhatsApp
          </button>
          <button
            className={`flex-1 px-3 py-1.5 rounded text-sm font-medium border transition-colors ${method === 'sms' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50'}`}
            onClick={() => setMethod('sms')}
            type="button"
          >
            SMS
          </button>
        </div>
        <button
          className="w-full mt-2 px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm"
          onClick={sendMessage}
          type="button"
        >
          Send Message
        </button>
        {feedback && <p className="text-xs mt-2 text-center">{feedback}</p>}
      </div>
    </div>
  );
} 