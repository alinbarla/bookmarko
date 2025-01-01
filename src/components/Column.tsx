import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Card from './Card';
import ColorPicker from './ColorPicker';
import { toast } from 'react-hot-toast';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  color: string;
}

interface ColumnProps {
  id: string;
  index: number;
  title: string;
  color: string;
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
  onTitleChange: (id: string, newTitle: string) => void;
  onColorChange: (id: string, newColor: string) => void;
}

const Column: React.FC<ColumnProps> = ({
  id,
  index,
  title,
  color,
  bookmarks,
  onDelete,
  onTitleChange,
  onColorChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [newBookmarkId, setNewBookmarkId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (editTitle.trim()) {
      onTitleChange(id, editTitle);
      setIsEditing(false);
      toast.success('Column title updated!');
    }
  };

  const handleAddBookmark = () => {
    chrome.bookmarks.create({
      parentId: id,
      title: 'New Bookmark',
      url: 'https://example.com',
    }, (result) => {
      if (chrome.runtime.lastError) {
        toast.error('Failed to add bookmark: ' + chrome.runtime.lastError.message);
        return;
      }
      if (result) {
        setNewBookmarkId(result.id);
        toast.success('New bookmark added! Please edit the details.');
      }
    });
  };

  const handleDeleteBookmark = (bookmarkId: string) => {
    chrome.bookmarks.remove(bookmarkId, () => {
      setNewBookmarkId(null);
      toast.success('Bookmark deleted!');
    });
  };

  const handleEditBookmark = (bookmarkId: string, newTitle: string, newUrl: string) => {
    chrome.bookmarks.update(bookmarkId, {
      title: newTitle,
      url: newUrl,
    }, () => {
      if (bookmarkId === newBookmarkId) {
        setNewBookmarkId(null);
      }
      toast.success('Bookmark updated!');
    });
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="w-80 flex-shrink-0 bg-dark-column rounded-xl shadow-lg overflow-hidden"
        >
          <div
            {...provided.dragHandleProps}
            className="p-4 border-b border-dark-border"
            style={{ backgroundColor: color }}
          >
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded bg-dark-card border-dark-border text-dark-text"
                  placeholder="Column Title"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-dark-primary hover:opacity-80 transition-colors"
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
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-dark-primary truncate pr-2">
                  {title}
                </h2>
                <div className="flex gap-2">
                  <ColorPicker
                    value={color}
                    onChange={(newColor) => onColorChange(id, newColor)}
                  />
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 text-dark-primary hover:opacity-80 transition-colors"
                    aria-label="Edit column title"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.474 5.408l2.118 2.117m-.756-3.982L12.109 9.27a2.118 2.118 0 00-.58 1.082L11 13l2.648-.53c.41-.082.786-.283 1.082-.579l5.727-5.727a1.853 1.853 0 10-2.621-2.621z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 15v3a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(id)}
                    className="p-1.5 text-dark-primary hover:text-red-400 transition-colors"
                    aria-label="Delete column"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          <Droppable droppableId={id} type="bookmark">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="p-4 min-h-[200px]"
              >
                <div className="space-y-3">
                  {bookmarks.map((bookmark, index) => (
                    <Card
                      key={bookmark.id}
                      id={bookmark.id}
                      index={index}
                      title={bookmark.title}
                      url={bookmark.url}
                      color={color}
                      onDelete={handleDeleteBookmark}
                      onEdit={handleEditBookmark}
                      isEditing={bookmark.id === newBookmarkId}
                    />
                  ))}
                  {provided.placeholder}
                </div>
                <button
                  onClick={handleAddBookmark}
                  className="w-full p-4 mt-3 border-2 border-dashed border-dark-border rounded-lg text-dark-muted hover:text-dark-text hover:border-dark-muted transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z" fill="currentColor"/>
                  </svg>
                  Add Bookmark
                </button>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column; 