import { DropResult } from 'react-beautiful-dnd';

interface Column {
  id: string;
  title: string;
  color: string;
  bookmarkIds: string[];
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
  color: string;
}

export const reorderColumns = (
  columns: Column[],
  startIndex: number,
  endIndex: number
): Column[] => {
  const result = Array.from(columns);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const reorderBookmarksWithinColumn = (
  bookmarks: Bookmark[],
  startIndex: number,
  endIndex: number
): Bookmark[] => {
  const result = Array.from(bookmarks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const moveBookmarkBetweenColumns = (
  sourceBookmarks: Bookmark[],
  destinationBookmarks: Bookmark[],
  source: {
    index: number;
  },
  destination: {
    index: number;
  }
): {
  sourceBookmarks: Bookmark[];
  destinationBookmarks: Bookmark[];
} => {
  const sourceClone = Array.from(sourceBookmarks);
  const destClone = Array.from(destinationBookmarks);
  const [removed] = sourceClone.splice(source.index, 1);

  destClone.splice(destination.index, 0, removed);

  return {
    sourceBookmarks: sourceClone,
    destinationBookmarks: destClone,
  };
};

export const handleDragEnd = (
  result: DropResult,
  columns: Column[],
  bookmarks: { [key: string]: Bookmark },
  setColumns: (columns: Column[]) => void
): void => {
  if (!result.destination) return;

  const { source, destination, type } = result;

  if (type === 'column') {
    const reorderedColumns = reorderColumns(
      columns,
      source.index,
      destination.index
    );
    setColumns(reorderedColumns);
    return;
  }

  const sourceColumn = columns.find(col => col.id === source.droppableId);
  const destColumn = columns.find(col => col.id === destination.droppableId);

  if (!sourceColumn || !destColumn) return;

  if (source.droppableId === destination.droppableId) {
    const newBookmarkIds = reorderBookmarksWithinColumn(
      sourceColumn.bookmarkIds.map(id => bookmarks[id]),
      source.index,
      destination.index
    ).map(bookmark => bookmark.id);

    const newColumns = columns.map(col =>
      col.id === sourceColumn.id
        ? { ...col, bookmarkIds: newBookmarkIds }
        : col
    );

    setColumns(newColumns);
  } else {
    const sourceBookmarkIds = sourceColumn.bookmarkIds;
    const destBookmarkIds = destColumn.bookmarkIds;

    const { sourceBookmarks: sourceIds, destinationBookmarks: destIds } =
      moveBookmarkBetweenColumns(
        sourceBookmarkIds.map(id => bookmarks[id]),
        destBookmarkIds.map(id => bookmarks[id]),
        source,
        destination
      );

    const newColumns = columns.map(col => {
      if (col.id === sourceColumn.id) {
        return { ...col, bookmarkIds: sourceIds.map(b => b.id) };
      }
      if (col.id === destColumn.id) {
        return { ...col, bookmarkIds: destIds.map(b => b.id) };
      }
      return col;
    });

    setColumns(newColumns);
  }
}; 