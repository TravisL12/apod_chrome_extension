function save_options() {
  let form = document.forms['choose-apod'];
  let value = form[0].checked ? form[0].value : form[1].value;
  chrome.storage.sync.set({
    apodType: value
  }, function() {
    console.log('updated stats!');
  });
  window.close();
}

function restoreOptions () {
  chrome.storage.sync.get(['apodType'], function(items) {
    let type = items.apodType || 'today';
    let form = document.forms['choose-apod'];
    form[type].checked = true;
    form.getElementsByTagName('button')[0].addEventListener('click', save_options);
  });
}

restoreOptions();
