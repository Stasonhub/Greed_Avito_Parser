chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	//tab.window.console.log(chrome.pageAction)
	if (!tab.isShowAction){
	tab.isShowAction = true
		chrome.pageAction.show(tab.id);
		chrome.pageAction.onClicked.addListener(function(){
			for (var k in tab) {
				alert(k +'['+ typeof(tab[k])+']')
			}
		})
	}
});