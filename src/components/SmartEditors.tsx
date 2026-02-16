import { useState, useEffect } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, Link2, Image,
  AlignLeft, AlignCenter, AlignRight, Quote, Heading1, Heading2, Heading3,
  X, Plus, GripVertical, ChevronUp, ChevronDown, Eye, EyeOff,
  Check, Settings, Maximize2, Minimize2, Type, Strikethrough, Code,
  Highlighter, Undo, Redo, Sparkles, Wand2, Languages, MessageSquare,
  RotateCcw, Copy
} from 'lucide-react';

import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import UnderlineExtension from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';

// Custom Font Size Extension
const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: (attributes: any) => {
              if (!attributes.fontSize) {
                return {};
              }
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }: any) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }: any) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .run();
      },
    };
  },
} as any);

// Enhanced Rich Text Editor Component using Tiptap
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  label?: string;
  simple?: boolean;
}

export function RichTextEditor({ value, onChange, placeholder, minHeight = 200, label, simple = false }: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHtml, setShowHtml] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiResponse, setAIResponse] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      ImageExtension.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto my-4 shadow-md',
        },
      }),
      Youtube.configure({
        width: 840,
        height: 480,
        HTMLAttributes: {
          class: 'aspect-video w-full rounded-xl my-4 shadow-md',
        },
      }),
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write something amazing...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync value from outside if it changes (and it's different from current editor content)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const toggleLink = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt('URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = (url: string) => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setShowMediaPicker(false);
  };

  const handleAIAction = async (type: 'writing' | 'summary') => {
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' '
    );
    const contentToProcess = selectedText || editor.getText();

    if (!contentToProcess) return;

    setIsAIProcessing(true);
    try {
      const { generateContent } = await import('../services/aiService');
      const response = await generateContent(contentToProcess, type);
      setAIResponse(response.content);
    } catch (error) {
      console.error('AI Action failed:', error);
    } finally {
      setIsAIProcessing(false);
    }
  };

  const applyAIResponse = () => {
    if (!aiResponse) return;

    const { from, to } = editor.state.selection;
    if (from !== to) {
      editor.chain().focus().insertContent(aiResponse).run();
    } else {
      editor.chain().focus().setContent(aiResponse).run();
    }
    setAIResponse('');
    setShowAIAssistant(false);
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('YouTube URL:');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };

  const ToolbarButton = ({
    onClick,
    isActive = false,
    icon: Icon,
    title
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon: any;
    title: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded transition ${isActive
        ? 'bg-amber-100 text-amber-700'
        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
        }`}
      title={title}
    >
      <Icon size={16} />
    </button>
  );

  const colors = [
    '#000000', '#333333', '#666666', '#999999', '#ef4444', '#f59e0b',
    '#22c55e', '#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#ffffff'
  ];

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px'];

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden bg-white ${isFullscreen ? 'fixed inset-4 z-[9999] flex flex-col shadow-2xl' : ''
      }`}>
      {/* Header */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label || 'Content Editor'}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHtml(!showHtml)}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${showHtml ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
              }`}
          >
            {showHtml ? <Eye size={14} /> : <EyeOff size={14} />}
            {showHtml ? 'Preview' : 'HTML'}
          </button>
          <button
            type="button"
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 font-bold ${showAIAssistant ? 'bg-amber-100 text-amber-700' : 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
              }`}
          >
            <Sparkles size={14} className={isAIProcessing ? 'animate-pulse' : ''} />
            AI Assistant
          </button>
          {!simple && (
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      {!showHtml && (
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-white border-b border-gray-100">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            icon={Undo}
            title="Undo"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            icon={Redo}
            title="Redo"
          />
          <div className="w-px h-6 bg-gray-200 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            icon={Bold}
            title="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            icon={Italic}
            title="Italic"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            icon={Underline}
            title="Underline"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            icon={Strikethrough}
            title="Strikethrough"
          />

          {!simple && (
            <>
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <select
                onChange={(e) => {
                  if (e.target.value === 'default') {
                    editor.chain().focus().unsetFontSize().run();
                  } else {
                    editor.chain().focus().setFontSize(e.target.value).run();
                  }
                }}
                className="text-xs px-2 py-1 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none"
              >
                <option value="default">Size: Default</option>
                {fontSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>

              <div className="w-px h-6 bg-gray-200 mx-1" />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                icon={Heading1}
                title="Heading 1"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                icon={Heading2}
                title="Heading 2"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                icon={Heading3}
                title="Heading 3"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().setParagraph().run()}
                isActive={editor.isActive('paragraph')}
                icon={Type}
                title="Paragraph"
              />
            </>
          )}

          <div className="w-px h-6 bg-gray-200 mx-1" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon={List}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon={ListOrdered}
            title="Ordered List"
          />
          {!simple && (
            <>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                icon={Quote}
                title="Quote"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive('codeBlock')}
                icon={Code}
                title="Code Block"
              />
            </>
          )}

          <div className="w-px h-6 bg-gray-200 mx-1" />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            icon={AlignLeft}
            title="Align Left"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            icon={AlignCenter}
            title="Align Center"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            icon={AlignRight}
            title="Align Right"
          />

          {!simple && (
            <>
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <div className="relative">
                <ToolbarButton
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  isActive={showColorPicker}
                  icon={Highlighter}
                  title="Text Color"
                />
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-40">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 px-1">Colors</p>
                    <div className="grid grid-cols-4 gap-1">
                      {colors.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            editor.chain().focus().setColor(color).run();
                            setShowColorPicker(false);
                          }}
                          className="w-8 h-8 rounded border border-gray-100 hover:scale-110 transition shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().unsetColor().run();
                        setShowColorPicker(false);
                      }}
                      className="w-full mt-2 py-1 text-[10px] bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                    >
                      Clear Color
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="w-px h-6 bg-gray-200 mx-1" />
          <ToolbarButton onClick={toggleLink} isActive={editor.isActive('link')} icon={Link2} title="Link" />
          <ToolbarButton onClick={() => setShowMediaPicker(true)} icon={Image} title="Insert Image from Library" />
          {!simple && (
            <ToolbarButton onClick={addYoutubeVideo} icon={Plus} title="Insert YouTube Video" />
          )}
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Content */}
        <div className={`flex-1 overflow-auto ${isFullscreen ? 'h-full' : ''}`} style={{ minHeight: isFullscreen ? 'auto' : minHeight }}>
          {showHtml ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm focus:outline-none resize-none bg-gray-900 text-gray-100"
              style={{ minHeight }}
            />
          ) : (
            <EditorContent
              editor={editor}
              className="tiptap-editor px-6 py-4 min-h-full prose prose-amber max-w-none focus:outline-none"
            />
          )}
        </div>

        {/* AI Assistant Sidebar */}
        {showAIAssistant && (
          <div className="w-80 border-l border-gray-200 bg-white flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-amber-50/30">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                AI Writing Assistant
              </h3>
              <button onClick={() => setShowAIAssistant(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                <p className="text-xs text-amber-800 leading-relaxed">
                  Select text in the editor to improve it, or use the actions below to transform the entire content.
                </p>
              </div>

              {!aiResponse ? (
                <div className="grid gap-2">
                  <AIActionButton
                    icon={Wand2}
                    label="Improve Writing"
                    description="Better flow, tone and clarity"
                    onClick={() => handleAIAction('writing')}
                  />
                  <AIActionButton
                    icon={Languages}
                    label="Fix Grammar"
                    description="Fix typos and punctuation"
                    onClick={() => handleAIAction('writing')}
                  />
                  <AIActionButton
                    icon={MessageSquare}
                    label="Summarize Content"
                    description="Create a concise summary"
                    onClick={() => handleAIAction('summary')}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">AI Suggestion</span>
                      <button
                        onClick={() => setAIResponse('')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {aiResponse}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={applyAIResponse}
                      className="w-full bg-amber-500 text-white py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-amber-600 transition flex items-center justify-center gap-2"
                    >
                      <Check size={16} />
                      Apply to Editor
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiResponse);
                        // Add some toast notification here if available
                      }}
                      className="w-full bg-white border border-gray-200 text-gray-700 py-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                      <Copy size={16} />
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              )}
            </div>

            {isAIProcessing && (
              <div className="p-4 border-t border-gray-100 bg-amber-50 flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium text-amber-700">AI is thinking...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Choose Media</h3>
                <p className="text-xs text-gray-500">Select an image from your library or enter a URL</p>
              </div>
              <button onClick={() => setShowMediaPicker(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="mb-6 flex gap-2">
                <input
                  type="url"
                  placeholder="Paste external image URL here..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addImage((e.target as HTMLInputElement).value);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input[type="url"]') as HTMLInputElement;
                    if (input?.value) addImage(input.value);
                  }}
                  className="px-6 py-2 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition"
                >
                  Add URL
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {(() => {
                  const saved = localStorage.getItem('brm_media_library');
                  const images = saved ? JSON.parse(saved) : [];
                  if (images.length === 0) {
                    return (
                      <div className="col-span-full py-12 text-center">
                        <Image size={40} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500 text-sm">Media library is empty.</p>
                      </div>
                    );
                  }
                  return images.map((img: any) => (
                    <div
                      key={img.id}
                      onClick={() => addImage(img.url)}
                      className="group relative aspect-square bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:border-amber-500 transition shadow-sm"
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Plus className="text-white opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer / Stats */}
      <div className="px-4 py-1.5 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 flex justify-between uppercase font-bold tracking-wider">
        <div className="flex gap-4">
          <span>{editor.storage.characterCount?.words?.() || 0} Words</span>
          <span>{editor.getText().length} Characters</span>
        </div>
        <div>
          {editor.isActive('bold') && <span className="mr-2">Bold</span>}
          {editor.isActive('italic') && <span className="mr-2">Italic</span>}
          {editor.isActive('link') && <span>Link</span>}
        </div>
      </div>

      <style>{`
        .tiptap-editor .ProseMirror:focus {
          outline: none;
        }
        .tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .tiptap-editor .ProseMirror {
          min-height: ${minHeight}px;
        }
      `}</style>
    </div>
  );
}

function AIActionButton({ icon: Icon, label, description, onClick }: {
  icon: any;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full p-3 text-left rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50 transition group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-amber-100 transition">
          <Icon size={18} className="text-gray-600 group-hover:text-amber-600" />
        </div>
        <div>
          <div className="text-sm font-bold text-gray-900">{label}</div>
          <div className="text-[10px] text-gray-400">{description}</div>
        </div>
      </div>
    </button>
  );
}

// Image Upload/URL Component
interface ImageInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  aspectRatio?: string;
  placeholder?: string;
}

export function ImageInput({ value, onChange, label, aspectRatio = '16/9', placeholder = 'Enter image URL or upload' }: ImageInputProps) {
  const [showPreview, setShowPreview] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="url"
            value={value}
            onChange={(e) => { onChange(e.target.value); setError(false); }}
            placeholder={placeholder}
            className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          {value && (
            <button
              onClick={() => onChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={`px-3 py-2 rounded-lg border ${showPreview ? 'bg-amber-50 border-amber-200 text-amber-700' : 'border-gray-200 text-gray-500'}`}
        >
          <Eye size={16} />
        </button>
      </div>

      {showPreview && value && (
        <div className={`relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200`} style={{ aspectRatio }}>
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center text-red-500 text-sm">
              Failed to load image
            </div>
          ) : (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setError(true)}
              onLoad={() => setError(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Highlights Editor Component - For day highlights with details
interface HighlightItem {
  title: string;
  description: string;
  icon?: string;
}

interface HighlightsEditorProps {
  highlights: HighlightItem[];
  onChange: (highlights: HighlightItem[]) => void;
  label?: string;
}

export function HighlightsEditor({ highlights, onChange, label }: HighlightsEditorProps) {
  const icons = ['⭐', '🏔️', '🏛️', '📸', '🍽️', '🏨', '🚗', '🌅', '🌊', '🌳', '🏰', '🎭', '🎪', '⛪', '🕌', '🗿'];

  const addHighlight = () => {
    onChange([...highlights, { title: '', description: '', icon: '⭐' }]);
  };

  const updateHighlight = (index: number, updates: Partial<HighlightItem>) => {
    const newHighlights = [...highlights];
    newHighlights[index] = { ...newHighlights[index], ...updates };
    onChange(newHighlights);
  };

  const removeHighlight = (index: number) => {
    onChange(highlights.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      {highlights.map((highlight, index) => (
        <div key={index} className="flex gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {/* Icon Selector */}
          <div className="relative group">
            <button className="w-10 h-10 bg-white border border-gray-200 rounded-lg text-xl flex items-center justify-center hover:border-amber-300">
              {highlight.icon || '⭐'}
            </button>
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden group-hover:grid grid-cols-4 gap-1 w-32">
              {icons.map(icon => (
                <button
                  key={icon}
                  onClick={() => updateHighlight(index, { icon })}
                  className="w-7 h-7 rounded hover:bg-gray-100 text-lg"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Description */}
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={highlight.title}
              onChange={(e) => updateHighlight(index, { title: e.target.value })}
              placeholder="Highlight title"
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg"
            />
            <input
              type="text"
              value={highlight.description}
              onChange={(e) => updateHighlight(index, { description: e.target.value })}
              placeholder="Brief description (optional)"
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600"
            />
          </div>

          {/* Remove Button */}
          <button
            onClick={() => removeHighlight(index)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg self-start"
          >
            <X size={16} />
          </button>
        </div>
      ))}

      <button
        onClick={addHighlight}
        className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-amber-300 hover:text-amber-600 transition flex items-center justify-center gap-2 text-sm"
      >
        <Plus size={16} /> Add Highlight
      </button>
    </div>
  );
}

// Drag & Drop List Component
interface DraggableListItem {
  id: string;
  [key: string]: any;
}

interface DraggableListProps<T extends DraggableListItem> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, handlers: { remove: () => void; update: (updates: Partial<T>) => void }) => React.ReactNode;
  addLabel?: string;
  onAdd?: () => void;
  emptyMessage?: string;
}

export function DraggableList<T extends DraggableListItem>({
  items,
  onChange,
  renderItem,
  addLabel = 'Add Item',
  onAdd,
  emptyMessage = 'No items added'
}: DraggableListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, updates: Partial<T>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange(newItems);
  };

  return (
    <div className="space-y-2">
      {items.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500 mb-3">{emptyMessage}</p>
          {onAdd && (
            <button onClick={onAdd} className="text-amber-600 font-medium text-sm">
              + {addLabel}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedIndex !== null && draggedIndex !== index) {
                  moveItem(draggedIndex, index);
                }
                setDraggedIndex(null);
              }}
              className={`group relative bg-white border border-gray-200 rounded-xl overflow-hidden transition-all ${draggedIndex === index ? 'opacity-50 scale-98' : ''
                }`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab bg-gray-50 border-r border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={16} className="text-gray-400" />
              </div>
              <div className="pl-0 group-hover:pl-8 transition-all">
                {renderItem(item, index, {
                  remove: () => removeItem(index),
                  update: (updates) => updateItem(index, updates)
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {onAdd && items.length > 0 && (
        <button
          onClick={onAdd}
          className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-amber-300 hover:text-amber-600 transition flex items-center justify-center gap-2"
        >
          <Plus size={18} /> {addLabel}
        </button>
      )}
    </div>
  );
}

// Color Picker Component
interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  presets?: string[];
}

export function ColorPicker({ value, onChange, label, presets = [] }: ColorPickerProps) {
  const defaultPresets = [
    '#f59e0b', '#ea580c', '#ef4444', '#ec4899', '#8b5cf6',
    '#3b82f6', '#06b6d4', '#10b981', '#84cc16', '#1f2937'
  ];
  const allPresets = presets.length > 0 ? presets : defaultPresets;

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200 bg-transparent"
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono uppercase"
            placeholder="#000000"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {allPresets.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-7 h-7 rounded-lg border-2 transition ${value.toLowerCase() === color.toLowerCase()
              ? 'border-gray-900 scale-110'
              : 'border-transparent hover:border-gray-300'
              }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

// Toggle Switch Component
interface ToggleSwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}

export function ToggleSwitch({ value, onChange, label, description }: ToggleSwitchProps) {
  return (
    <label className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="relative">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-12 h-6 rounded-full transition-colors ${value ? 'bg-amber-500' : 'bg-gray-300'}`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${value ? 'translate-x-7' : 'translate-x-1'}`} />
        </div>
      </div>
    </label>
  );
}

// Tabs Component
interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

export function Tabs({ tabs, activeTab, onChange, variant = 'default' }: TabsProps) {
  const getTabStyles = () => {
    switch (variant) {
      case 'pills':
        return {
          container: 'flex gap-2 p-1 bg-gray-100 rounded-xl',
          active: 'bg-white shadow-sm text-gray-900',
          inactive: 'text-gray-500 hover:text-gray-700',
          tab: 'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2'
        };
      case 'underline':
        return {
          container: 'flex border-b border-gray-200',
          active: 'border-b-2 border-amber-500 text-amber-600 -mb-px',
          inactive: 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent',
          tab: 'px-4 py-3 text-sm font-medium transition-all flex items-center gap-2'
        };
      default:
        return {
          container: 'flex gap-1',
          active: 'bg-amber-50 text-amber-700 border-amber-200',
          inactive: 'text-gray-500 hover:bg-gray-50 border-transparent',
          tab: 'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border'
        };
    }
  };

  const styles = getTabStyles();

  return (
    <div className={styles.container}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`${styles.tab} ${isActive ? styles.active : styles.inactive}`}
          >
            {Icon && <Icon size={16} />}
            {tab.label}
            {tab.badge !== undefined && (
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${isActive ? 'bg-amber-200 text-amber-800' : 'bg-gray-200 text-gray-600'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string | number;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export function CollapsibleSection({ title, children, defaultOpen = false, badge, icon: Icon }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} className="text-amber-500" />}
          <span className="font-medium text-gray-900">{title}</span>
          {badge !== undefined && (
            <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">{badge}</span>
          )}
        </div>
        <ChevronDown size={18} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
}

// Stats Card Component
interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  trend?: { value: number; label: string };
  color?: 'amber' | 'blue' | 'green' | 'purple' | 'red';
}

export function StatsCard({ label, value, icon: Icon, trend, color = 'amber' }: StatsCardProps) {
  const colorClasses = {
    amber: 'bg-gradient-to-br from-amber-500 to-orange-500',
    blue: 'bg-gradient-to-br from-blue-500 to-indigo-500',
    green: 'bg-gradient-to-br from-green-500 to-teal-500',
    purple: 'bg-gradient-to-br from-purple-500 to-pink-500',
    red: 'bg-gradient-to-br from-red-500 to-rose-500'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon size={22} className="text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend.value >= 0 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

// Action Button Component
interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<{ size?: number }>;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function ActionButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  loading = false,
  fullWidth = false
}: ActionButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500 disabled:bg-amber-300',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 disabled:bg-gray-50',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 disabled:bg-red-300',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      ) : null}
      {children}
    </button>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon size={28} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-gray-500 mb-4 max-w-sm mx-auto">{description}</p>}
      {action && (
        <ActionButton onClick={action.onClick} size="sm">
          <Plus size={16} /> {action.label}
        </ActionButton>
      )}
    </div>
  );
}

// Notification Toast Component
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: Check,
    error: X,
    warning: Settings,
    info: Settings
  };

  const Icon = icons[type];

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${typeStyles[type]} animate-fade-in-up`}>
      <Icon size={18} />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="p-1 hover:opacity-70">
        <X size={14} />
      </button>
    </div>
  );
}
