import '../styles/options.scss';

function saveTypeOption() {
  const form = document.forms['choose-apod'];
  const value = form[0].checked ? form[0].value : form[1].value;
  chrome.storage.sync.set({
    apodType: value,
  });
  setTimeout(window.close, 350);
}

function saveHiResOnlyOption() {
  const form = document.forms['choose-apod'];
  chrome.storage.sync.set({
    hiResOnly: form[2].checked,
  });
  setTimeout(window.close, 350);
}

(function restoreOptions() {
  chrome.storage.sync.get(['apodType', 'hiResOnly'], function(items) {
    const type = items.apodType;
    if (!type) {
      type = 'today';
      chrome.storage.sync.set({
        apodType: type,
      });
    }

    const form = document.forms['choose-apod'];
    form[type].checked = true;
    form[2].checked = items.hiResOnly;

    form[0].addEventListener('change', saveTypeOption);
    form[1].addEventListener('change', saveTypeOption);
    form[2].addEventListener('change', saveHiResOnlyOption);
  });
})();
