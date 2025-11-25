import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { CategoryType, SourceItem } from '../types';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryType: CategoryType;
  onImageGenerated: (item: SourceItem) => void;
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, categoryType, onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError('');

    try {
      if (!process.env.API_KEY) {
        throw new Error("API Key not found. Please set REACT_APP_GEMINI_API_KEY.");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Using Flash Image for fast generation
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: `Generate a cute, simple, child-friendly texture or isolated object for a ${categoryType} category. Prompt: ${prompt}. White background.` }]
        },
      });

      let imageUrl = '';
      for (const part of response.candidates?.[0]?.content?.parts || []) {
         if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
         }
      }

      if (imageUrl) {
        const newItem: SourceItem = {
            id: `ai-${Date.now()}`,
            name: prompt.substring(0, 10),
            type: categoryType,
            color: 'bg-white',
            shape: 'rounded-rect',
            gradient: 'none',
            imageUrl: imageUrl
        };
        onImageGenerated(newItem);
        onClose();
        setPrompt('');
      } else {
         setError('Failed to generate image. Try a different prompt.');
      }

    } catch (err: any) {
      console.error(err);
      setError('Error generating image. Key might be missing or invalid.');
    } finally {
      setLoading(false);
    }
  };

  const titleMap = {
    fabric: 'Create Fabric Pattern',
    decoration: 'Create Decoration',
    natural: 'Create Nature Item'
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border-4 border-indigo-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                <Sparkles size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">AI 魔法创造</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          描述你想要的 {categoryType === 'fabric' ? '布料' : categoryType === 'decoration' ? '装饰' : '自然物品'}，AI 会帮你画出来！
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="例如：带蓝色星星的布料..."
          className="w-full h-32 p-4 rounded-xl border-2 border-indigo-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none resize-none mb-4 text-lg"
        />

        {error && <p className="text-red-500 mb-4 text-sm font-medium">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-[1.02] active:scale-[0.98]'}`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> 正在施展魔法...
            </>
          ) : (
            <>
              <Sparkles /> 生成图片
            </>
          )}
        </button>
      </div>
    </div>
  );
};
