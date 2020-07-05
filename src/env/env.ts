const env = {
    storageType: process.env.STORAGE_TYPE || 'json',
    sourceDataName: evaluatedPath(process.env.SOURCE_DATA_NAME || '') || '',
};

function evaluatedPath(s: string): string {
    let replacePattern: RegExp;
    if (['win32'].indexOf(process.platform) != -1) {
        replacePattern = /%([^%]+)%/g;
    } else {
        replacePattern = /\$([^/]+)/g;
    }
    return s.replace(replacePattern, (_, n) => process.env[n] || '');
}

export default env;