chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (tab.url && tab.url.includes("leetcode.com/problems/")) {
		const problem_name = tab.url.split("/")[4];
		chrome.tabs
			.sendMessage(tabId, {
				type: "site_name",
				site: "leetcode",
				problem_url: tab.url,
			})
			.then(() => console.log("connection established"))
			.catch(() => console.log("retrying..."));
	} else if (tab.url && tab.url.includes("codeforces.com/problemset/problem")) {
		chrome.tabs
			.sendMessage(tabId, {
				type: "site_name",
				site: "codeforces",
				problem_url: tab.url,
			})
			.then(() => console.log("connection established"))
			.catch(() => console.log("retrying..."));
	} else if (
		tab.url &&
		(tab.url.includes("codechef.com/problems-old") || tab.url.includes("codechef.com/submit/"))
	) {
		chrome.tabs
			.sendMessage(tabId, {
				type: "site_name",
				site: "codechef",
				problem_url: tab.url,
			})
			.then(() => console.log("connection established"))
			.catch(() => console.log("retrying..."));
	}
});
