chrome.runtime.onInstalled.addListener(() => {
  console.log('Bookmark Manager Extension installed');
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_BOOKMARKS') {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      sendResponse({ bookmarks: bookmarkTreeNodes });
    });
    return true; // Will respond asynchronously
  }

  if (request.type === 'CREATE_BOOKMARK') {
    chrome.bookmarks.create({
      parentId: request.parentId,
      title: request.title,
      url: request.url
    }, (newBookmark) => {
      sendResponse({ success: true, bookmark: newBookmark });
    });
    return true;
  }

  if (request.type === 'UPDATE_BOOKMARK') {
    chrome.bookmarks.update(request.id, {
      title: request.title,
      url: request.url
    }, (updatedBookmark) => {
      sendResponse({ success: true, bookmark: updatedBookmark });
    });
    return true;
  }

  if (request.type === 'DELETE_BOOKMARK') {
    chrome.bookmarks.remove(request.id, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.type === 'MOVE_BOOKMARK') {
    chrome.bookmarks.move(request.id, {
      parentId: request.newParentId,
      index: request.index
    }, (movedBookmark) => {
      sendResponse({ success: true, bookmark: movedBookmark });
    });
    return true;
  }
}); 