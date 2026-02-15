import { useState, useEffect } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Sliders, MousePointer2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ElementStyleConfig } from '../types';

interface VisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
}

const GOOGLE_FONTS = [
    'Inter', 'Montserrat', 'Poppins', 'Roboto', 'Open Sans', 'Lato', 'Nunito', 'Playfair Display',
    'Oswald', 'Raleway', 'Ubuntu', 'Merriweather', 'PT Sans', 'Noto Sans', 'Lora', 'Quicksand',
    'Kanit', 'Rubik', 'Work Sans', 'Fira Sans'
];

export function VisualEditor({ isOpen, onClose }: VisualEditorProps) {
    const { siteSettings, updateSiteSettings } = useApp();
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [activeTab, setActiveTab] = useState<'typography' | 'spacing' | 'design' | 'global'>('typography');
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Helper to get current styles for selected element
    const getStyles = (elementId: string): Partial<ElementStyleConfig> => {
        return siteSettings.homepageSections?.[elementId] || {};
    };

    const updateStyle = (key: keyof ElementStyleConfig, value: string) => {
        if (!selectedElement) return;

        const currentOverrides = siteSettings.homepageSections || {};
        const elementOverrides = currentOverrides[selectedElement] || {};

        updateSiteSettings({
            homepageSections: {
                ...currentOverrides,
                [selectedElement]: {
                    ...elementOverrides,
                    [key]: value
                }
            }
        });
    };

    // Selection mechanism
    useEffect(() => {
        if (!isSelecting) return;

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.brm-editor-sidebar')) return;
            target.style.outline = '2px dashed #f59e0b';
            target.style.outlineOffset = '2px';
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            target.style.outline = '';
        };

        const handleClick = (e: MouseEvent) => {
            if (!isSelecting) return;

            const target = e.target as HTMLElement;
            if (target.closest('.brm-editor-sidebar')) return;

            e.preventDefault();
            e.stopPropagation();

            // 1. Prioritize data-editor-id
            let selector = target.getAttribute('data-editor-id');

            // 2. Fallback to ID if it exists and looks stable
            if (!selector && target.id && !target.id.includes(':')) {
                selector = `#${target.id}`;
            }

            // 3. Fallback to Tag + First meaningful class
            if (!selector) {
                const tag = target.tagName.toLowerCase();
                const meaningfulClass = target.className.split(' ').find(c =>
                    c && !c.includes(':') && !c.includes('[') && !['flex', 'grid', 'relative', 'absolute', 'hidden', 'block'].includes(c)
                );
                selector = meaningfulClass ? `${tag}.${meaningfulClass}` : tag;
            }

            setSelectedElement(selector);
            setIsSelecting(false);

            // Clean up outlines
            const allElements = document.querySelectorAll('*');
            allElements.forEach(el => (el as HTMLElement).style.outline = '');
        };

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
        document.addEventListener('click', handleClick, true);

        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
            document.removeEventListener('click', handleClick, true);
        };
    }, [isSelecting]);

    if (!isOpen) return null;

    const currentStyles = selectedElement ? getStyles(selectedElement) : {};

    return (
        <div
            className={`fixed top-20 right-4 z-[9999] bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-3xl transition-all duration-300 brm-editor-sidebar flex flex-col ${isCollapsed ? 'w-16' : 'w-80'}`}
            style={{ height: 'calc(100vh - 120px)' }}
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                {!isCollapsed && (
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Sliders size={20} className="text-amber-500" />
                            Visual Editor
                        </h3>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">On-Page Customizer</p>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-400"
                >
                    {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            {!isCollapsed && (
                <>
                    {/* Main Controls */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Selection Tool */}
                        <div className="space-y-4">
                            <button
                                onClick={() => setIsSelecting(!isSelecting)}
                                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg ${isSelecting
                                    ? 'bg-amber-500 text-white shadow-amber-500/20'
                                    : 'bg-gray-900 text-white shadow-gray-900/20 hover:bg-gray-800'
                                    }`}
                            >
                                <MousePointer2 size={18} />
                                {isSelecting ? 'Selecting...' : 'Select Element'}
                            </button>

                            {selectedElement && (
                                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
                                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-1">Target</span>
                                    <p className="text-sm font-mono text-amber-900 truncate">{selectedElement}</p>
                                </div>
                            )}
                        </div>

                        {selectedElement ? (
                            <div className="space-y-6">
                                {/* Tabs */}
                                <div className="flex p-1 bg-gray-100 rounded-xl">
                                    {(['typography', 'spacing', 'design', 'global'] as const).map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </button>
                                    ))}
                                </div>

                                {/* Typography Tab */}
                                {activeTab === 'typography' && (
                                    <div className="space-y-6 animate-fade-in">
                                        <SelectControl
                                            label="Font Family"
                                            value={currentStyles.fontFamily || 'Inter'}
                                            options={GOOGLE_FONTS}
                                            onChange={v => updateStyle('fontFamily', v)}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <ColorControl
                                                label="Text Color"
                                                value={currentStyles.color || '#000000'}
                                                onChange={v => updateStyle('color', v)}
                                            />
                                            <SelectControl
                                                label="Text Align"
                                                value={currentStyles.textAlign || 'left'}
                                                options={['left', 'center', 'right', 'justify']}
                                                onChange={v => updateStyle('textAlign', v as any)}
                                            />
                                            <SelectControl
                                                label="Text Transform"
                                                value={currentStyles.textTransform || 'none'}
                                                options={['none', 'uppercase', 'lowercase', 'capitalize']}
                                                onChange={v => updateStyle('textTransform', v as any)}
                                            />
                                        </div>
                                        <ControlGroup label="Font Size" value={currentStyles.fontSize || '16px'} onChange={v => updateStyle('fontSize', v)} unit="px" min={12} max={120} />
                                        <ControlGroup label="Line Height" value={currentStyles.lineHeight || '1.5'} onChange={v => updateStyle('lineHeight', v)} step={0.1} min={1} max={3} />
                                        <ControlGroup label="Letter Spacing" value={currentStyles.letterSpacing || '0px'} onChange={v => updateStyle('letterSpacing', v)} unit="px" min={-5} max={20} />
                                        <SelectControl
                                            label="Font Weight"
                                            value={currentStyles.fontWeight || '400'}
                                            options={['100', '200', '300', '400', '500', '600', '700', '800', '900']}
                                            onChange={v => updateStyle('fontWeight', v)}
                                        />
                                    </div>
                                )}

                                {/* Spacing Tab */}
                                {activeTab === 'spacing' && (
                                    <div className="space-y-6 animate-fade-in">
                                        <div className="grid grid-cols-2 gap-4">
                                            <ControlGroup label="Padding T" value={currentStyles.paddingTop || '0px'} onChange={v => updateStyle('paddingTop', v)} unit="px" max={200} />
                                            <ControlGroup label="Padding B" value={currentStyles.paddingBottom || '0px'} onChange={v => updateStyle('paddingBottom', v)} unit="px" max={200} />
                                            <ControlGroup label="Padding L" value={currentStyles.paddingLeft || '0px'} onChange={v => updateStyle('paddingLeft', v)} unit="px" max={200} />
                                            <ControlGroup label="Padding R" value={currentStyles.paddingRight || '0px'} onChange={v => updateStyle('paddingRight', v)} unit="px" max={200} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <ControlGroup label="Margin T" value={currentStyles.marginTop || '0px'} onChange={v => updateStyle('marginTop', v)} unit="px" max={200} />
                                            <ControlGroup label="Margin B" value={currentStyles.marginBottom || '0px'} onChange={v => updateStyle('marginBottom', v)} unit="px" max={200} />
                                        </div>
                                    </div>
                                )}

                                {/* Dimensions Tab */}
                                {activeTab === 'design' && (
                                    <div className="space-y-6 animate-fade-in overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                                        {/* Background Section */}
                                        <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                                            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-2">Background</span>
                                            <ColorControl
                                                label="Background Color"
                                                value={currentStyles.backgroundColor || 'transparent'}
                                                onChange={v => updateStyle('backgroundColor', v)}
                                            />
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Background Image URL</label>
                                                <input
                                                    type="text"
                                                    value={currentStyles.backgroundImage || ''}
                                                    onChange={e => updateStyle('backgroundImage', e.target.value)}
                                                    placeholder="https://example.com/image.jpg"
                                                    className="w-full text-[10px] font-mono border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Border Section */}
                                        <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                                            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-2">Borders & Corners</span>
                                            <div className="grid grid-cols-2 gap-4">
                                                <ControlGroup label="Border Width" value={currentStyles.borderWidth || '0px'} onChange={v => updateStyle('borderWidth', v)} unit="px" max={20} />
                                                <ControlGroup label="Border Radius" value={currentStyles.borderRadius || '0px'} onChange={v => updateStyle('borderRadius', v)} unit="px" max={100} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <SelectControl
                                                    label="Border Style"
                                                    value={currentStyles.borderStyle || 'none'}
                                                    options={['none', 'solid', 'dashed', 'dotted']}
                                                    onChange={v => updateStyle('borderStyle', v as any)}
                                                />
                                                <ColorControl
                                                    label="Border Color"
                                                    value={currentStyles.borderColor || 'transparent'}
                                                    onChange={v => updateStyle('borderColor', v)}
                                                />
                                            </div>
                                        </div>

                                        {/* Effects Section */}
                                        <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                                            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-2">Effects</span>
                                            <SelectControl
                                                label="Hover Animation"
                                                value={currentStyles.hoverEffect || 'none'}
                                                options={['none', 'lift', 'glow', 'scale', 'darken']}
                                                onChange={v => updateStyle('hoverEffect', v as any)}
                                            />
                                            <ControlGroup label="Opacity" value={currentStyles.opacity || '1'} onChange={v => updateStyle('opacity', v)} step={0.1} min={0} max={1} />
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Box Shadow</label>
                                                <textarea
                                                    value={currentStyles.boxShadow || ''}
                                                    onChange={e => updateStyle('boxShadow', e.target.value)}
                                                    placeholder="0 10px 15px -3px rgb(0 0 0 / 0.1)..."
                                                    rows={2}
                                                    className="w-full text-[10px] font-mono border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Global Tab */}
                                {activeTab === 'global' && (
                                    <div className="space-y-8 animate-fade-in">
                                        {/* Colors */}
                                        <div className="space-y-4">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Colors</span>
                                            <div className="grid grid-cols-5 gap-2">
                                                {['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'].map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => updateSiteSettings({ colors: { ...siteSettings.colors, primary: color, accent: color } })}
                                                        className="aspect-square rounded-xl shadow-sm border-2 border-white transition transform hover:scale-110"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <ColorControl label="Primary" value={siteSettings.colors.primary} onChange={v => updateSiteSettings({ colors: { ...siteSettings.colors, primary: v } })} />
                                                <ColorControl label="Accent" value={siteSettings.colors.accent} onChange={v => updateSiteSettings({ colors: { ...siteSettings.colors, accent: v } })} />
                                            </div>
                                        </div>

                                        {/* Fonts */}
                                        <div className="space-y-4">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Typography</span>
                                            <div className="space-y-4">
                                                <SelectControl
                                                    label="Heading Font"
                                                    value={siteSettings.typography.headingFont}
                                                    options={['Inter', 'Montserrat', 'Poppins', 'Playfair Display', 'Oswald']}
                                                    onChange={v => updateSiteSettings({ typography: { ...siteSettings.typography, headingFont: v } })}
                                                />
                                                <SelectControl
                                                    label="Body Font"
                                                    value={siteSettings.typography.bodyFont}
                                                    options={['Inter', 'Roboto', 'Open Sans', 'Lato', 'Nunito']}
                                                    onChange={v => updateSiteSettings({ typography: { ...siteSettings.typography, bodyFont: v } })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-12 text-center space-y-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                                    <MousePointer2 className="text-gray-300" size={32} />
                                </div>
                                <p className="text-sm text-gray-400">Click the tool above and select an element on the page to start editing.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-gray-100 flex items-center gap-3">
                        <button
                            onClick={() => {
                                updateSiteSettings({ homepageSections: {} });
                                setSelectedElement(null);
                            }}
                            className="flex-1 py-3 bg-gray-50 text-gray-600 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-100 transition"
                        >
                            <RotateCcw size={14} /> Reset All
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-xs hover:bg-gray-800 transition"
                        >
                            Close
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

function ControlGroup({ label, value, onChange, unit = '', min = 0, max = 1000, step = 1 }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    unit?: string;
    min?: number;
    max?: number;
    step?: number;
}) {
    const numValue = parseFloat(value) || 0;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
                <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={numValue}
                onChange={(e) => onChange(e.target.value + unit)}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
        </div>
    );
}

function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 text-[10px] font-mono font-bold border border-gray-100 rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500"
                />
            </div>
        </div>
    );
}

function SelectControl({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full text-xs font-bold border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
}
