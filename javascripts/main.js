"use strict";

let taskInput;


function addTask() {
	taskInput = $("#task-input").val();
	if (taskInput !== "") {
		var newElement = $(`<div class="panel-body tasks">
		     <div class="col-md-8 task-item">${taskInput}</div>
		     <div><input type=text class="col-md-8 text-edit">
		     <div class="col-md-4"><button class="btn btn-primary btn-xs edit">Edit</button><button class="btn btn-primary btn-xs complete">Complete</button><button class="btn btn-primary btn-xs delete">Delete</button><button class="btn btn-primary btn-xs todo">To Do</button></div>`);

		$("#todo-list").append(newElement);

		newElement.find(".edit").click(function(){
			newElement.find(".task-item").hide();
			newElement.find(".text-edit").val(newElement.find(".task-item").html()).show();
			$(".text-edit").focus();

			newElement.find(".text-edit").keypress((e)=> {
				if(e.which == 13) {
					newElement.find(".task-item").html($(".text-edit").val()).show();
					newElement.find(".text-edit").hide();

				  	console.log("enter in edit");
				}
			});

			console.log("text", newElement);
			console.log("edit-button");
			console.log("taskInput", newElement);
		});

		newElement.find(".complete").click(function(){
			$("#complete-list").append(newElement);
			newElement.find(".complete").hide();
			newElement.find(".edit").hide();
			newElement.find(".todo").show();

			console.log("complete-button");
			console.log("taskInput", newElement);
		});

		newElement.find(".delete").click(function(){
			newElement.remove();
			console.log("delete-button");
			console.log("taskInput", newElement);
		});

		newElement.find(".todo").click(function(){
			$("#todo-list").append(newElement);
			newElement.find(".todo").hide();
			newElement.find(".complete").show();
			newElement.find(".edit").show();
		});
	}	
	$("#task-input").val("");
}





$("#create-button").click(()=>{
	addTask();
	// console.log("create-button");
	// console.log("taskInput", taskInput);
});

$(document).keypress(function(e) {
  if(e.which == 13) {
  	addTask();
  }
});