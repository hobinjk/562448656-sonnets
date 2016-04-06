console.log(sons.length);

var slidingContainers;
var container = document.getElementById('container');


function offscreenX() {
  return window.innerWidth - slidingContainers.getBoundingClientRect().left + 5;
}

function makeContainer(contents) {
  var container = document.createElement('span');
  container.innerHTML = contents;
  container.style.transform = 'translateX(' + offscreenX() + 'px) translateY(0px)';
  container.classList.add('sliding');
  slidingContainers.appendChild(container);
  return container;
}

function slideContainer(container) {
  setTimeout(function() {
    container.style.transform = 'translateX(0px) translateY(0px)';
  }, 50);

  return transitionEnd(container);
}

function transitionEnd(elt) {
  return new Promise(function(resolve, reject) {
    function onEnd() {
      resolve();
      elt.removeEventListener('transitionend', onEnd);
    }
    elt.addEventListener('transitionend', onEnd);
  });
}

function randomInt(n) {
  return Math.floor(Math.random() * n);
}

function randomChoice(arr) {
  return arr[randomInt(arr.length)];
}

function sleep(delay) {
  return new Promise(function(res) {
    setTimeout(res, delay);
  });
}

function makeSonnet() {
  slidingContainers = document.createElement('div');
  slidingContainers.id = 'sliding-containers';
  container.appendChild(slidingContainers);
  var aIdx = randomInt(sons.length);
  var bIdx = randomInt(sons.length);
  var cIdx = randomInt(sons.length);
  var dIdx = randomInt(sons.length);
  var title = [aIdx, bIdx, cIdx, dIdx].join("&mdash;");
  var aText = sons[aIdx];
  var bText = sons[bIdx];
  var cText = sons[cIdx];
  var dText = sons[dIdx];

  while (dText[12].length === 0) { //Specifically handle that one sonnet
    dText = randomChoice(sons);
  }

  var son = [];
  var a = makeContainer(aText.slice(0, 4).join('<br/>'));
  var b = makeContainer(bText.slice(4, 8).join('<br/>'));
  var c = makeContainer(cText.slice(8, 12).join('<br/>'));
  var d = makeContainer(dText.slice(12, 14).join('<br/>'));

  slideContainer(a).then(function() {
    return sleep(8000);
  }).then(function() {
    return slideContainer(b);
  }).then(function() {
    return sleep(8000);
  }).then(function() {
    return slideContainer(c);
  }).then(function() {
    return sleep(8000);
  }).then(function() {
    return slideContainer(d);
  }).then(function() {
    return sleep(200);
  }).then(function() {
    slidingContainers.classList.add('raised');
    return transitionEnd(slidingContainers);
  })
  .then(function() {
    return sleep(14000);
  }).then(function() {
    slidingContainers.classList.add('off-screen');
    return transitionEnd(slidingContainers);
  }).then(function() {
    slidingContainers.parentNode.removeChild(slidingContainers);
    makeSonnet();
  });
}

makeSonnet();
