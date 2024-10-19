import { useState ,useEffect} from 'react'

import './App.css'
import { CreateMLCEngine } from '@mlc-ai/web-llm';
function App () {
  const [engine, setEngine] = useState<any>(null); // エンジン
  const [inputText, setInputText] = useState<string>(''); // 入力
  const [response, setResponse] = useState<string>(''); // 出力
  const [loading, setLoading] = useState<boolean>(false); // ロード中
  
  // LLMエンジンの初期化
  const initializeEngine = async () => {
    setLoading(true);
    try {
      const initProgressCallback = (initProgress: any) => {
        setResponse(initProgress["text"]);
      }
      const engine = await CreateMLCEngine(
        "Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
        { initProgressCallback: initProgressCallback },
      );
      setEngine(engine)
    } catch (error) {
      setResponse('Error');
      console.error(error);
    } finally {
      setLoading(false);
    }      
    setLoading(false);
  }

  // 初期化
  useEffect(() => {
    const init = async () => {
      await initializeEngine();
    };
    init();
  }, []); 

  // ボタン押下時に呼ばれる
  const handleClick = async () => {
    setLoading(true);
    try {
      // メッセージの準備
      const messages: any = [
        { role: "user", content: inputText },
      ]

      // 推論の実行
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



export default App
