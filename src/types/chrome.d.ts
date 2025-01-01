declare namespace chrome {
  namespace bookmarks {
    interface BookmarkTreeNode {
      id: string;
      parentId?: string;
      index?: number;
      url?: string;
      title: string;
      dateAdded?: number;
      dateGroupModified?: number;
      unmodifiable?: string;
      children?: BookmarkTreeNode[];
    }

    function getTree(callback: (bookmarkTreeNodes: BookmarkTreeNode[]) => void): void;
    function create(bookmark: { parentId?: string; index?: number; title?: string; url?: string }, callback?: (result: BookmarkTreeNode) => void): void;
    function remove(id: string, callback?: () => void): void;
    function removeTree(id: string, callback?: () => void): void;
    function update(id: string, changes: { title?: string; url?: string }, callback?: (result: BookmarkTreeNode) => void): void;
    function move(id: string, destination: { parentId?: string; index?: number }, callback?: (result: BookmarkTreeNode) => void): void;
  }

  namespace runtime {
    interface MessageSender {
      tab?: chrome.tabs.Tab;
      frameId?: number;
      id?: string;
      url?: string;
      tlsChannelId?: string;
    }

    interface RuntimeResponse {
      bookmarks?: chrome.bookmarks.BookmarkTreeNode[];
      success?: boolean;
      bookmark?: chrome.bookmarks.BookmarkTreeNode;
    }

    function sendMessage<T = any>(
      message: T,
      responseCallback?: (response: RuntimeResponse) => void
    ): void;

    const onMessage: {
      addListener(
        callback: (
          message: any,
          sender: MessageSender,
          sendResponse: (response?: any) => void
        ) => void | boolean
      ): void;
    };

    const onInstalled: {
      addListener(callback: () => void): void;
    };
  }

  namespace tabs {
    interface Tab {
      id?: number;
      index: number;
      windowId: number;
      highlighted: boolean;
      active: boolean;
      pinned: boolean;
      url?: string;
      title?: string;
      favIconUrl?: string;
      status?: string;
      incognito: boolean;
      width?: number;
      height?: number;
      sessionId?: string;
    }
  }
} 