import React, { memo } from 'react';
import ImagesAlbum from '../Images/ImagesAlbum';

interface ImageSectionProps {
  metadata: any;
}

const ImageSection = ({ metadata }: ImageSectionProps) => {
  return (
    <div className="w-full p-6 rounded-xl bg-surface/50 backdrop-blur-md border border-border-subtle/50 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-accent-teal/10 text-accent-teal">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-main">
          Visual Intelligence
        </h3>
      </div>

      <div className="overflow-y-auto max-h-[500px] custom-scrollbar rounded-lg bg-black/20">
        <ImagesAlbum images={metadata} />
      </div>
    </div>
  );
};

// Simple memo implementation that compares arrays properly
export default memo(ImageSection, (prevProps, nextProps) => {
  // If both are null/undefined or the same reference, they're equal
  if (prevProps.metadata === nextProps.metadata) return true;

  // If one is null/undefined but not the other, they're not equal
  if (!prevProps.metadata || !nextProps.metadata) return false;

  // Compare lengths
  if (prevProps.metadata.length !== nextProps.metadata.length) return false;

  // Compare each item
  for (let i = 0; i < prevProps.metadata.length; i++) {
    if (prevProps.metadata[i] !== nextProps.metadata[i]) return false;
  }

  return true;
}); 