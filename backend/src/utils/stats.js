
function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function minItem(arr, key) {
  if (!arr.length) return null;
  return arr.reduce((min, item) => (item[key] < min[key] ? item : min), arr[0]);
}

function maxItem(arr, key) {
  if (!arr.length) return null;
  return arr.reduce((max, item) => (item[key] > max[key] ? item : max), arr[0]);
}

module.exports = { mean, minItem, maxItem };