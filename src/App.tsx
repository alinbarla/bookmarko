import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { toast } from 'react-hot-toast';
import Column from './components/Column';
import SearchBar from './components/SearchBar';
import Notification from './components/Notification';
import { handleDragEnd } from './utils/dragDropHelpers';
import { getRandomColor } from './utils/colors';
import './App.css';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  color: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  bookmarkIds: string[];
}

const App: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [bookmarks, setBookmarks] = useState<{ [key: string]: Bookmark }>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load bookmarks directly from Chrome API
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      const bookmarkBar = bookmarkTreeNodes[0].children?.find(
        node => node.id === '1' // '1' is the ID of the bookmark bar
      );
      
      if (bookmarkBar && bookmarkBar.children) {
        processBookmarkTree(bookmarkBar);
      }
    });

    // Add listener for bookmark changes
    chrome.bookmarks.onCreated.addListener(handleBookmarkCreated);
    chrome.bookmarks.onRemoved.addListener(handleBookmarkRemoved);
    chrome.bookmarks.onChanged.addListener(handleBookmarkChanged);
    chrome.bookmarks.onMoved.addListener(handleBookmarkMoved);

    return () => {
      chrome.bookmarks.onCreated.removeListener(handleBookmarkCreated);
      chrome.bookmarks.onRemoved.removeListener(handleBookmarkRemoved);
      chrome.bookmarks.onChanged.removeListener(handleBookmarkChanged);
      chrome.bookmarks.onMoved.removeListener(handleBookmarkMoved);
    };
  }, []);

  const handleBookmarkCreated = (id: string, bookmark: chrome.bookmarks.BookmarkTreeNode) => {
    if (bookmark.url) {
      // New bookmark
      const newBookmark: Bookmark = {
        id: bookmark.id,
        title: bookmark.title,
        url: bookmark.url,
        color: getRandomColor(),
      };
      setBookmarks(prev => ({ ...prev, [id]: newBookmark }));

      // Add to column
      if (bookmark.parentId) {
        setColumns(prev =>
          prev.map(col =>
            col.id === bookmark.parentId
              ? { ...col, bookmarkIds: [...col.bookmarkIds, id] }
              : col
          )
        );
      }
    } else {
      // New folder/column
      const newColumn: Column = {
        id: bookmark.id,
        title: bookmark.title,
        color: getRandomColor(),
        bookmarkIds: [],
      };
      setColumns(prev => [...prev, newColumn]);
    }
  };

  const handleBookmarkRemoved = (id: string, removeInfo: chrome.bookmarks.BookmarkRemoveInfo) => {
    if (removeInfo.node.url) {
      // Remove bookmark
      setBookmarks(prev => {
        const newBookmarks = { ...prev };
        delete newBookmarks[id];
        return newBookmarks;
      });

      // Remove from column
      setColumns(prev =>
        prev.map(col => ({
          ...col,
          bookmarkIds: col.bookmarkIds.filter(bookmarkId => bookmarkId !== id),
        }))
      );
    } else {
      // Remove column
      setColumns(prev => prev.filter(col => col.id !== id));
    }
  };

  const handleBookmarkChanged = (id: string, changeInfo: chrome.bookmarks.BookmarkChangeInfo) => {
    if (changeInfo.url) {
      // Update bookmark
      setBookmarks(prev => {
        const bookmark = prev[id];
        if (!bookmark || !changeInfo.url) return prev;
        
        return {
          ...prev,
          [id]: {
            ...bookmark,
            title: changeInfo.title || bookmark.title,
            url: changeInfo.url,
          },
        };
      });
    } else {
      // Update column title
      setColumns(prev =>
        prev.map(col =>
          col.id === id ? { ...col, title: changeInfo.title } : col
        )
      );
    }
  };

  const handleBookmarkMoved = (id: string, moveInfo: chrome.bookmarks.BookmarkMoveInfo) => {
    const { oldParentId, parentId } = moveInfo;

    setColumns(prev =>
      prev.map(col => {
        if (col.id === oldParentId) {
          return {
            ...col,
            bookmarkIds: col.bookmarkIds.filter(bookmarkId => bookmarkId !== id),
          };
        }
        if (col.id === parentId) {
          return {
            ...col,
            bookmarkIds: [...col.bookmarkIds, id],
          };
        }
        return col;
      })
    );
  };

  const processBookmarkTree = (node: chrome.bookmarks.BookmarkTreeNode) => {
    const newBookmarks: { [key: string]: Bookmark } = {};
    const newColumns: Column[] = [];

    const processNode = (node: chrome.bookmarks.BookmarkTreeNode) => {
      if (!node.url && node.children) {
        // This is a folder/column
        const columnId = node.id;
        const bookmarkIds: string[] = [];

        node.children.forEach((child) => {
          if (child.url) {
            // This is a bookmark
            const bookmark: Bookmark = {
              id: child.id,
              title: child.title,
              url: child.url,
              color: getRandomColor(),
            };
            newBookmarks[child.id] = bookmark;
            bookmarkIds.push(child.id);
          }
        });

        newColumns.push({
          id: columnId,
          title: node.title,
          color: getRandomColor(),
          bookmarkIds,
        });
      }
    };

    node.children?.forEach(processNode);
    setBookmarks(newBookmarks);
    setColumns(newColumns);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const addColumn = () => {
    chrome.bookmarks.create({
      title: 'New Column',
      parentId: '1',
    }, (newFolder) => {
      if (newFolder) {
        const newColumn: Column = {
          id: newFolder.id,
          title: newFolder.title,
          color: getRandomColor(),
          bookmarkIds: [],
        };
        setColumns([...columns, newColumn]);
        toast.success('New column added!');
      }
    });
  };

  return (
    <div className="min-h-screen w-full bg-dark-primary text-dark-text">
      <div className="fixed top-0 left-0 right-0 w-full bg-dark-header border-b border-dark-border z-50">
        <div className="w-full px-6">
          <div className="py-4">
            <div className="flex justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <img src="/icon.png" alt="Bookmarko" className="w-10 h-10" />
                <h1 className="text-3xl font-bold bg-gradient-brand text-transparent bg-clip-text">
                  Bookmarko
                </h1>
              </div>
              
              <div className="flex-1 max-w-2xl relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-dark-muted">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <SearchBar onSearch={handleSearch} />
              </div>

              <button
                onClick={addColumn}
                className="px-6 py-3 bg-gradient-button text-dark-text font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md flex items-center gap-2 whitespace-nowrap"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z" fill="currentColor"/>
                </svg>
                New Collection
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="w-full pt-24 pb-6 min-h-screen overflow-y-auto scrollbar-custom">
        <div className="w-full h-full px-6">
          <DragDropContext
            onDragEnd={(result) =>
              handleDragEnd(result, columns, bookmarks, setColumns)
            }
          >
            <Droppable droppableId="columns" direction="horizontal" type="column">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex overflow-x-auto gap-6 pb-6 scrollbar-custom"
                >
                  {columns.map((column, index) => (
                    <Column
                      key={column.id}
                      id={column.id}
                      index={index}
                      title={column.title}
                      color={column.color}
                      bookmarks={column.bookmarkIds
                        .map((id) => bookmarks[id])
                        .filter(Boolean)
                        .filter((bookmark) =>
                          !searchQuery ||
                          bookmark.title.toLowerCase().includes(searchQuery) ||
                          bookmark.url.toLowerCase().includes(searchQuery)
                        )}
                      onDelete={(id) => {
                        chrome.bookmarks.removeTree(id, () => {
                          setColumns(columns.filter((col) => col.id !== id));
                          toast.success('Column deleted!');
                        });
                      }}
                      onTitleChange={(id, newTitle) => {
                        chrome.bookmarks.update(id, { title: newTitle }, () => {
                          setColumns(
                            columns.map((col) =>
                              col.id === id ? { ...col, title: newTitle } : col
                            )
                          );
                        });
                      }}
                      onColorChange={(id, newColor) => {
                        setColumns(
                          columns.map((col) =>
                            col.id === id ? { ...col, color: newColor } : col
                          )
                        );
                      }}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </main>
      <Notification />
    </div>
  );
};

export default App;
