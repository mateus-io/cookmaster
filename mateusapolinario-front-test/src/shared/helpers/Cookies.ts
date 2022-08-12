function store(
  key: string,
  value: string,
  options: { [key: string]: string },
) {
  const cookieOptions = Object.entries(options).map((option) => {
    return `${option[0]}=${option[1]}`;
  }).join(';');

  document.cookie = `${key}=${value};${cookieOptions}`;
}

function remove(key: string, domain: string) {
  store(key, '', {
    'max-age': '0',
    'domain': domain,
  });
}

function findOne(key: string) {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const parts = cookie.split('=').map((part) => part.trim());
    if (key === parts[0]) return { key, value: parts[1] };
  }
  return null;
}

export {
  store,
  remove,
  findOne
}