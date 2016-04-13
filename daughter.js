var container = document.getElementById('container');
var choiceElements = [];
var state = getStateFromUrl();
var reconsiderElt = document.getElementById('reconsider');
reconsiderElt.addEventListener('mousedown', function(event) {
  onReconsider();
  event.preventDefault();
  event.stopPropagation();
}, true);

function normalizeChoice(choice) {
  return choice / (sons.length - 1);
}


function choiceElement(index) {
  var elt = document.createElement('div');
  elt.classList.add('choice');
  var text = document.createElement('p');
  text.textContent = index;
  elt.appendChild(text);
  elt.dataset.index = index;

  function onMouseDown() {
    onChoiceEltMouseDown(parseInt(elt.dataset.index));
  }
  elt.addEventListener('mousedown', onMouseDown);

  return elt;
}

function updateChoiceElementColor(elt, choices) {
  var rgb = cmykToRgb(normalizeChoice(choices[3]), normalizeChoice(choices[2]),
                      normalizeChoice(choices[1]), normalizeChoice(choices[0]));
  var css = rgbToCss(rgb[0], rgb[1], rgb[2]);

  elt.style.color = contrastCss(rgb[0], rgb[1], rgb[2]);
  elt.style.backgroundColor = css;
}

function makeChoiceElements() {
  for (var i = 0; i < sons.length; i++) {
    choiceElements[i] = choiceElement(i);
    container.appendChild(choiceElements[i]);
  }
}

function onChoiceEltMouseDown(choice) {
  state.choices[state.currentChoice] = choice;
  if (state.currentChoice < 4) {
    state.currentChoice += 1;
  }
  if (state.currentChoice == 4) {
    makePoem();
  } else {
    updateChoiceElements();
  }
  saveStateToUrl();
}

function updateChoiceElements() {
  container.classList.add('unfinished');

  for (var i = 0; i < sons.length; i++) {
    var tmpChoices = [].concat(state.choices);
    tmpChoices[state.currentChoice] = i;
    updateChoiceElementColor(choiceElements[i], tmpChoices);
  }
  reconsiderElt.style.color = choiceElements[0].style.color;
}

function onReconsider() {
  if (state.currentChoice === 0) {
    return;
  }
  state.currentChoice -= 1;
  updateChoiceElements();
  saveStateToUrl();
}

function makePoem() {
  if (!container.classList.contains('unfinished')) {
    return;
  }
  container.classList.remove('unfinished');

  var choices = state.choices;

  for (var i = 0; i < choiceElements.length; i++) {
    updateChoiceElementColor(choiceElements[i], choices);
  }

  var poemText = [];

  poemText = poemText.concat(sonSlice(choices[0], 0, 4));
  poemText = poemText.concat(sonSlice(choices[1], 4, 4));
  poemText = poemText.concat(sonSlice(choices[2], 8, 4));
  poemText = poemText.concat(sonSlice(choices[3], 12, 2));

  var poemElt = document.getElementById('poem');
  if (!poemElt) {
    poemElt = document.createElement('div');
    poemElt.id = 'poem';
    container.appendChild(poemElt);
  }
  var poemTextElt = document.createElement('div');
  poemTextElt.classList.add('poem-text');
  poemTextElt.innerHTML = poemText.join('<br/>');
  // Properly contrast text
  poemTextElt.style.color = choiceElements[0].style.color;
  reconsiderElt.style.color = choiceElements[0].style.color;

  poemElt.innerHTML = '';
  poemElt.appendChild(poemTextElt);
}

function sonSlice(choice, index, len) {
  if (choice === 98) {
    if (index === 0) {
      return sons[choice].slice(index, index + len + 1);
    } else {
      return sons[choice].slice(index + 1, index + len + 1);
    }
  }
  return sons[choice].slice(index, index + len);
}

function saveStateToUrl() {
  window.location.hash = [state.currentChoice].concat(state.choices).join('-');
}

function getStateFromUrl() {
  var parts = ('' + window.location).split('#');
  var state = {
    choices: [0, 0, 0, 0],
    currentChoice: 0
  };

  if (parts.length > 1) {
    var arr = parts[1].split('-');
    state.currentChoice = parseInt(arr[0]);
    state.choices = arr.slice(1).map(function(x) { return parseInt(x); });
  }

  return state;
}

(function() {
  makeChoiceElements();
  if (state.currentChoice < 4) {
    updateChoiceElements();
  } else {
    makePoem();
  }
})();
