"use strict";

(function (exports) {
	function setStorageArea(response, callback) {

		let key = 'LinGraph:' + new Date().getTime();
		let graph = {};

		graph[key] = response.data;

		chrome.storage.local.set(graph, () => {
			callback();
		});
	}

	function getAllStorageArea(callback) {
		chrome.storage.local.get(null, (items) => {
			let error = chrome.runtime.lastError;
			if (error) {
				callback(error);
				return;
			}

			let keys = Object.keys(items);
			let data = [];

			keys.forEach((k) => {
				if (k.indexOf('LinGraph') !== -1) {
					data.push({key: k, length: items[k].length});
				}
			});

			callback(null, {ids: data});
		});
	}

	function getStorageArea(key, callback) {
		chrome.storage.local.get(key, (item) => {
			let error = chrome.runtime.lastError;
			if (error) {
				callback(error);
				return;
			}

			let data = item[key];
			callback(null, data);
		});
	}

	function removeStorageArea(key, callback) {
		chrome.storage.local.remove(key, () => {
			let error = chrome.runtime.lastError;
			if (error){
				callback(error);
				return;
			}

			callback();
		});
	}

	function clearStorageArea(callback) {
		chrome.storage.local.clear(() => {
			let error = chrome.runtime.lastError;
			if (error){
				callback(error);
				return;
			}

			callback();
		});
	}

	exports.local = {
		setStorageArea : setStorageArea,
		getAllStorageArea : getAllStorageArea,
		getStorageArea : getStorageArea,
		removeStorageArea : removeStorageArea,
		clearStorageArea : clearStorageArea
	};

})(typeof exports === 'undefined'  ? this['storage'] = {} : exports);
