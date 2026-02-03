import { useState, useRef, useEffect } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, Link2, Image,
  AlignLeft, AlignCenter, AlignRight, Quote, Heading1, Heading2, Heading3,
  X, Plus, GripVertical, ChevronUp, ChevronDown, Eye, EyeOff,
  Check, Settings, Maximize2, Minimize2, Type, Strikethrough, Code,
  Highlighter, Undo, Redo, Minus
} from 'lucide-react';

// Enhanced Rich Text Editor Component
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  label?: string;
  simple?: boolean; // Simplified toolbar for smaller areas
}

export function RichTextEditor({ value, onChange, placeholder, minHeight = 200, label, simple = false }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHtml, setShowHtml] = useState(false);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [fontSize, setFontSize] = useState('16');

  useEffect(() => {
    if (editorRef.current && !showHtml) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const updateActiveFormats = () => {
    const formats: string[] = [];
    if (document.queryCommandState('bold')) formats.push('bold');
    if (document.queryCommandState('italic')) formats.push('italic');
    if (document.queryCommandState('underline')) formats.push('underline');
    if (document.queryCommandState('strikeThrough')) formats.push('strikethrough');
    if (document.queryCommandState('insertUnorderedList')) formats.push('ul');
    if (document.queryCommandState('insertOrderedList')) formats.push('ol');
    setActiveFormats(formats);
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          execCommand('undo');
          break;
        case 'y':
          e.preventDefault();
          execCommand('redo');
          break;
      }
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const setTextColor = (color: string) => {
    execCommand('foreColor', color);
    setShowColorPicker(false);
  };

  const setBackgroundColor = (color: string) => {
    execCommand('hiliteColor', color);
    setShowColorPicker(false);
  };

  const changeFontSize = (size: string) => {
    setFontSize(size);
    execCommand('fontSize', '7');
    // Apply actual pixel size
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = size + 'px';
      range.surroundContents(span);
    }
  };

  const colors = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#14b8a6',
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899'
  ];

  const simpleToolbar = [
    { icon: Bold, command: 'bold', label: 'Bold', format: 'bold' },
    { icon: Italic, command: 'italic', label: 'Italic', format: 'italic' },
    { type: 'divider' },
    { icon: List, command: 'insertUnorderedList', label: 'Bullet List', format: 'ul' },
    { icon: ListOrdered, command: 'insertOrderedList', label: 'Numbered List', format: 'ol' },
    { type: 'divider' },
    { icon: Link2, action: insertLink, label: 'Insert Link' },
  ];

  const fullToolbar = [
    { icon: Undo, command: 'undo', label: 'Undo' },
    { icon: Redo, command: 'redo', label: 'Redo' },
    { type: 'divider' },
    { icon: Bold, command: 'bold', label: 'Bold (Ctrl+B)', format: 'bold' },
    { icon: Italic, command: 'italic', label: 'Italic (Ctrl+I)', format: 'italic' },
    { icon: Underline, command: 'underline', label: 'Underline (Ctrl+U)', format: 'underline' },
    { icon: Strikethrough, command: 'strikeThrough', label: 'Strikethrough', format: 'strikethrough' },
    { type: 'divider' },
    { icon: Heading1, command: 'formatBlock', value: 'h1', label: 'Heading 1' },
    { icon: Heading2, command: 'formatBlock', value: 'h2', label: 'Heading 2' },
    { icon: Heading3, command: 'formatBlock', value: 'h3', label: 'Heading 3' },
    { icon: Type, command: 'formatBlock', value: 'p', label: 'Paragraph' },
    { type: 'divider' },
    { icon: List, command: 'insertUnorderedList', label: 'Bullet List', format: 'ul' },
    { icon: ListOrdered, command: 'insertOrderedList', label: 'Numbered List', format: 'ol' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', label: 'Quote' },
    { icon: Code, command: 'formatBlock', value: 'pre', label: 'Code Block' },
    { type: 'divider' },
    { icon: AlignLeft, command: 'justifyLeft', label: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', label: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', label: 'Align Right' },
    { type: 'divider' },
    { icon: Link2, action: insertLink, label: 'Insert Link' },
    { icon: Image, action: insertImage, label: 'Insert Image' },
    { icon: Minus, command: 'insertHorizontalRule', label: 'Horizontal Line' },
  ];

  const toolbarButtons = simple ? simpleToolbar : fullToolbar;

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden bg-white ${isFullscreen ? 'fixed inset-4 z-50 flex flex-col' : ''}`}>
      {label && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHtml(!showHtml)}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${showHtml ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {showHtml ? <Eye size={14} /> : <EyeOff size={14} />}
              {showHtml ? 'Preview' : 'HTML'}
            </button>
            {!simple && (
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        {toolbarButtons.map((btn, i) => {
          if (btn.type === 'divider') {
            return <div key={i} className="w-px h-6 bg-gray-300 mx-1" />;
          }
          const Icon = btn.icon!;
          const isActive = btn.format && activeFormats.includes(btn.format);
          const btnValue = 'value' in btn ? btn.value : undefined;
          return (
            <button
              key={i}
              onClick={() => btn.action ? btn.action() : execCommand(btn.command!, btnValue)}
              className={`p-1.5 rounded hover:bg-gray-200 transition ${isActive ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:text-gray-900'}`}
              title={btn.label}
            >
              <Icon size={16} />
            </button>
          );
        })}
        
        {/* Color Picker Button */}
        {!simple && (
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition flex items-center gap-1"
              title="Text Color"
            >
              <Highlighter size={16} />
            </button>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48">
                <p className="text-xs text-gray-500 mb-1">Text Color</p>
                <div className="grid grid-cols-6 gap-1 mb-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setTextColor(color)}
                      className="w-6 h-6 rounded border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mb-1">Highlight</p>
                <div className="grid grid-cols-6 gap-1">
                  {colors.slice(6).map(color => (
                    <button
                      key={color}
                      onClick={() => setBackgroundColor(color)}
                      className="w-6 h-6 rounded border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Font Size Selector */}
        {!simple && (
          <select
            value={fontSize}
            onChange={(e) => changeFontSize(e.target.value)}
            className="px-2 py-1 text-xs border border-gray-200 rounded bg-white text-gray-600"
          >
            <option value="12">12px</option>
            <option value="14">14px</option>
            <option value="16">16px</option>
            <option value="18">18px</option>
            <option value="20">20px</option>
            <option value="24">24px</option>
            <option value="28">28px</option>
            <option value="32">32px</option>
          </select>
        )}
      </div>

      {/* Editor */}
      {showHtml ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 font-mono text-sm focus:outline-none resize-none flex-1"
          style={{ minHeight }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onMouseUp={updateActiveFormats}
          onKeyUp={updateActiveFormats}
          className={`w-full p-4 focus:outline-none prose prose-sm max-w-none overflow-auto ${isFullscreen ? 'flex-1' : ''}`}
          style={{ minHeight: isFullscreen ? 'auto' : minHeight }}
          data-placeholder={placeholder}
        />
      )}

      {/* Word count */}
      <div className="px-4 py-1.5 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
        <span>{value.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words</span>
        <span>{value.replace(/<[^>]*>/g, '').length} characters</span>
      </div>
    </div>
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
              className={`group relative bg-white border border-gray-200 rounded-xl overflow-hidden transition-all ${
                draggedIndex === index ? 'opacity-50 scale-98' : ''
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
            className={`w-7 h-7 rounded-lg border-2 transition ${
              value.toLowerCase() === color.toLowerCase()
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
