let currentTooltip = null;

function initialize() {
  chrome.storage.sync.get(["isEnabled"], function (result) {
    if (result.isEnabled) {
      enableExtension();
    } else {
      disableExtension();
    }
  });

  // Listen for changes in storage
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.isEnabled) {
      if (changes.isEnabled.newValue) {
        enableExtension();
      } else {
        disableExtension();
      }
    }
  });
}

function enableExtension() {
  document.addEventListener("mouseup", handleMouseUp);
}

function disableExtension() {
  document.removeEventListener("mouseup", handleMouseUp);
  closeTooltip();
}

function handleMouseUp(e) {
  let selectedText = window.getSelection().toString().trim().toLowerCase();
  if (selectedText && /^[a-zA-Z]+$/.test(selectedText)) {
    fetchMeaning(selectedText, function (meaning, pronunciation, audioUrl) {
      if (meaning) {
        showTooltip(e, meaning, pronunciation, audioUrl);
      }
    });
  }
}

const dictionaryAPIs = ["https://api.dictionaryapi.dev/api/v2/entries/en/"];

function fetchMeaning(word, callback) {
  let fetchPromises = [];

  dictionaryAPIs.forEach((api) => {
    fetchPromises.push(
      fetch(`${api}${word}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Error fetching from API:", api, error);
          return null;
        })
    );
  });

  Promise.all(fetchPromises)
    .then((responses) => {
      let foundMeaning = null;
      let foundPronunciation = null;
      let foundAudioUrl = null;
      responses.forEach((response) => {
        if (
          response &&
          response.length > 0 &&
          response[0].meanings &&
          response[0].meanings.length > 0
        ) {
          foundMeaning = response[0].meanings[0].definitions[0].definition;
          if (response[0].phonetics && response[0].phonetics.length > 0) {
            foundPronunciation = response[0].phonetics[0].text;
            foundAudioUrl = response[0].phonetics[0].audio;
          }
        }
      });
      if (foundMeaning) {
        callback(foundMeaning, foundPronunciation, foundAudioUrl);
      } else {
        console.error("No meanings found for the word:", word);
        callback(null, null, null);
      }
    })
    .catch((error) => {
      console.error("Error fetching meanings:", error);
      callback(null, null, null);
    });
}

function showTooltip(event, meaning, pronunciation, audioUrl) {
  closeTooltip();

  let tooltip = document.createElement("div");
  tooltip.className = "hover-tooltip";

  let meaningElement = document.createElement("div");
  meaningElement.textContent = meaning;
  meaningElement.style.fontFamily = "Arial, sans-serif";
  tooltip.appendChild(meaningElement);

  let topOffset = 10;

  if (pronunciation) {
    let pronunciationElement = document.createElement("div");
    pronunciationElement.textContent = `Pronunciation: ${pronunciation}`;
    pronunciationElement.style.fontStyle = "italic";
    pronunciationElement.style.fontFamily = "Arial, sans-serif";
    tooltip.appendChild(pronunciationElement);

    topOffset += pronunciationElement.offsetHeight + 10;
  }

  if (audioUrl) {
    let listenButton = document.createElement("button");
    listenButton.textContent = "Listen";
    listenButton.style.cursor = "pointer";
    listenButton.style.marginTop = "10px";
    listenButton.addEventListener("click", function (event) {
      event.stopPropagation();
      event.preventDefault();
      playAudio(audioUrl);
    });
    tooltip.appendChild(listenButton);
  }

  document.body.appendChild(tooltip);
  currentTooltip = tooltip;

  let bgColor = window
    .getComputedStyle(document.body)
    .getPropertyValue("background-color");
  let isDarkMode = isDarkColor(bgColor);

  if (isDarkMode) {
    tooltip.style.backgroundColor = "#333";
    tooltip.style.color = "#fff";
  } else {
    tooltip.style.backgroundColor = "#fff";
    tooltip.style.color = "#333";
  }

  tooltip.style.position = "absolute";
  tooltip.style.borderRadius = "5px";
  tooltip.style.padding = "10px";
  tooltip.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  tooltip.style.zIndex = "1000";
  tooltip.style.fontSize = "16px";
  tooltip.style.maxWidth = "300px";
  tooltip.style.wordWrap = "break-word";
  tooltip.style.fontFamily = "Arial, sans-serif";
  tooltip.style.left = event.pageX + "px";
  tooltip.style.top = event.pageY + 20 + "px";

  document.addEventListener("mousedown", handleOutsideClick);

  tooltip.addEventListener("mousedown", function (event) {
    event.stopPropagation();
  });

  function handleOutsideClick(event) {
    if (!tooltip.contains(event.target)) {
      closeTooltip();
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  }

  function closeTooltip() {
    if (currentTooltip) {
      currentTooltip.remove();
      currentTooltip = null;
    }
  }
}

function isDarkColor(color) {
  if (color.startsWith("rgb")) {
    let rgb = color.match(/\d+/g);
    return 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2] > 186;
  } else if (color.startsWith("#")) {
    let hex = color.substring(1);
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    return 0.299 * r + 0.587 * g + 0.114 * b > 186;
  }
  return false;
}

function playAudio(audioUrl) {
  let audio = new Audio(audioUrl);
  audio.play();
}

initialize();
