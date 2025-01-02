import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-hot-toast';
import { getFaviconUrl } from '../utils/favicon';

interface CardProps {
  id: string;
  index: number;
  title: string;
  url: string;
  color: string;
  isEditing?: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, url: string) => void;
}

const Card: React.FC<CardProps> = ({
  id,
  index,
  title,
  url,
  color,
  isEditing: initialIsEditing = false,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(initialIsEditing);
  const [editTitle, setEditTitle] = useState(title);
  const [editUrl, setEditUrl] = useState(url);

  useEffect(() => {
    setIsEditing(initialIsEditing);
  }, [initialIsEditing]);

  useEffect(() => {
    setEditTitle(title);
    setEditUrl(url);
  }, [title, url]);

  const handleSubmit = () => {
    const trimmedTitle = editTitle.trim();
    let trimmedUrl = editUrl.trim();
    
    if (!trimmedTitle) {
      toast.error('Title cannot be empty');
      return;
    }

    if (!trimmedUrl) {
      toast.error('URL cannot be empty');
      return;
    }

    // Add https:// if no protocol is specified
    if (!/^https?:\/\//i.test(trimmedUrl)) {
      trimmedUrl = 'https://' + trimmedUrl;
    }

    try {
      new URL(trimmedUrl); // Validate URL
      onEdit(id, trimmedTitle, trimmedUrl);
      setIsEditing(false);
    } catch (e) {
      toast.error('Please enter a valid URL');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-dark-card rounded-lg shadow p-4 mb-3 hover:shadow-lg transition-all ${
            snapshot.isDragging ? 'rotate-[2deg] shadow-xl' : ''
          }`}
        >
          <div className={`w-full h-1 rounded-full mb-3 transition-colors duration-200`} style={{ backgroundColor: color }} />
          
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 border rounded bg-dark-column border-dark-border text-dark-text"
                placeholder="Title"
                autoFocus
              />
              <input
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 border rounded bg-dark-column border-dark-border text-dark-text"
                placeholder="URL (e.g., google.com)"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    if (title === 'New Bookmark' && url === 'https://example.com') {
                      onDelete(id);
                    } else {
                      setIsEditing(false);
                      setEditTitle(title);
                      setEditUrl(url);
                    }
                  }}
                  className="px-3 py-1.5 text-dark-text hover:text-dark-text transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-1.5 bg-gradient-button text-dark-text font-semibold rounded hover:opacity-90 transition-opacity"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <img 
                      src={getFaviconUrl(url)} 
                      alt=""
                      className="w-4 h-4 object-contain flex-shrink-0"
                      onError={(e) => {
                        // Fallback to default icon if favicon fails to load
                        e.currentTarget.src = 'src/assets/favicon-32x32.png';
                      }}
                    />
                    <h3 className="text-lg font-bold text-dark-text truncate">{title}</h3>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-dark-muted hover:text-blue-400 truncate block"
                  >
                    {url}
                  </a>
                </div>
                <div className="flex gap-2 items-start flex-shrink-0">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 text-dark-muted hover:text-dark-text transition-colors"
                    aria-label="Edit bookmark"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.474 5.408l2.118 2.117m-.756-3.982L12.109 9.27a2.118 2.118 0 00-.58 1.082L11 13l2.648-.53c.41-.082.786-.283 1.082-.579l5.727-5.727a1.853 1.853 0 10-2.621-2.621z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 15v3a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(id)}
                    className="p-1.5 text-dark-muted hover:text-red-400 transition-colors"
                    aria-label="Delete bookmark"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Card; 