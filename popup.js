document.addEventListener("DOMContentLoaded", function () {
  const toggleIcon = document.getElementById("toggleIcon");
  const toggleText = document.getElementById("toggleText");

  chrome.storage.sync.get(["isEnabled"], function (result) {
    setIconState(result.isEnabled);
  });

  toggleIcon.addEventListener("click", function () {
    chrome.storage.sync.get(["isEnabled"], function (result) {
      const newState = !result.isEnabled;
      chrome.storage.sync.set({ isEnabled: newState }, function () {
        setIconState(newState);
      });
    });
  });

  function setIconState(isEnabled) {
    if (isEnabled) {
      toggleIcon.src = "power_on.png";
      toggleText.textContent = "Enabled";
    } else {
      toggleIcon.src = "power_off.png";
      toggleText.textContent = "Disabled";
    }
  }
});
