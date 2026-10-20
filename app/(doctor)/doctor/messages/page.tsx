"use client";

import React, { useContext, useMemo, useState } from "react";
import { DoctorContext } from "@/context/DoctorContext";
import { useChatSocket } from "@/features/doctor-patient-chat/hooks/useChatSocket";
import { useConversations } from "@/features/doctor-patient-chat/hooks/useConversations";
import { useOnlineStatus } from "@/features/doctor-patient-chat/hooks/useOnlineStatus";
import ConversationList from "@/features/doctor-patient-chat/components/ConversationList";
import ChatWindow from "@/features/doctor-patient-chat/components/ChatWindow";
import EmptyChat from "@/features/doctor-patient-chat/components/EmptyChat";
import type { ChatCredentials, Conversation } from "@/features/doctor-patient-chat/types/chat.types";

export default function DoctorMessagesPage() {
  const { dToken } = useContext(DoctorContext);

  const credentials: ChatCredentials | null = useMemo(
    () => (dToken ? { token: dToken, role: "doctor" } : null),
    [dToken]
  );

  const { socket, connectionState } = useChatSocket(credentials);
  const { isOnline } = useOnlineStatus(socket);
  const conversationsApi = useConversations(socket, credentials);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const resolveName = (patientId: string) => {
    const conv = conversationsApi.conversations.find((c) => c.patientId === patientId);
    return conv?.userData?.name || "Patient";
  };

  const resolveImage = (patientId: string) => {
    const conv = conversationsApi.conversations.find((c) => c.patientId === patientId);
    return conv?.userData?.image;
  };

  const handleSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    conversationsApi.clearUnread(conversation._id);
  };

  if (!dToken) {
    return (
      <div className="m-5 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="m-5 max-w-7xl">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Doctor–Patient Messages</h1>
        <p className="text-sm text-gray-500">
          Direct real-time clinical chat consultations with your booked patients.
        </p>
      </div>

      <div
        className="flex bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
        style={{ height: "76vh" }}
      >
        {/* Left Side: Conversation List */}
        <div
          className={`w-full sm:w-80 border-r border-gray-200 overflow-y-auto ${
            selectedConversation ? "hidden sm:block" : "block"
          }`}
        >
          <ConversationList
            conversations={conversationsApi.conversations}
            loading={conversationsApi.loading}
            activeId={selectedConversation?._id || null}
            onSelect={handleSelect}
            resolveName={resolveName}
            resolveImage={resolveImage}
            isOnline={isOnline}
            myRole="doctor"
          />
        </div>

        {/* Right Side: Active Chat Window */}
        <div className={`flex-1 ${selectedConversation ? "block" : "hidden sm:block"}`}>
          {selectedConversation && credentials ? (
            <ChatWindow
              credentials={credentials}
              conversation={selectedConversation}
              counterpartName={resolveName(selectedConversation.patientId)}
              counterpartImage={resolveImage(selectedConversation.patientId)}
              onBack={() => setSelectedConversation(null)}
            />
          ) : (
            <EmptyChat />
          )}
        </div>
      </div>

      {connectionState === "disconnected" && (
        <p className="text-xs text-red-500 mt-2 px-1">
          Chat connection lost — attempting to reconnect...
        </p>
      )}
    </div>
  );
}
