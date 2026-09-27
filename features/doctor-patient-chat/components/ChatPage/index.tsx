'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppContext } from '../../../../context/AppContext';
import { useChatSocket } from '../../hooks/useChatSocket';
import { useConversations } from '../../hooks/useConversations';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import ConversationList from '../ConversationList';
import ChatWindow from '../ChatWindow';
import EmptyChat from '../EmptyChat';
import type { ChatCredentials, Conversation } from '../../types/chat.types';

const ChatPage: React.FC = () => {
  const { token, doctors } = useContext(AppContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  const credentials: ChatCredentials | null = useMemo(
    () => (token ? { token, role: 'patient' } : null),
    [token]
  );

  const { socket, connectionState } = useChatSocket(credentials);
  const { isOnline } = useOnlineStatus(socket);
  const conversationsApi = useConversations(socket, credentials);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [startingChat, setStartingChat] = useState(false);

  const resolveName = (doctorId: string) => {
    const doctor = doctors.find((d) => d._id === doctorId);
    return doctor?.name || 'Doctor';
  };
  const resolveImage = (doctorId: string) => {
    const image = doctors.find((d) => d._id === doctorId)?.image;
    return typeof image === 'string' ? image : undefined;
  };

  // Supports the "Appointment -> Chat with Doctor" entry point: a link to
  // /messages?doctorId=... starts (or opens the existing) conversation
  // with that doctor automatically.
  useEffect(() => {
    const doctorId = searchParams.get('doctorId');
    if (!doctorId || !credentials || startingChat) return;

    setStartingChat(true);
    conversationsApi.startOrOpenConversation(doctorId).then((result) => {
      setStartingChat(false);
      if (result.success && result.conversation) {
        setSelectedConversation(result.conversation);
        router.replace('/messages');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, credentials, startingChat]);

  if (!token) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Please login to view your messages.</p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700"
        >
          Login
        </button>
      </div>
    );
  }

  const handleSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    conversationsApi.clearUnread(conversation._id);
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-900 px-2 sm:px-0 mb-4">Messages</h1>

      <div className="flex bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ height: '75vh' }}>
        <div
          className={`w-full sm:w-80 border-r border-gray-200 overflow-y-auto ${
            selectedConversation ? 'hidden sm:block' : 'block'
          }`}
        >
          <ConversationList
            conversations={conversationsApi.conversations}
            loading={conversationsApi.loading || startingChat}
            activeId={selectedConversation?._id || null}
            onSelect={handleSelect}
            resolveName={resolveName}
            resolveImage={resolveImage}
            isOnline={isOnline}
            myRole="patient"
          />
        </div>

        <div className={`flex-1 ${selectedConversation ? 'block' : 'hidden sm:block'}`}>
          {selectedConversation && credentials ? (
            <ChatWindow
              credentials={credentials}
              conversation={selectedConversation}
              counterpartName={resolveName(selectedConversation.doctorId)}
              counterpartImage={resolveImage(selectedConversation.doctorId)}
              onBack={() => setSelectedConversation(null)}
            />
          ) : (
            <EmptyChat />
          )}
        </div>
      </div>

      {connectionState === 'disconnected' && (
        <p className="text-xs text-red-500 mt-2 px-2">
          Connection lost — trying to reconnect...
        </p>
      )}
    </div>
  );
};

export default ChatPage;
