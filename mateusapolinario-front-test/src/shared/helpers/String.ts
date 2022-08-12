function toggleSubString(target: string, subString: string) {
  let result = '';
  if (target.includes(subString)) {
    result = target.replace(`${subString};`, '');
  } else {
    result = target + `${subString};`;
  }
  return result;
};

export {
  toggleSubString,
}