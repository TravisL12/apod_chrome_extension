import '../styles/options.scss';

function saveTypeOption() {
  let form = document.forms['choose-apod'];
  let value = form[0].checked ? form[0].value : form[1].value;
  chrome.storage.sync.set({
    apodType: value,
  });
  setTimeout(window.close, 350);
}

function saveDatePickerOption() {
  let form = document.forms['choose-apod'];
  chrome.storage.sync.set({
    showDatePicker: form[2].checked,
  });
  setTimeout(window.close, 350);
}

(function restoreOptions() {
  chrome.storage.sync.get(['apodType', 'showDatePicker'], function(items) {
    let type = items.apodType;
    if (!type) {
      type = 'today';
      chrome.storage.sync.set({
        apodType: type,
      });
    }

    let form = document.forms['choose-apod'];
    form[type].checked = true;
    form[2].checked = items.showDatePicker;

    form[0].addEventListener('change', saveTypeOption);
    form[1].addEventListener('change', saveTypeOption);
    form[2].addEventListener('change', saveDatePickerOption);
  });
})();
