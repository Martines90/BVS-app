const normalizeFileName = (fileName) => fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(' ', '_');

module.exports = {
  normalizeFileName,
};
