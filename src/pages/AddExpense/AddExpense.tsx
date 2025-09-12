import PageLayout from '@/components/PageLayout/PageLayout';
import { apiFetch } from '@/config/api';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import { type CategoriesResponse } from '@/types/api';
import { type FC, useCallback, useMemo, useRef, useState } from 'react';

type MessageSide = 'user' | 'ai';

type ChatMessage =
  | { id: string; kind: 'text'; text: string; at: number; from: MessageSide }
  | {
      id: string;
      kind: 'file';
      fileName: string;
      size: number;
      url: string;
      at: number;
      from: MessageSide;
    }
  | { id: string; kind: 'image'; url: string; at: number; from: MessageSide }
  | { id: string; kind: 'audio'; url: string; at: number; from: MessageSide }
  | {
      id: string;
      kind: 'ai_result';
      summary: string;
      items: Array<{ category: number; note: string; amount: number }>;
      meta: {
        cost: number;
        token_input: number;
        token_output: number;
        content_input_token: number;
        attachment_name: string;
      };
      at: number;
      from: MessageSide;
    }
  | {
      id: string;
      kind: 'success_table';
      items: Array<{ category: number; note: string; amount: number }>;
      at: number;
      from: MessageSide;
    }
  | {
      id: string;
      kind: 'loading';
      text?: string;
      at: number;
      from: MessageSide;
    };

interface FinanceAiSuccessData {
  content:
    | Array<{ category: number; note: string; amount: number }>
    | { answer: string };
  cost: number;
  token_input: number;
  token_output: number;
  content_input_token: number;
  attachment_name: string;
}

interface FinanceAiResponse {
  data: FinanceAiSuccessData;
  success: boolean;
}

const AddExpense: FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = sessionStorage.getItem('add-expense-messages');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const listEndRef = useRef<HTMLDivElement | null>(null);
  const { invalidateMoneyNotes } = useQueryInvalidation();

  // Fetch categories for mapping IDs to names
  const { data: categoriesData } = useApiQuery({
    queryKey: ['categories-active'],
    queryFn: async () =>
      await apiFetch<CategoriesResponse>('/api/v1/category?status=2'),
    loadingMessage: undefined,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 0,
  });

  const categoryMap = useMemo(() => {
    const categories = categoriesData?.data ?? [];
    const map = new Map<number, string>();
    categories.forEach((cat) => map.set(cat.id, cat.name));
    return map;
  }, [categoriesData]);

  // Voice recording state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const speechRecognitionRef = useRef<any>(null);

  // Image upload ref
  const imageFileInputRef = useRef<HTMLInputElement | null>(null);

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  const scrollToBottom = useCallback(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Start speech recognition for live audio
  const startSpeechRecognition = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (
        !('webkitSpeechRecognition' in window) &&
        !('SpeechRecognition' in window)
      ) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'vi-VN'; // Vietnamese language
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      let finalTranscript = '';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        finalTranscript = event.results[0][0].transcript;
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      recognition.onend = () => {
        resolve(finalTranscript);
      };

      // Store reference for stopping
      speechRecognitionRef.current = recognition;

      // Start recognition
      recognition.start();
    });
  }, []);

  // Save messages to session storage whenever messages change
  const saveMessages = useCallback((newMessages: ChatMessage[]) => {
    try {
      sessionStorage.setItem(
        'add-expense-messages',
        JSON.stringify(newMessages)
      );
    } catch {
      // Ignore storage errors
    }
  }, []);

  const updateMessages = useCallback(
    (updater: (prev: ChatMessage[]) => ChatMessage[]) => {
      setMessages((prev) => {
        const newMessages = updater(prev);
        saveMessages(newMessages);
        return newMessages;
      });
    },
    [saveMessages]
  );

  const callFinanceAi = useCallback(
    async (params: {
      chat?: string;
      file?: File;
      file_type?: string;
      attachment_name?: string;
      template_id?: string | number;
      engine?: string;
      model?: string;
      assistant_id?: string;
      web_search?: string | boolean;
      detail?: string | boolean;
      max_token_input?: string | number;
      max_token_output?: string | number;
    }) => {
      const form = new FormData();
      if (params.chat) form.append('chat', params.chat);
      if (params.engine) form.append('engine', String(params.engine));
      if (params.assistant_id)
        form.append('assistant_id', String(params.assistant_id));
      if (params.model) form.append('model', String(params.model));
      if (params.max_token_input != null)
        form.append('max_token_input', String(params.max_token_input));
      if (params.max_token_output != null)
        form.append('max_token_output', String(params.max_token_output));
      if (params.detail != null) form.append('detail', String(params.detail));
      if (params.web_search != null)
        form.append('web_search', String(params.web_search));
      if (params.template_id != null)
        form.append('template_id', String(params.template_id));
      if (params.file) form.append('file', params.file, params.file.name);
      if (params.file_type) form.append('file_type', params.file_type);
      if (params.attachment_name)
        form.append('attachment_name', params.attachment_name);

      setIsSubmitting(true);

      // Add loading message
      const loadingId = crypto.randomUUID();
      updateMessages((prev) => [
        ...prev,
        {
          id: loadingId,
          kind: 'loading',
          text: 'Đang xử lý...',
          at: Date.now(),
          from: 'ai',
        },
      ]);
      setTimeout(scrollToBottom, 0);

      try {
        const res = await apiFetch<FinanceAiResponse>(
          '/api/v3/finance-ai/chat',
          {
            method: 'POST',
            body: form,
          }
        );

        // Remove loading message
        updateMessages((prev) => prev.filter((m) => m.id !== loadingId));

        const r = res?.data;
        if (!r) return;

        // If the content is an object with an answer, just show it as AI text
        if (
          !Array.isArray(r.content) &&
          r.content &&
          typeof r.content === 'object' &&
          'answer' in (r.content as Record<string, unknown>)
        ) {
          const answer = (r.content as { answer: string }).answer;
          updateMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              kind: 'text',
              text: answer,
              at: Date.now(),
              from: 'ai',
            },
          ]);
          return;
        }

        // Otherwise treat content as structured items
        const items =
          (r.content as Array<{
            category: number;
            note: string;
            amount: number;
          }>) ?? [];
        if (items.length) {
          const summary = items
            .map(
              (i) =>
                `${i.note} (${i.category}): ${i.amount.toLocaleString(
                  'vi-VN'
                )}đ`
            )
            .join('; ');
          updateMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              kind: 'ai_result',
              summary,
              items,
              meta: {
                cost: r.cost,
                token_input: r.token_input,
                token_output: r.token_output,
                content_input_token: r.content_input_token,
                attachment_name: r.attachment_name,
              },
              at: Date.now(),
              from: 'ai',
            },
          ]);

          // Map AI result into payload for add money note API
          try {
            const payload = items.map((i) => ({
              type: 1,
              note: i.note,
              amount: i.amount,
              category_id: i.category,
            }));
            await apiFetch<unknown>('/api/v1/money-note', {
              method: 'POST',
              body: JSON.stringify(payload),
            });

            // Invalidate money notes queries to refresh dashboard and other pages
            invalidateMoneyNotes();

            updateMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                kind: 'success_table',
                items,
                at: Date.now(),
                from: 'ai',
              },
            ]);
          } catch (err) {
            const m =
              err instanceof Error
                ? err.message
                : 'Không thể thêm khoản chi tiêu.';
            updateMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                kind: 'text',
                text: `Lỗi thêm chi tiêu: ${m}`,
                at: Date.now(),
                from: 'ai',
              },
            ]);
          }
        }
      } catch (err) {
        // Remove loading message
        updateMessages((prev) => prev.filter((m) => m.id !== loadingId));

        const message = err instanceof Error ? err.message : 'Yêu cầu thất bại';
        updateMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            kind: 'text',
            text: `Lỗi: ${message}`,
            at: Date.now(),
            from: 'ai',
          },
        ]);
      } finally {
        setIsSubmitting(false);
        setTimeout(scrollToBottom, 0);
      }
    },
    [scrollToBottom, updateMessages, invalidateMoneyNotes]
  );

  const onSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;
    updateMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        kind: 'text',
        text,
        at: Date.now(),
        from: 'user',
      },
    ]);
    setInputValue('');
    setTimeout(scrollToBottom, 0);
    void callFinanceAi({
      chat: text,
      engine: 'google',
      assistant_id: 'finance_ai',
      model: 'gemini-2.0-flash-lite',
      max_token_input: 50000,
      max_token_output: 50000,
      detail: true,
      web_search: false,
      template_id: 1,
    });
  }, [inputValue, scrollToBottom, callFinanceAi, updateMessages]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    },
    [onSend]
  );

  const onUploadImagesClick = useCallback(() => {
    imageFileInputRef.current?.click();
  }, []);

  const onImagesSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      const newMsgs: ChatMessage[] = [];
      const firstImage = files[0];

      // Process each image file
      const processImages = async () => {
        for (let i = 0; i < files.length; i++) {
          const f = files.item(i)!;
          if (!f.type.startsWith('image/')) continue;

          // Convert file to base64 data URL for persistent storage
          const base64Url = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(f);
          });

          newMsgs.push({
            id: crypto.randomUUID(),
            kind: 'image',
            url: base64Url,
            at: Date.now(),
            from: 'user',
          });
        }

        if (newMsgs.length) {
          updateMessages((prev) => [...prev, ...newMsgs]);
          setTimeout(scrollToBottom, 0);
          // Call AI with the first image as attachment
          void callFinanceAi({
            chat: '',
            engine: 'google',
            assistant_id: 'finance_ai',
            model: 'gemini-2.0-flash-lite',
            max_token_input: 50000,
            max_token_output: 50000,
            detail: true,
            web_search: false,
            template_id: 1,
            file: firstImage,
            file_type: 'image',
            attachment_name: firstImage.name,
          });
        }
      };

      void processImages();
      e.target.value = '';
    },
    [scrollToBottom, callFinanceAi, updateMessages]
  );

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    recorder.stop();

    // Stop speech recognition if it's running
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      // Start speech recognition for live audio
      let speechPromise: Promise<string> | null = null;
      try {
        speechPromise = startSpeechRecognition();
      } catch (error) {
        console.warn('Speech recognition not available:', error);
      }

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        // Convert blob to base64 data URL for persistent storage
        const reader = new FileReader();
        reader.onload = () => {
          const base64Url = reader.result as string;
          updateMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              kind: 'audio',
              url: base64Url,
              at: Date.now(),
              from: 'user',
            },
          ]);
          setTimeout(scrollToBottom, 0);
        };
        reader.readAsDataURL(blob);

        setIsRecording(false);
        stream.getTracks().forEach((t) => t.stop());

        // Stop speech recognition
        if (speechRecognitionRef.current) {
          speechRecognitionRef.current.stop();
        }

        // Process speech recognition result
        if (speechPromise) {
          try {
            setIsTranscribing(true);

            // Add loading message for transcription
            const loadingId = crypto.randomUUID();
            updateMessages((prev) => [
              ...prev,
              {
                id: loadingId,
                kind: 'loading',
                text: 'Đang chuyển đổi giọng nói thành văn bản...',
                at: Date.now(),
                from: 'ai',
              },
            ]);
            setTimeout(scrollToBottom, 0);

            const transcript = await speechPromise;

            // Remove loading message
            updateMessages((prev) => prev.filter((m) => m.id !== loadingId));

            if (transcript.trim()) {
              // Add the transcribed text as a user message
              updateMessages((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  kind: 'text',
                  text: transcript,
                  at: Date.now(),
                  from: 'user',
                },
              ]);
              setTimeout(scrollToBottom, 0);

              // Submit the transcribed text to AI
              void callFinanceAi({
                chat: transcript,
                engine: 'google',
                assistant_id: 'finance_ai',
                model: 'gemini-2.0-flash-lite',
                max_token_input: 50000,
                max_token_output: 50000,
                detail: true,
                web_search: false,
                template_id: 1,
              });
            } else {
              // Show error message if no text was transcribed
              updateMessages((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  kind: 'text',
                  text: 'Không thể nhận diện giọng nói. Vui lòng thử lại.',
                  at: Date.now(),
                  from: 'ai',
                },
              ]);
              setTimeout(scrollToBottom, 0);
            }
          } catch (error) {
            // Remove loading message if it exists
            updateMessages((prev) =>
              prev.filter((m) => m.kind !== 'loading' || m.from !== 'ai')
            );

            // Show error message if speech recognition fails
            const errorMessage =
              error instanceof Error
                ? error.message
                : 'Lỗi nhận diện giọng nói';
            updateMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                kind: 'text',
                text: `Lỗi: ${errorMessage}`,
                at: Date.now(),
                from: 'ai',
              },
            ]);
            setTimeout(scrollToBottom, 0);
          } finally {
            setIsTranscribing(false);
          }
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      /* permission denied or error */
    }
  }, [scrollToBottom, updateMessages, callFinanceAi, startSpeechRecognition]);

  const toggleVoice = useCallback(() => {
    if (isRecording) stopRecording();
    else void startRecording();
  }, [isRecording, startRecording, stopRecording]);

  return (
    <PageLayout
      title='Ghi nhận chi tiêu'
      icon='📝'
      subtitle='Ghi lại chi tiêu một cách nhanh chóng và dễ dàng'
    >
      <div className='max-w-3xl mx-auto card-glass border p-4 sm:p-6'>
        <div className='flex flex-col h-[60vh]'>
          <div className='flex-1 overflow-y-auto space-y-3 pr-1'>
            {hasMessages ? (
              messages.map((m) => {
                const isUser = m.from === 'user';
                const bubbleStyle = isUser
                  ? {
                      backgroundColor: 'var(--theme-primary)',
                      color: '#ffffff',
                    }
                  : {
                      backgroundColor: 'var(--theme-surface-secondary)',
                      color: 'var(--theme-text)',
                    };
                return (
                  <div
                    key={m.id}
                    className={`w-full flex ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {m.kind === 'text' ? (
                      <div
                        className='inline-block max-w-[80%] px-3 py-2 rounded-xl'
                        style={bubbleStyle}
                      >
                        <div className='whitespace-pre-wrap break-words text-sm'>
                          {m.text}
                        </div>
                        <div className='mt-1 text-[10px] opacity-60'>
                          {new Date(m.at).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    ) : m.kind === 'file' ? (
                      <div
                        className='inline-block max-w-[80%] px-3 py-2 rounded-xl'
                        style={bubbleStyle}
                      >
                        <div className='text-sm font-medium'>Tệp đính kèm</div>
                        <a
                          href={m.url}
                          target='_blank'
                          rel='noreferrer'
                          className='mt-1 block text-primary underline break-all'
                          title={m.fileName}
                        >
                          {m.fileName}
                        </a>
                        <div className='text-[10px] opacity-60'>
                          {(m.size / 1024).toFixed(1)} KB •{' '}
                          {new Date(m.at).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    ) : m.kind === 'image' ? (
                      <div
                        className='inline-block max-w-[80%] p-2 rounded-xl'
                        style={bubbleStyle}
                      >
                        <img
                          src={m.url}
                          alt='attachment'
                          className='rounded-lg max-w-full h-auto'
                          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.12)' }}
                        />
                        <div className='text-[10px] opacity-60 mt-1'>
                          {new Date(m.at).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    ) : m.kind === 'ai_result' ? (
                      <div
                        className='inline-block w-full max-w-[95%] px-4 py-3 rounded-xl'
                        style={{
                          backgroundColor: 'var(--theme-surface-secondary)',
                          color: 'var(--theme-text)',
                          border: '1px solid var(--theme-border)',
                        }}
                      >
                        <div className='text-sm font-semibold mb-2'>
                          Kết quả phân tích
                        </div>
                        <div
                          className={`text-sm ${
                            m.items.length > 10
                              ? 'max-h-80 sm:max-h-60 md:max-h-80 lg:max-h-96 overflow-y-auto'
                              : ''
                          }`}
                        >
                          <ul className='space-y-0.5'>
                            {m.items.map((it, idx) => (
                              <li
                                key={idx}
                                className='flex items-center justify-between py-0.5'
                              >
                                <span>
                                  {it.note} (
                                  {categoryMap.get(it.category) ??
                                    `#${it.category}`}
                                  )
                                </span>
                                <span className='font-medium'>
                                  {it.amount.toLocaleString('vi-VN')}đ
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className='mt-2 text-[10px] opacity-60'>
                          {new Date(m.at).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    ) : m.kind === 'success_table' ? (
                      <div
                        className='inline-block w-full max-w-[95%] px-4 py-3 rounded-xl'
                        style={{
                          backgroundColor: 'var(--theme-surface-secondary)',
                          color: 'var(--theme-text)',
                          border: '1px solid var(--theme-border)',
                        }}
                      >
                        <div className='text-sm font-semibold mb-2'>
                          Đã thêm {m.items.length} khoản chi tiêu
                        </div>
                        <div
                          className={`overflow-x-auto ${
                            m.items.length > 10
                              ? 'max-h-80 sm:max-h-60 md:max-h-80 lg:max-h-96 overflow-y-auto'
                              : ''
                          }`}
                        >
                          <table className='w-full text-sm'>
                            <thead>
                              <tr
                                className='border-b'
                                style={{ borderColor: 'var(--theme-border)' }}
                              >
                                <th className='text-left py-0.5'>Ghi chú</th>
                                <th className='text-left py-0.5'>Danh mục</th>
                                <th className='text-right py-0.5'>Số tiền</th>
                              </tr>
                            </thead>
                            <tbody>
                              {m.items.map((it, idx) => (
                                <tr
                                  key={idx}
                                  className='border-b'
                                  style={{ borderColor: 'var(--theme-border)' }}
                                >
                                  <td className='py-0.5'>{it.note}</td>
                                  <td className='py-0.5'>
                                    {categoryMap.get(it.category) ??
                                      `#${it.category}`}
                                  </td>
                                  <td className='py-0.5 text-right font-medium'>
                                    {it.amount.toLocaleString('vi-VN')}đ
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className='mt-2 text-[10px] opacity-60'>
                          {new Date(m.at).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    ) : m.kind === 'loading' ? (
                      <div
                        className='inline-block max-w-[80%] px-3 py-2 rounded-xl'
                        style={{
                          backgroundColor: 'var(--theme-surface-secondary)',
                          color: 'var(--theme-text)',
                        }}
                      >
                        <div className='flex items-center gap-2 text-sm'>
                          <div className='animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full'></div>
                          {m.text || 'Đang xử lý...'}
                        </div>
                        <div className='mt-1 text-[10px] opacity-60'>
                          {new Date(m.at).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    ) : (
                      <div
                        className='inline-block max-w-[80%] px-3 py-2 rounded-xl'
                        style={bubbleStyle}
                      >
                        <audio src={m.url} controls className='w-64' />
                        <div className='text-[10px] opacity-60 mt-1'>
                          {new Date(m.at).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div
                className='h-full w-full flex items-center justify-center text-sm'
                style={{ color: 'var(--theme-text-secondary)' }}
              >
                Chưa có tin nhắn nào
              </div>
            )}
            <div ref={listEndRef} />
          </div>

          {/* Searchbar-like chat input */}
          <div
            className='mt-3 pt-3'
            style={{ borderTop: '1px solid var(--theme-border)' }}
          >
            <div
              className='w-full flex items-center gap-2 px-3 py-2 shadow'
              style={{
                backgroundColor: 'var(--theme-surface)',
                border: '1px solid var(--theme-border)',
                borderRadius: '9999px',
              }}
            >
              {/* Optional leading search icon for visual parity */}
              <span
                aria-hidden
                className='text-base'
                style={{ color: 'var(--theme-text-secondary)' }}
              >
                🔎
              </span>

              <input
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder='Nhập tin nhắn...'
                className='flex-1 outline-none text-sm'
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--theme-text)',
                }}
              />

              {/* Hidden input for image uploads */}
              <input
                ref={imageFileInputRef}
                type='file'
                accept='image/*'
                multiple
                className='hidden'
                onChange={onImagesSelected}
              />

              {/* Icons on the right: send, image upload, voice */}
              <button
                type='button'
                onClick={onSend}
                className='h-8 w-8 rounded-full flex items-center justify-center text-white'
                style={{ backgroundColor: 'var(--theme-primary)' }}
                aria-label='Gửi'
                title='Gửi'
                disabled={isSubmitting}
              >
                ➤
              </button>
              <button
                type='button'
                onClick={onUploadImagesClick}
                className='h-8 w-8 rounded-full flex items-center justify-center'
                style={{
                  color: 'var(--theme-text)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--theme-border)',
                }}
                aria-label='Tải ảnh lên'
                title='Tải ảnh lên'
                disabled={isSubmitting}
              >
                🖼️
              </button>
              <button
                type='button'
                onClick={toggleVoice}
                className='h-8 w-8 rounded-full flex items-center justify-center'
                style={{
                  color: 'var(--theme-text)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--theme-border)',
                }}
                aria-label={
                  isRecording
                    ? 'Dừng ghi âm'
                    : isTranscribing
                    ? 'Đang chuyển đổi giọng nói thành văn bản...'
                    : 'Ghi âm giọng nói'
                }
                title={
                  isRecording
                    ? 'Dừng ghi âm'
                    : isTranscribing
                    ? 'Đang chuyển đổi giọng nói thành văn bản...'
                    : 'Ghi âm giọng nói'
                }
                disabled={isSubmitting || isTranscribing}
              >
                {isRecording ? '⏹' : isTranscribing ? '🔄' : '🎤'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AddExpense;
