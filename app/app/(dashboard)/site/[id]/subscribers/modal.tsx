"use client";

import { useState } from 'react';
import { Switch } from "@/components/ui/switch";

export default function SettingsModal() {
  const [showModal, setShowModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [audienceId, setAudienceId] = useState('');
  const [autoSend, setAutoSend] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = () => {
    console.log("API Key:", apiKey);
    console.log("Audience ID:", audienceId);
    console.log("Auto Send:", autoSend);
    setShowModal(false);
    // Add save logic here, such as an API call to store the settings
  };

  return (
    <>
      <button
        className="px-4 py-2 bg-white text-black font-bold rounded hover:bg-white"
        onClick={handleOpenModal}
      >
        Settings
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-black p-6 rounded-lg shadow-lg">
            <h2 className="font-bold text-xl mb-4">Integrations</h2>
            <p>Send your subscriber to Resend to send newsletters</p>
            <label className="block text-sm font-bold mb-2">
              Resend API Key
              <input
                type="text"
                className="border p-2 w-full text-black"
                placeholder="Email"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </label>
            <label className="block text-sm font-bold mb-2">
              Resend Audience ID
              <input
                type="text"
                className="border p-2 w-full text-black"
                placeholder="@pduarte"
                value={audienceId}
                onChange={(e) => setAudienceId(e.target.value)}
              />
            </label>
            <div className="flex items-center mb-4">
              {/* <input
                id="autoSend"
                type="checkbox"
                className="w-6 h-6 mr-2"
                checked={autoSend}
                onChange={() => setAutoSend(!autoSend)}
              /> */}
              <Switch/>
              <label htmlFor="autoSend" className="font-bold text-sm">
                Automatically send new contact to Resend
              </label>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
}
