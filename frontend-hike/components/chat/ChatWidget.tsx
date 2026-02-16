// components/chat/ChatWidget.tsx
import { useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import { api } from '@/lib/api';

type Message = {
  role: 'user' | 'bot';
  content: string;
  timestamp?: Date;
};

export default function ChatWidget() {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const listRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Add thinking indicator
    const thinkingMessage: Message = {
      role: 'bot',
      content: 'Thinking...',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, thinkingMessage]);

    try {
      // Use centralized API client
      const data = await api.chat.send(userMessage.content);

      // Replace thinking message with actual response
      setMessages((prev) => {
        const withoutThinking = prev.slice(0, -1);
        return [
          ...withoutThinking,
          {
            role: 'bot',
            content: data.reply,
            timestamp: new Date(),
          },
        ];
      });
    } catch (error) {
      console.error('Chat error:', error);
      
      // Replace thinking message with error
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unable to connect to the server. Please try again.';

      setMessages((prev) => {
        const withoutThinking = prev.slice(0, -1);
        return [
          ...withoutThinking,
          {
            role: 'bot',
            content: `Sorry, I encountered an error: ${errorMessage}`,
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const closeChat = () => {
    setVisible(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Pressable 
        style={styles.floatingBtn} 
        onPress={() => setVisible(true)}
        android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
      >
        <Text style={styles.icon}>💬</Text>
      </Pressable>

      {/* Chat Modal */}
      <Modal 
        visible={visible} 
        animationType="slide"
        onRequestClose={closeChat}
      >
        <SafeAreaView style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>🏔️</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>Hike Assistant</Text>
                <Text style={styles.headerSubtitle}>
                  Always here to help
                </Text>
              </View>
            </View>
            
            <View style={styles.headerActions}>
              {messages.length > 0 && (
                <Pressable 
                  onPress={clearChat} 
                  style={styles.headerButton}
                  android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <Text style={styles.clearText}>Clear</Text>
                </Pressable>
              )}
              <Pressable 
                onPress={closeChat}
                style={styles.headerButton}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
              >
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </View>
          </View>

          {/* Messages */}
          <KeyboardAvoidingView 
            style={styles.content}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            {messages.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🏔️</Text>
                <Text style={styles.emptyTitle}>Welcome to Hike Assistant!</Text>
                <Text style={styles.emptyMessage}>
                  Ask me anything about hiking, trails, safety, or equipment.
                </Text>
                <View style={styles.suggestionsContainer}>
                  <Text style={styles.suggestionsTitle}>Try asking:</Text>
                  <Pressable 
                    style={styles.suggestionButton}
                    onPress={() => setInput('What should I pack for a day hike?')}
                  >
                    <Text style={styles.suggestionText}>What should I pack for a day hike?</Text>
                  </Pressable>
                  <Pressable 
                    style={styles.suggestionButton}
                    onPress={() => setInput('How do I prepare for high elevation?')}
                  >
                    <Text style={styles.suggestionText}>How do I prepare for high elevation?</Text>
                  </Pressable>
                  <Pressable 
                    style={styles.suggestionButton}
                    onPress={() => setInput('What are the 10 essentials?')}
                  >
                    <Text style={styles.suggestionText}>What are the 10 essentials?</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                  <ChatBubble role={item.role} content={item.content} />
                )}
                contentContainerStyle={styles.messages}
                onContentSizeChange={() => 
                  listRef.current?.scrollToEnd({ animated: true })
                }
                onLayout={() => 
                  listRef.current?.scrollToEnd({ animated: false })
                }
              />
            )}

            {/* Loading indicator */}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#22c55e" />
                <Text style={styles.loadingText}>Assistant is typing...</Text>
              </View>
            )}
          </KeyboardAvoidingView>

          {/* Input */}
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            loading={loading}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingBtn: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 30,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  icon: {
    color: '#ffffff',
    fontSize: 22,
  },
  modal: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#1f2933',
    backgroundColor: '#020617',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearText: {
    color: '#9CA3AF',
    fontWeight: '600',
    fontSize: 14,
  },
  closeText: {
    color: '#16a34a',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  messages: {
    padding: 12,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyMessage: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  suggestionsContainer: {
    width: '100%',
    maxWidth: 320,
  },
  suggestionsTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  suggestionButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  suggestionText: {
    color: '#e2e8f0',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#1e293b',
    borderRadius: 12,
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 8,
  },
});