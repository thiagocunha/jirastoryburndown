// Saves options to chrome.storage
function save_options() {
    var ids = document.getElementById('ids').value;
    var baseURL = document.getElementById('baseURL').value;
    chrome.storage.sync.set({
      ids: ids,
      baseURL: baseURL
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
      ids: '',
      baseURL: 'https://jira.*.com/'
    }, function(items) {
      document.getElementById('ids').value = items.ids;
      document.getElementById('baseURL').value = items.baseURL;
    });
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',
      save_options);