import { useRef, useState, useEffect } from 'react';
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
  Animated,
} from 'react-native';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY ?? "";

type Message = {
  role: 'user' | 'bot';
  content: string;
};

type GroqMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const SYSTEM_PROMPT = `You are "Hike Assistant," a hiking expert.
Help users with trails (Pakistan & global), trip planning, safety, and gear.
- Default language: English.
- If user writes in Roman Urdu, reply in Roman Urdu.
- Keep answers clear and concise.
- Use bullet points for lists.
- Highlight key info with **bold** text.
If a query is not hiking-related, briefly respond and redirect to hiking.`;

// 3 bouncing dots typing animation
function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      ).start();

    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, []);

  return (
    <View style={typingStyles.container}>
      <View style={typingStyles.bubble}>
        <Text style={typingStyles.label}>Thinking</Text>
        <View style={typingStyles.dotsRow}>
          {[dot1, dot2, dot3].map((dot, i) => (
            <Animated.View
              key={i}
              style={[typingStyles.dot, { transform: [{ translateY: dot }] }]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const typingStyles = StyleSheet.create({
  container: { alignSelf: 'flex-start', marginVertical: 6, marginLeft: 12 },
  bubble: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: { color: '#9CA3AF', fontSize: 13 },
  dotsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' },
});

async function callGroq(conversationHistory: GroqMessage[]): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...conversationHistory,
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content as string;
}

export default function ChatWidget() {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [groqHistory, setGroqHistory] = useState<GroqMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);

    const newGroqHistory: GroqMessage[] = [
      ...groqHistory,
      { role: 'user', content: userText },
    ];
    setLoading(true);

    try {
      const reply = await callGroq(newGroqHistory);
      setMessages(prev => [...prev, { role: 'bot', content: reply }]);
      setGroqHistory([...newGroqHistory, { role: 'assistant', content: reply }]);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          content: `❌ **Error:** ${errMsg}\n\nAPI key check karo.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setGroqHistory([]);
  };

  const SUGGESTIONS = [
    'What should I pack for a day hike?',
    'How to prepare for high elevation hiking?',
    'What are the best hiking trails in Pakistan?',
  ];

  return (
    <>
      <Pressable
        style={styles.floatingBtn}
        onPress={() => setVisible(true)}
        android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
      >
        <Text style={styles.icon}>💬</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide" onRequestClose={() => setVisible(false)}>
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
                  {loading ? '✍️ Typing...' : '🟢 Online'}
                </Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              {messages.length > 0 && (
                <Pressable onPress={clearChat} style={styles.headerButton}>
                  <Text style={styles.clearText}>Clear</Text>
                </Pressable>
              )}
              <Pressable onPress={() => setVisible(false)} style={styles.headerButton}>
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
            {messages.length === 0 && !loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🏔️</Text>
                <Text style={styles.emptyTitle}>Hike Assistant</Text>
                <Text style={styles.emptyMessage}>
                  Ask anything about trails, safety, or equipment!
                </Text>
                <View style={styles.suggestionsContainer}>
                  <Text style={styles.suggestionsTitle}>Try karo:</Text>
                  {SUGGESTIONS.map(q => (
                    <Pressable
                      key={q}
                      style={styles.suggestionButton}
                      onPress={() => setInput(q)}
                    >
                      <Text style={styles.suggestionText}>{q}</Text>
                    </Pressable>
                  ))}
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
                ListFooterComponent={loading ? <TypingIndicator /> : null}
                onContentSizeChange={() =>
                  listRef.current?.scrollToEnd({ animated: true })
                }
                onLayout={() =>
                  listRef.current?.scrollToEnd({ animated: false })
                }
              />
            )}
          </KeyboardAvoidingView>

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
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  icon: { color: '#ffffff', fontSize: 22 },
  modal: { flex: 1, backgroundColor: '#0f172a' },
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 20 },
  headerTitle: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  headerSubtitle: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  clearText: { color: '#9CA3AF', fontWeight: '600', fontSize: 14 },
  closeText: { color: '#16a34a', fontWeight: '600', fontSize: 14 },
  content: { flex: 1 },
  messages: { padding: 12, paddingBottom: 20 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  emptyMessage: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  suggestionsContainer: { width: '100%', maxWidth: 320 },
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
  suggestionText: { color: '#e2e8f0', fontSize: 14, textAlign: 'center' },
});
