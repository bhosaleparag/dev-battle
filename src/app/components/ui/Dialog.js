import { SoundButton } from './SoundButton';
import Typography from './Typography';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="w-full max-w-md rounded-lg border border-gray-15 bg-gray-08 p-6 text-gray-100"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <Typography variant="h4" className="font-semibold">{title}</Typography>
          )}
          <SoundButton
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-300"
            aria-label="Close"
          >
            <X />
          </SoundButton>
        </div>

        {/* Body */}
        {children}
      </div>
    </div>
  );
}
