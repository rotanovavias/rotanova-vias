import React, { useState } from 'react';
import ImageViewer from 'react-simple-image-viewer';

function ImageGrid({ imageUrls }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openImageViewer = (index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="cursor-pointer" onClick={() => openImageViewer(index)}>
            <img src={url} alt={`Image ${index}`} className="w-full h-auto" />
          </div>
        ))}
      </div>
      {isViewerOpen && (
        <ImageViewer
          src={imageUrls}
          currentIndex={currentImage}
          onClose={closeImageViewer}
          backgroundStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
        />
      )}
    </div>
  );
}

export default ImageGrid;
