let activeTab = {}

//All duration is stored in seconds
let sitesVisitedToday = {}

const now = new Date()

const dailyLog = {
    date: now.toDateString(),
    sitesVisitedToday
}

const end = () => {
    const {name} = activeTab 
    const now = new Date()

    if(dailyLog.date !== now.toDateString()) {
        dailyLog.date = now.toDateString
        sitesVisitedToday = {}
    }

    if (name) {
      const timeDiff = ((now.getTime() - activeTab.time || 0) / 1000) / 60;
      console.log("DEBUG SHIT", {
        now,
        activeTab,
        timeDiff
    })

      if(sitesVisitedToday[name]) {
        sitesVisitedToday[name] += timeDiff
      } else {
        sitesVisitedToday[name] = timeDiff
      }

      chrome.storage.sync.set({
          sitesVisitedToday: sitesVisitedToday,
          dailyLog: dailyLog
      })
      activeTab = {};
    }
}

const getActiveTab = () => {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true}, activeTabs => {
            resolve(activeTabs[0])
        })
    })
}

const setActiveTab = async () => {
    const curr = await getActiveTab()
    if (curr) {
        const { url } = curr;
        let host = new URL(url).hostname;
        host = host.replace('www.', '')

        if (activeTab.name !== host) {
            end();
            activeTab = {
              name: host,
              time: Date.now()
            };
            // console.log(sitesVisitedToday);
        }
    }
}

chrome.runtime.onInstalled.addListener(function () {
    setActiveTab()
})

chrome.tabs.onActivated.addListener(() => {
    // query the active tab
    setActiveTab()
});

chrome.windows.onFocusChanged.addListener(window => {
    window === -1 ? end() : setActiveTab()
});
