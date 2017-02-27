function save_options() {
  let form = document.forms['choose-apod'];
  let value = form[0].checked ? form[0].value : form[1].value;
  chrome.storage.sync.set({
    apodType: value
  });
  setTimeout(window.close, 350);
}

function restoreOptions () {
  chrome.storage.sync.get(['apodType'], function(items) {
    let type = items.apodType || 'today';
    let form = document.forms['choose-apod'];
    form[type].checked = true;
    form[0].addEventListener('change', save_options);
    form[1].addEventListener('change', save_options);
  });
}

restoreOptions();
