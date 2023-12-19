const CharSet = function({vowels,consonants,postvowels,gap}) {
    this.vowels = new Set(vowels);
    this.consonants = new Set(consonants);
    this.postvowels = new Set(postvowels);
    this.gap = gap;

    this.lengthMap = new Map();
    for(const c of [...vowels,...consonants,...postvowels,gap]) {
        const existing = this.lengthMap.get(c.length);
        if(existing) existing.add(c);
        else this.lengthMap.set(c.length,new Set([c]));
    }
    this.maxLength = Math.max(...this.lengthMap.keys());
    
};

const iast = new CharSet({
    vowels: ['a','ā','i','ī','u','ū','o','ō','e','ē','ai','au','ṛ','ṝ','l̥','l̥̄'],
    consonants: ['k','kh','g','gh','ṅ','c','ch','j','jh','ñ','ṭ','ṭh','ḍ','ḍh','ṇ','t','th','d','dh','n','p','ph','b','bh','m','y','r','l','v','ś','ṣ','s','h','ḻ','ḷ','ḷh','ṟ','ṉ'],
    postvowels: ['ṃ','ḥ','ḵ'],
    gap: '‡'
});

const charType = {
    consonant: Symbol('consonant'),
    vowel: Symbol('vowel'),
    mark: Symbol('mark'),
    gap: Symbol('gap'),
    other: Symbol('other')
};

const getType = (str, charset) => {
    if(charset.consonants.has(str))
        return charType.consonant;
    if(charset.vowels.has(str))
        return charType.vowel;
    if(charset.postvowels.has(str))
        return charType.mark;
    if(charset.gap === str)
        return charType.gap;
    return null;
};

const charSplit = (str,charset = iast) => {
    const ret = [];
    let start = 0;
    while(start < str.length) {
        const slice = str.slice(start,start + charset.maxLength);
        const found = findChar(slice,charset);
        if(found === null) {
            ret.push(slice[0]);
            start = start + 1;
        }
        else {
            ret.push(found);
            start = start + found.length;
        }
    }
    return ret;
};

const graphemeSplit = (str,charset = iast) => {
    const ret = [];
    let cache = [];
    let prevtype = null;
    let start = 0;
    while(start < str.length) {
        const slice = str.slice(start,start + charset.maxLength);
        const found = findChar(slice,charset);
        if(found === null) {
            cache.push(slice[0]);
            start = start + 1;
            prevtype = charType.other;
        }
        else {
            start = start + found.length;

            const curtype = getType(found,iast);
            if(curtype === charType.consonant ||
               curtype === charType.gap ||
               curtype === charType.vowel && prevtype !== charType.consonant ||
               curtype !== charType.other && prevtype === charType.other //||
               //curtype === charType.postvowel && prevtype === charType.consonant
              ) {
                if(cache.length !== 0) ret.push(cache);
                cache = [found];
            }
            else
                cache.push(found);

            prevtype = curtype;
        }
    }

    ret.push(cache);

    return ret;
};

const aksaraSplit = (str,charset = iast) => {
    const ret = [];
    let cache = [];
    let prevtype = null;
    let start = 0;
    while(start < str.length) {
        const slice = str.slice(start,start + charset.maxLength);
        const found = findChar(slice,charset);
        if(found === null) {
            cache.push(slice[0]);
            start = start + 1;
            prevtype = charType.other;
        }
        else {
            start = start + found.length;

            const curtype = getType(found,iast);
            if(curtype === charType.consonant && prevtype !== charType.consonant ||
               curtype === charType.gap ||
               curtype === charType.vowel && prevtype !== charType.consonant ||
               curtype !== charType.other && prevtype === charType.other //||
               //curtype === charType.postvowel && prevtype === charType.consonant
              ) {
                if(cache.length !== 0) ret.push(cache);
                cache = [found];
            }
            else
                cache.push(found);

            prevtype = curtype;
        }
    }

    ret.push(cache);

    return ret;
};

const findChar = (str,charset) => {
    let length = str.length;
    let slice = str;
    while(length > 0) {
        const found = charset.lengthMap.get(length).has(slice);
        if(found) return slice;
        else {
            length = length-1;
            slice = slice.slice(0,-1);
        }
    }
    return null;
    //throw new Error(`You messed up at ${str}.`);
};

/*
const teststr = 'jñānadayāsindhōḥ';
console.log(charSplit(teststr, iast));
console.log(graphemeSplit(teststr, iast));
console.log(aksaraSplit(teststr, iast));
*/

export { aksaraSplit, charSplit, graphemeSplit, iast };
