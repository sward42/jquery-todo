"use strict";

var FbAPI = (function (oldFirebase) {
	
	oldFirebase.getTodos = function(apiKeys, uid){
		return new Promise((resolve, reject)=>{
			$.ajax({
				method:'GET',
				url:`${apiKeys.databaseURL}/items.json?orderBy="uid"&equalTo="${uid}"`
			}).then((response)=>{
				let items = [];

				Object.keys(response).forEach(function(key){
					response[key].id = key;
					items.push(response[key]);
				});
				resolve(items);
			}, (error)=>{
				reject(error);
			});
		});
	};

	oldFirebase.addTodo = function(apiKeys, newItem){
		return new Promise((resolve, reject)=>{
			$.ajax({
				method:'POST',
				url:`${apiKeys.databaseURL}/items.json`,
				data: JSON.stringify(newItem),
				dataType:'json'
			}).then((response)=>{
				console.log("response from POST", response);
				resolve(response);
			}, (error)=>{
				reject(error);
			});
		});
	};

	oldFirebase.deleteTodo = function(apiKeys, itemId){
		return new Promise((resolve, reject)=>{
			$.ajax({
				method:'DELETE',
				url:`${apiKeys.databaseURL}/items/${itemId}.json`
			}).then((response)=>{
				console.log("response from DELETE", response);
				resolve(response);
			}, (error)=>{
				reject(error);
			});
		});
	};

	oldFirebase.editTodo = function(apiKeys, itemId, editedItem){
		return new Promise((resolve, reject)=>{
			$.ajax({
				method:'PUT',
				url:`${apiKeys.databaseURL}/items/${itemId}.json`,
				data: JSON.stringify(editedItem),
				dataType:'json'
			}).then((response)=>{
				console.log("response from PUT", response);
				resolve(response);
			}, (error)=>{
				reject(error);
			});
		});
	};



	return oldFirebase;
})(FbAPI || {});