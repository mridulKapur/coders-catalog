const storage ={
  lists:{
    list_name_1: [{name:"q1",link:"l1"},{name:"q2",link:"l2"},{name:"q3",link:"l3"}],
    list_name_2: [{ name: "q1", link: "l1" }, { name: "q12", link: "l12" }, { name: "q13", link: "l13" }],
    list_name_3: [],
  }
}
console.log(JSON.stringify(storage));

console.log(storage.lists.list_name_1);