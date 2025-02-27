/* eslint-disable no-undef */
let popupWindowId = null;
const popupWidth = 473; // Fixed width
const popupHeight = 600; // Fixed height

//listens for clicks on extension and checks whether popup is already open 
//via popupWindowId, focuses existing popup if not it opens a new one
chrome.action.onClicked.addListener(() => {
  if (popupWindowId) {
    chrome.windows.get(popupWindowId, (win) => {
      if (win) {
        chrome.windows.update(popupWindowId, { focused: true });
      } else {
        openPopup();
      }
    });
  } else {
    openPopup();
  }
});


//This cleared the message: service worker in active
chrome.runtime.onStartup.addListener(() => {
  console.log(`onStartup()`);
});
//kept on getting error about the length
//Ensure that tab/window user is trying to interact with exists 

/*chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    if (tabs.length > 0) {
        //performs actions with tab
    } else {
        console.log("no active tab found");
    }
});*/


//responsible for opening a new popup window

function openPopup() {
  chrome.windows.create(
    {
      url: "popup.html",
      type: "popup",
      width: popupWidth,
      height: popupHeight,
    },
    (window) => {
      popupWindowId = window.id;

      // Listen for window resizing
      chrome.windows.onBoundsChanged.addListener((changedWindow) => {
        if (changedWindow.id === popupWindowId) {
          // Check if the width has changed
          if (
            changedWindow.width !== popupWidth ||
            changedWindow.height !== popupHeight
          ) {
            // Reset the window size
            chrome.windows.update(popupWindowId, {
              width: popupWidth,
              height: popupHeight,
            });
          }
        }
      });
    }
  );
}
