import { useState ,useEffect} from 'react'

import './Chat.css'
import { ChatCompletionMessageParam, CreateMLCEngine, MLCEngine } from '@mlc-ai/web-llm';
import { initProgressCallback } from '../helpers/initProgressCallback';
export function Chat () {
  const [engine, setEngine] = useState<MLCEngine | null>(null); 
  const [inputText, setInputText] = useState<string>(''); // 入力
  const [response, setResponse] = useState<string>(''); // 出力
  const [loading, setLoading] = useState<boolean>(false); // ロード中
 
  const initializeEngine = async () => {
    try {
       setLoading(true);
      const engine = await CreateMLCEngine(
        "Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
        { initProgressCallback: initProgressCallback(setResponse) },
      );
      setEngine(engine)
    } catch (error) {
      setResponse('Error');
      console.error(error);
    } finally {
      setLoading(false);
    }      
  }

  useEffect(() => {
   (async () => {
      await initializeEngine();
    })();
  }, []); 

  const handleClick = async () => {
    setLoading(true);
    try {
      // メッセージの準備
      const messages: ChatCompletionMessageParam[] = [
        { role: "user", content: inputText },
      ]

      if (!engine) return
    
      const reply = await engine.chat.completions.create({
        messages,
      });
      if (reply.choices[0].message.content) {
        setResponse(reply.choices[0].message.content);
      }
    } catch (error) {
      setResponse('Error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <div style={{ padding: '20px' }}>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows={4}
        cols={50}
      />
      <br />
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Send'}
      </button>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{response}</pre>
    </div>
  );
};

