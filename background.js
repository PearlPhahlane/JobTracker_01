let popupWindowId = null;

//listens for clicks on extension and checks whether popup is already open 
//via popupWindowId, focuses existing popup if not it opens a new one
chrome.action.onClicked.addListner(() => {
    if (popupWindowId) {
        chrome.windows.get(popupWindowId, (win) => {
            if (win) {
                Chrome.windows.update(popupWindowId, { focused: true});
            } else {
                openPopup();
            }
        });
    } else {
        openPopup();
    }
});

//Ensure that tab/window user is trying to interact with exists 

chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    if (tabs.length > 0) {
        //performs actions with tab
    } else {
        console.log("no active tab found");
    }
});


//responsible for opening a new popup window

function openPopup() {
    chrome.windows.create(
        {
            url: "popup.html",
            type: "popup",
            width: 400,
            height: 600,
        },
        (window) => {
            popupWindowId = window.id;
        }

    );
}