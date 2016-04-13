function cmykToRgb(c, m, y, k) {
  var r = 255 * (1 - c) * (1 - k);
  var g = 255 * (1 - m) * (1 - k);
  var b = 255 * (1 - y) * (1 - k);
  return [r, g, b];
}

function rgbToCss(r, g, b) {
  return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
}

// proper contrast color based on w3c luminance standard
function contrastCss(r8, g8, b8) {
  var r = standardRgb(r8 / 255);
  var g = standardRgb(g8 / 255);
  var b = standardRgb(b8 / 255);
  var l = r * 0.2126 + g * 0.7152 + b * 0.0722;
  if (l > 0.5) {
    return 'black';
  } else {
    return 'white';
  }
}

function standardRgb(component) {
  if (component <= 0.03928) {
    return component / 12.92;
  }
  return Math.pow((component + 0.055)/1.055, 2.4);
}

