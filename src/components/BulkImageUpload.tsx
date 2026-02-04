import { useState } from 'react';
import { X, Image, Upload, Link as LinkIcon, Check } from 'lucide-react';

interface BulkImageUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onAddImages: (images: { url: string; caption?: string }[]) => void;
  title?: string;
}

export function BulkImageUpload({ isOpen, onClose, onAddImages, title = "Add Multiple Images" }: BulkImageUploadProps) {
  const [urls, setUrls] = useState('');
  const [addCaptions, setAddCaptions] = useState(false);
  const [images, setImages] = useState<{ url: string; caption: string }[]>([]);
  const [step, setStep] = useState<'urls' | 'captions'>('urls');

  if (!isOpen) return null;

  const handleParseUrls = () => {
    const urlList = urls
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0 && (u.startsWith('http://') || u.startsWith('https://')));
    
    if (urlList.length > 0) {
      if (addCaptions) {
        setImages(urlList.map(url => ({ url, caption: '' })));
        setStep('captions');
      } else {
        onAddImages(urlList.map(url => ({ url })));
        handleClose();
      }
    }
  };

  const handleAddWithCaptions = () => {
    onAddImages(images);
    handleClose();
  };

  const handleClose = () => {
    setUrls('');
    setImages([]);
    setStep('urls');
    setAddCaptions(false);
    onClose();
  };

  const updateCaption = (index: number, caption: string) => {
    setImages(prev => prev.map((img, i) => i === index ? { ...img, caption } : img));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Image className="text-amber-600" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">
                {step === 'urls' ? 'Paste image URLs, one per line' : `Add captions to ${images.length} images`}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 'urls' ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LinkIcon size={16} className="inline mr-2" />
                  Image URLs (one per line)
                </label>
                <textarea
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                  className="w-full h-48 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                />
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addCaptions}
                    onChange={(e) => setAddCaptions(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-gray-700">Add captions to images</span>
                </label>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                <strong>Tip:</strong> You can paste URLs from image hosting services like:
                <ul className="mt-2 ml-4 list-disc">
                  <li>Cloudinary</li>
                  <li>ImgBB</li>
                  <li>Unsplash</li>
                  <li>Any direct image URL ending in .jpg, .png, .webp</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {images.map((img, index) => (
                <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <img 
                    src={img.url} 
                    alt={`Preview ${index + 1}`} 
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96?text=Error';
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 truncate mb-2">{img.url}</p>
                    <input
                      type="text"
                      value={img.caption}
                      onChange={(e) => updateCaption(index, e.target.value)}
                      placeholder="Enter caption for this image..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg self-start"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            {step === 'urls' 
              ? `${urls.split('\n').filter(u => u.trim()).length} URLs entered`
              : `${images.length} images ready`
            }
          </div>
          <div className="flex gap-3">
            {step === 'captions' && (
              <button 
                onClick={() => setStep('urls')} 
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
              >
                Back
              </button>
            )}
            <button 
              onClick={handleClose} 
              className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button 
              onClick={step === 'urls' ? handleParseUrls : handleAddWithCaptions}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center gap-2 font-semibold"
            >
              {step === 'urls' ? (
                <>
                  <Upload size={18} />
                  {addCaptions ? 'Next: Add Captions' : 'Add All Images'}
                </>
              ) : (
                <>
                  <Check size={18} />
                  Add {images.length} Images
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
