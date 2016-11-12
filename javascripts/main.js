"use strict";

// let taskInput;


// function addTask() {
// 	taskInput = $("#task-input").val();
// 	if (taskInput !== "") {
// 		var newElement = $(`<div class="panel-body tasks">
// 		     <div class="col-md-8 task-item">${taskInput}</div>
// 		     <div><input type=text class="col-md-8 text-edit">
// 		     <div class="col-md-4"><button class="btn btn-primary btn-xs edit">Edit</button><button class="btn btn-primary btn-xs complete">Complete</button><button class="btn btn-primary btn-xs delete">Delete</button><button class="btn btn-primary btn-xs todo">To Do</button></div>`);

// 		$("#todo-list").append(newElement);

// 		newElement.find(".edit").click(function(){
// 			newElement.find(".task-item").hide();
// 			newElement.find(".text-edit").val(newElement.find(".task-item").html()).show();
// 			$(".text-edit").focus();

// 			newElement.find(".text-edit").keypress((e)=> {
// 				if(e.which == 13) {
// 					newElement.find(".task-item").html($(".text-edit").val()).show();
// 					newElement.find(".text-edit").hide();

// 				  	console.log("enter in edit");
// 				}
// 			});

// 			console.log("text", newElement);
// 			console.log("edit-button");
// 			console.log("taskInput", newElement);
// 		});

// 		newElement.find(".complete").click(function(){
// 			$("#complete-list").append(newElement);
// 			newElement.find(".complete").hide();
// 			newElement.find(".edit").hide();
// 			newElement.find(".todo").show();

// 			console.log("complete-button");
// 			console.log("taskInput", newElement);
// 		});

// 		newElement.find(".delete").click(function(){
// 			newElement.remove();
// 			console.log("delete-button");
// 			console.log("taskInput", newElement);
// 		});

// 		newElement.find(".todo").click(function(){
// 			$("#todo-list").append(newElement);
// 			newElement.find(".todo").hide();
// 			newElement.find(".complete").show();
// 			newElement.find(".edit").show();
// 		});
// 	}	
// 	$("#task-input").val("");
// }





// $("#create-button").click(()=>{
// 	addTask();
// 	// console.log("create-button");
// 	// console.log("taskInput", taskInput);
// });

// $(document).keypress(function(e) {
//   if(e.which == 13) {
//   	addTask();
//   }
// });


let apiKeys = {};
let uid = "";

function putTodoInDom(){
	FbAPI.getTodos(apiKeys, uid).then(function(items){
		console.log("items from FB", items);
		$("#completed-tasks").html("");
		$("#incomplete-tasks").html("");
		items.forEach(function(item){
			if (item.isCompleted === true) {
				let newListItem = `<li data-completed="${item.isCompleted}">`;
			    newListItem+=`<div class="col-xs-8" data-fbid="${item.id}">`;
			    newListItem+='<input class="checkboxStyle" type="checkbox" checked>';
			    newListItem+=`<label class="inputLabel">${item.task}</label>`;
			    newListItem+='</div>';
			    newListItem+='</li>';
			      //apend to list
			    $('#completed-tasks').append(newListItem);
			} else {
				let newListItem = `<li data-completed="${item.isCompleted}">`;
			    newListItem+=`<div class="col-xs-8" data-fbid="${item.id}">`;
			    newListItem+='<input class="checkboxStyle" type="checkbox">';
			    newListItem+=`<label class="inputLabel">${item.task}</label>`;
			    newListItem+='<input type="text" class="inputTask">';
			    newListItem+='</div>';
			    newListItem+='<div class="col-xs-4">';
			    newListItem+=`<button class="btn btn-default col-xs-6 edit" data-fbid="${item.id}">Edit</button>`;
			    newListItem+=`<button class="btn btn-danger col-xs-6 delete" data-fbid="${item.id}">Delete</button> `;
			    newListItem+='</div>';
			    newListItem+='</li>';
			      //apend to list
			    $('#incomplete-tasks').append(newListItem);
				}
		});
	});
}

function createLogoutButton(){
	FbAPI.getUser(apiKeys, uid).then(function(userResponse){
		$("#logout-container").html("");
		let currentUsername = userResponse.username;
		let logoutButton = `<button class="btn btn-danger" id="logoutButton">LOGOUT ${currentUsername}</button>`;
		$("#logout-container").append(logoutButton);
	});
}


$(document).ready(function(){

	FbAPI.firebaseCredentials().then(function(keys){
		console.log("key", keys);
		apiKeys = keys;
		firebase.initializeApp(apiKeys);
		
	});

	$("#create-button").on("click", function(){
		let newItem = {
			"task": $("#task-input").val(),
			"isCompleted": false,
			"uid": uid
		};
		FbAPI.addTodo(apiKeys, newItem).then(function(){
			putTodoInDom();
		});
		$("#task-input").val("");
	});


	$("ul").on("click", ".delete", function(){
		let itemId = $(this).data("fbid");
		FbAPI.deleteTodo(apiKeys, itemId).then(function(){
			putTodoInDom();
		});
	});

	$("ul").on("click", ".edit", function(){
		let parent = $(this).closest("li");
		if (!parent.hasClass("editMode")) {
			parent.addClass("editMode");
		} else {
			let itemId = $(this).data("fbid");
			let editedItem = {
				"task": parent.find(".inputTask").val(),
				"isCompleted": false,
				"uid": uid
			};
			FbAPI.editTodo(apiKeys, itemId, editedItem).then(function(response){
			parent.removeClass("editMode");
			putTodoInDom();
			});
			//firebase stuff
		}
	});

	$("ul").on("change", "input[type='checkbox']", function(){
		let updatedIsCompleted = $(this).closest("li").data("completed");
		let itemId = $(this).parent().data("fbid");
		let task = $(this).siblings(".inputLabel").html();

		let editedItem = {
			"task": task,
			"isCompleted": !updatedIsCompleted,
			"uid": uid
		};

		FbAPI.editTodo(apiKeys, itemId, editedItem).then(function(){
			putTodoInDom();
		});
	});

	$("#registerButton").on("click", function(){
		let email = $("#inputEmail").val();
		let password = $("#inputPassword").val();
		let username = $("#inputUsername").val();

		let user = {
			"email": email,
			"password": password
		};

		FbAPI.registerUser(user).then(function(registerResponse){
			console.log("register response", registerResponse);
			let newUser = {
				"username": username,
				"uid": registerResponse.uid
			};
			
			return FbAPI.addUser(apiKeys, newUser);
			//return FbAPI.loginUser(user);

		}).then(function(addUserResponse){
			return FbAPI.loginUser(user);
		}).then(function(loginResponse){
			console.log("login response", loginResponse);
			uid = loginResponse.uid;
			createLogoutButton();
			putTodoInDom();
			$("#login-container").addClass("hide");
			$("#list-container").removeClass("hide");
		});
	});

	$("#loginButton").on("click", function(){
		let email = $("#inputEmail").val();
		let password = $("#inputPassword").val();

		let user = {
			"email": email,
			"password": password
		};

		FbAPI.loginUser(user).then(function(loginResponse){
			uid = loginResponse.uid;
			createLogoutButton();
			putTodoInDom();
			$("#login-container").addClass("hide");
			$("#list-container").removeClass("hide");
		});
	});

	$("#logout-container").on("click", "#logoutButton", function(){
		FbAPI.logoutUser();
		uid="";
		$("#incomplete-tasks").html("");
		$("#completed-tasks").html("");
		$("#inputEmail").val("");
		$("#inputPassword").val("");
		$("#inputUsername").val("");
		$("#login-container").removeClass("hide");
		$("#list-container").addClass("hide");
	});


});





