exports.smartTrim = (str, len, delim, appendix) => {
  if (str.length <= len) return str;
  let trimmedStr = str.substring(0, len + delim.length);
  const lastDelimIndex = trimmedStr.lastIndexOf(delim);
  if (lastDelimIndex >= 0) trimmedStr.substring(0, lastDelimIndex);
  if (trimmedStr) trimmedStr += appendix;
  return trimmedStr;
};
