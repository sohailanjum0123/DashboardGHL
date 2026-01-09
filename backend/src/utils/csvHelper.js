export const sanitizeRow= (row) => {
  const out = {};
  for (const key of Object.keys(row)) {
    const cleanKey = key.trim();
    const raw = (row[key] ?? '').toString().trim();

    const safe = raw.replace(/^([=+\-@])/, "'$1");

    if (safe === '') out[cleanKey] = null;
    else if (!isNaN(safe) && safe.length < 16) out[cleanKey] = Number(safe);
    else if (['true', 'false'].includes(safe.toLowerCase())) out[cleanKey] = safe.toLowerCase() === 'true';
    else out[cleanKey] = safe;
  }
  return out;
}


