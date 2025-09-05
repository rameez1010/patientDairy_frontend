import { useEffect, useRef, useState } from 'react';

import { jwtDecode } from 'jwt-decode';
import { marked } from 'marked';
import { FaBookMedical, FaRegBell, FaTrash } from 'react-icons/fa';
import { FiSun } from 'react-icons/fi';
import { RiRobot2Fill } from 'react-icons/ri';

import doctorApiService from '../../services/doctorApiService';
import { getGreeting } from '../../utils/helperFunctions';
import DeleteModal from './DeleteModal';
import PdfReferenceDrawer from './PdfReferenceDrawer';
import AILoader from './smaller_components/AILoader';
import CustomEditor from './smaller_components/CustomEditor';
import ResponseReferences from './smaller_components/ResponseReferences.jsx';

const AIKnowledge = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('');
  const [selectedOriginalUrl, setSelectedOriginalUrl] = useState('');
  const [selectedPdfTitle, setSelectedPdfTitle] = useState('');
  const [openReferenceId, setOpenReferenceId] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const token = localStorage.getItem('jwtToken') || '';
  const decodedToken = token ? jwtDecode(token) : { first_name: 'User' };

  const LOCALSTORAGE_KEY = 'aiKnowledgeChatMessages';
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [hasLoadedMessages, setHasLoadedMessages] = useState(false);

  const getUserId = () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) return null;
      const decoded = jwtDecode(token);
      return decoded?.sub || decoded?.user_id || decoded?.id || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      setHasLoadedMessages(true);
      return;
    }

    setHasLoadedMessages(false);
    const stored = localStorage.getItem(LOCALSTORAGE_KEY);

    try {
      if (stored) {
        const obj = JSON.parse(stored);
        if (typeof obj === 'object' && obj !== null && Array.isArray(obj[userId])) {
          setMessages(obj[userId]);
        } else {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    } catch {
      console.error('Failed to parse chat history from localStorage');
      setMessages([]);
    } finally {
      setHasLoadedMessages(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedMessages) return;
    const userId = getUserId();
    if (!userId) return;
    const stored = localStorage.getItem(LOCALSTORAGE_KEY);
    let obj = {};
    if (stored) {
      try {
        obj = JSON.parse(stored) || {};
      } catch {
        obj = {};
      }
    }
    obj[userId] = messages.slice(-50);
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(obj));
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.warn('Storage limit exceeded, trimming older messages...');
        obj[userId] = obj[userId].slice(-30);
        try {
          localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(obj));
        } catch {
          console.error('Failed to save trimmed chat history to localStorage');
        }
      }
    }
  }, [messages, hasLoadedMessages]);

  useEffect(() => {
    if (chatEndRef.current) {
      const isInitialLoad = messages.length > 0 && !loading;
      chatEndRef.current.scrollIntoView({
        behavior: isInitialLoad ? 'instant' : 'smooth',
      });
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = { id: Date.now(), type: 'user', content: inputValue.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const chatHistory = messages.slice(-5).map((m) => ({
        role: m.type === 'user' ? 'user' : 'model',
        content: m.content,
      }));
      const response = await doctorApiService.post('/ai-knowledge/ask', {
        question: userMessage.content,
        chatHistory,
      });
      if (!response.data.success) throw new Error('AI API Error');

      const data = response.data.data;
      console.log({ data });
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data?.answer || 'Sorry, no response from AI.',
        references: data?.references || [],
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          type: 'ai',
          content:
            "I apologize, but I'm currently unable to process your request. This could be due to a temporary connection issue. Please try asking your question again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const hasMessages = messages.length > 0;

  const handleClearChat = () => {
    setMessages([]);
    setShowClearModal(false);
  };

  return (
    <div className="h-screen bg-white w-full overflow-auto">
      <div className="h-12 bg-white flex items-center justify-between p-3 border-b gap-1">
        <span className="flex items-center gap-2">
          <FiSun className="text-gray-500" /> {getGreeting()}, {decodedToken.first_name}!
        </span>
        <FaRegBell className="text-gray-400" />
      </div>

      <div className="flex flex-col h-[calc(100%-113px)] max-h-[calc(100%-113px)] rounded-xl shadow-md bg-[#f7f8fa] mx-6 my-8 border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 bg-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-medium font-bold text-gray-600 flex items-center gap-2">
                <FaBookMedical /> Med AI
              </h1>
              <span className="text-sm font-light text-gray-500">Ask me questions about Functional Medicine</span>
            </div>
            {hasMessages && (
              <button
                onClick={() => setShowClearModal(true)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Clear chat history"
              >
                <FaTrash size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col" id="chat-history">
          {!hasMessages ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-[#5558E4] mb-2">What can I help with?</h2>
                <p className="text-gray-500">Ask me anything about Functional Medicine</p>
              </div>
              <CustomEditor
                inputValue={inputValue}
                setInputValue={setInputValue}
                loading={loading}
                width="w-full max-w-2xl"
                handleSend={handleSend}
              />
            </div>
          ) : (
            <div className="flex-1 ">
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type === 'user' ? (
                      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200 max-w-[70%]">
                        <p className="text-gray-800">{message.content}</p>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 max-w-[80%]">
                        <div className="w-8 h-8 bg-[#5558E4] rounded-full flex items-center justify-center text-white shadow-sm flex-shrink-0">
                          <RiRobot2Fill />
                        </div>
                        <div>
                          <div className="relative text-gray-700 leading-snug whitespace-break-spaces">
                            <span
                              style={{ display: 'block' }}
                              dangerouslySetInnerHTML={{ __html: marked(message.content) }}
                            />
                            <ResponseReferences
                              message={message}
                              openReferenceId={openReferenceId}
                              setOpenReferenceId={setOpenReferenceId}
                              setSelectedPdfUrl={setSelectedPdfUrl}
                              setSelectedOriginalUrl={setSelectedOriginalUrl}
                              setSelectedPdfTitle={setSelectedPdfTitle}
                              setDrawerOpen={setDrawerOpen}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {loading && <AILoader />}
                <div ref={chatEndRef} />
              </div>
            </div>
          )}
        </div>

        {hasMessages && (
          <CustomEditor
            inputValue={inputValue}
            setInputValue={setInputValue}
            loading={loading}
            width="w-full"
            handleSend={handleSend}
          />
        )}
      </div>

      <PdfReferenceDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedPdfTitle}
        pdfUrl={selectedPdfUrl}
        originalUrl={selectedOriginalUrl}
      />

      {showClearModal && (
        <DeleteModal
          onClose={() => setShowClearModal(false)}
          onConfirm={handleClearChat}
          title="Clear Chat History"
          message="Are you sure you want to clear all chat messages? This action cannot be undone and all conversation history will be permanently removed."
          confirmText="Clear Chat"
          cancelText="Cancel"
          iconColor="blue"
          confirmButtonColor="blue"
        />
      )}
    </div>
  );
};

export default AIKnowledge;
