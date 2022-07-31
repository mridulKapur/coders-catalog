let lists;

const removeProblem = (name,problem_link) => {
	lists.forEach(e => {	
    if (e.name === name) {
      e.problems = e.problems.filter(el => {  return el.url != problem_link })
		}
	});
	chrome.storage.sync.set({ ["userLists"]: JSON.stringify(lists) })
}

const removeList = (name) => {
  lists = lists.filter(e => { console.log(e.name,name);return e.name != name })
  chrome.storage.sync.set({ ["userLists"]: JSON.stringify(lists) })
}

const showProblems = (listItemInfo) => {
  const problems_containers = document.getElementsByClassName("problems")[0]
  problems_containers.innerHTML = `<div class="problem_item"><div class="problem_sno">sno</div>
  <div class="problem_name">name</div>
  <div class="problem_site">site</div></div>`;
  listItemInfo.problems.forEach((e,key) => {
    const problem_element = document.createElement("div");
    problem_element.className = "problem_item"
    problem_element.innerHTML =
      `<div class="problem_sno">${key}</div>
       <a href="${e.url}" target="_blank" class="problem_name">${e.name}</a>
       <div class="problem_site">${e.site}</div>`;
    const deleteBtn = document.createElement("div");
    deleteBtn.addEventListener("click", (ev) => { removeProblem(listItemInfo.name, e.url);problem_element.remove() });
    deleteBtn.class = "delete_btn"
    deleteBtn.innerHTML = "<span>X</span>";
    problem_element.appendChild(deleteBtn);
    problems_containers.appendChild(problem_element);
  })
}

const createListItem = (listItemInfo) => {
  const listItem = document.createElement("div");
  listItem.className = "list-item";
  listItem.addEventListener("click", (e) => {
    showProblems(listItemInfo);
  })
  listItem.innerHTML = listItemInfo.name;
  const removeBtn = document.createElement("div");
  removeBtn.addEventListener("click", e => { removeList(listItemInfo.name); listItem.remove(); });
  removeBtn.innerHTML = "X";
  listItem.appendChild(removeBtn);
  return listItem;
}

const viewLists = () => {
  let parentElement = document.getElementsByClassName("list")[0];
  lists.forEach(element => {
    const cr = createListItem(element)
    parentElement.appendChild(cr);
  });
  return;
};

document.addEventListener("DOMContentLoaded", async () => {
  chrome.storage.sync.get(["userLists"], (data) => {
    lists = data["userLists"] ? JSON.parse(data["userLists"]) : [];
    viewLists();
  });
});

