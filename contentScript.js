let problem_link = "unknown";
let problem_name = "unknown";
let site_name = "unknown";
let lists;

const addListItemToDOM = (listItemInfo) =>{
	const listItem = document.createElement("div");
	listItem.className = "extension_list_item";
	listItem.innerHTML =
		`<div class="extension_name" >${listItemInfo.name}</div>
			<div class="extension_toggle">
				<input id="extension_checkbox_${listItemInfo.name}" type="checkbox" class="extension_isCheck"/>
				<label class="extension_toggle-item" for="extension_checkbox_${listItemInfo.name}"></label>
		</div>`
	document.getElementById('extension_lists_names').appendChild(listItem);
	const chkBx = listItem.getElementsByClassName("extension_isCheck")[0]
	chkBx.addEventListener("click", (e) => { handleCheck(e, listItemInfo.name) })
	listItemInfo.problems.forEach(e => {
		if (e.url === problem_link) chkBx.checked = true;
	})
}

const fetchLists = () => {
	return new Promise((resolve) => {
		chrome.storage.sync.get(["userLists"], (obj) => {
			console.log(obj);
			resolve(obj["userLists"] ? JSON.parse(obj["userLists"]) : []);
		});
	});
};

function addItemToList(){
	const newListItem = {
		name: document.getElementById("extension_new_list_input").value,
		problems:[]
	}
	lists.push(newListItem);
	addListItemToDOM(newListItem);
	chrome.storage.sync.set({ ["userLists"]: JSON.stringify(lists) });
}

const addLists = async () => {
	await fetchLists().then((list) => {
		lists = list
	})
	lists.forEach(e => {
		addListItemToDOM(e)
	});
}

const addProblem = (name) => {
	const new_problem = {
		name: problem_name,
		url: problem_link,
		site: site_name,
	}
	console.log(new_problem)
	lists.forEach(e => {	
		if (e.name === name) {
			e.problems = [...e.problems, new_problem]
		}
	});
	console.log(lists);
	chrome.storage.sync.set({ ["userLists"]: JSON.stringify(lists) })
}

const removeProblem = (name) => {
	lists.forEach(e => {	
		if (e.name === name) {
			e.problems = e.problems.filter(el => {return el.url != problem_link })
		}
	});
	chrome.storage.sync.set({ ["userLists"]: JSON.stringify(lists) })
}

const handleCheck = (e, name) => { 
	if (e.target.checked === true) {
		addProblem(name);
	}
	else {
		removeProblem(name);
	}
}

const createBtn = () => {
	let bookmarkBtn = document.createElement("div");
	bookmarkBtn.innerHTML = `<details id="extension_details">
		<summary id="extension_summary">add this problem</summary>
		<div class="extension_ddContainer">
			<div class="extension_list" id="extension_lists_names">
			</div>
			<div class="extension_newList">
				<div class="extension_newList">
					<label for="extension_new_list_input" id="extension_new_list_name">name</label>
					<input type="text"  id="extension_new_list_input" placeholder="add new list" name="newListItem"></input>
					<div class="extension_new_list_btn" onclick="()=>{addItemToList()}">+</div>
				</div>
			</div>
		</div>
	</details>`;
	bookmarkBtn.id = "ctlg-btn"
	bookmarkBtn.getElementsByClassName("extension_new_list_btn")[0].addEventListener("click", (e) => { e.preventDefault(); addItemToList(); })
	return bookmarkBtn;
}

const initLC = () => {
	const poll = setInterval(() => {
		if (document.getElementsByClassName("container__2WTi")[0]) {
			loadBtn();
		}
	}, 3000);
	const loadBtn = () => {
		div = document.getElementsByClassName("container__2WTi")[0];
		if (div) {
			const bookmarkBtn = createBtn();
			bookmarkBtn.style.width = "8rem";
			clearInterval(poll);
			if (document.getElementById("ctlg-btn") === null) {
				div.appendChild(bookmarkBtn);
				addLists();
			} 
		} else {
			return;
		}
	};
	problem_name = document.getElementsByClassName("css-v3d350")[0].childNodes[2].data;
	console.log(problem_name);
};

const initCF = () => {
	problem_name = document.getElementsByClassName("title")[0].innerHTML.substring(3)
	const loadBtn = () => {
		div = document.getElementsByClassName("submitForm")[0];
		const bookmarkBtn = createBtn();
		bookmarkBtn.style.fontSize = "10px";
		bookmarkBtn.style.width = "12rem";
		bookmarkBtn.style.marginBottom = "10px";
		if (document.getElementById("ctlg-btn") === null) { div.appendChild(bookmarkBtn); addLists(); };
	};
	loadBtn();
};

const initCCnew = () => {
	problem_name = document.getElementsByClassName("TopBanner_problem__title__1nmUR")[0]?.children[0].innerHTML
	const loadBtn = () => {
		document.getElementsByClassName("IDEExecute_execute-btn-container__1BGZN")[0].style.width ="460px";
		div = document.getElementsByClassName("IDEExecute_submit__btn__1-QBY")[0];
		const bookmarkBtn = createBtn()
		bookmarkBtn.style.marginLeft = "6px";
		bookmarkBtn.style.fontSize = "10px";
		bookmarkBtn.style.width = "8rem";
		if (document.getElementById("ctlg-btn") === null) { div.insertAdjacentElement("afterend", bookmarkBtn); addLists(); }
	};
	loadBtn();
};

const initCCold = () => {
	problem_name = document
		.getElementsByClassName("large-12 columns")[0]
		?.children[0].textContent.split("\n")[1]
		.trimStart();
	const loadBtn = () => {
		div = document.getElementsByClassName("button blue right")[0];
		const bookmarkBtn = createBtn();
		bookmarkBtn.className = "specialCCO"
		bookmarkBtn.style.fontSize = "10px";
		bookmarkBtn.style.width = "8rem";
		bookmarkBtn.style.margin = "10px";
		bookmarkBtn.children[0].children[1].style.top = "0"
		if (document.getElementById("ctlg-btn") === null) {
			div.insertAdjacentElement("beforebegin", bookmarkBtn);addLists();
		}
	};
	loadBtn();
};


const init = async () => {
	chrome.runtime.onMessage.addListener((obj, seder, respone) => {
		const { type, site, problem_url } = obj;
		site_name = site;
		if (site === "leetcode") {
			problem_link = problem_url;
			initLC();
		} else if (site === "codeforces") {
			problem_link = problem_url;
			initCF();
		} else if (site == "codechef") {
			problem_link = problem_url;
			if (problem_link.includes("codechef.com/problems-old")) initCCold();
			else initCCnew();
		}
	});
};

init();
