/*
import {Sanscript} from './sanscript.mjs';

const filters_slp1 = [
    {
        name: 'ignore long/short e',
        group: 'tamil',
        search: 'ē',
        replace: () => 'e'
    },
    {
        name: 'ignore long/short o',
        group: 'tamil',
        search: 'ō',
        replace: () => 'o'
    },
    {
        name: 'insert glide after back vowels',
        group: 'tamil',
        search: '([aAuUoōO])\\s+([aAiIuUeēEoōO])',
        replace: (match) => `${match[1]} v${match[2]}`
    },
    {
        name: 'insert glide after front vowels',
        group: 'tamil',
        search: '([iIeēE])\\s+([aAiIuUeēEoōO])',
        replace: (match) => `${match[1]} y${match[2]}`
    },
    {
        name: 'ignore puḷḷi',
        group: 'tamil',
        search: '[kKJcTNtnpmyrlvḻḷṟṉ](?!\\s*[aAiIuUeēEoōOḵ])',
        replace: (match) => `${match[0]}a`
    },
    {
        name: 'candrabindu',
        search: 'm̐',
        replace: () => 'M'
    },
    {
        name: 'additional punctuation',
        search: '[()\\[\\],;?!|¦_\\-–—―=+\\d.\\/]+',
        replace: () => ''
    },
    {
        name: 'geminated aspirated consonants',
        search: '(?:kK|gG|cC|jJ|wW|qQ|tT|dD|pP|bB)',
        replace: (match) => match[0].slice(-1)
    },
    {
        name: 'geminated m after h',
        search: '(?:Mhm|hmm)',
        replace: () => 'hm'
    },
    {
        name: 'geminated t',
        search: '([rfi]|p[aA])tt|tt(?=[rvy]\\S)',
        replace: (match) => match[1] ? `${match[1]}t` : 't'
    },
    { 
        name: 'geminated consonants after r',
        search: '([rf]\\s*)([kgcjwqdpbRnmyvl])\\2{1,2}', 
        replace: (match) => `${match[1]}${match[2]}`
    },
    {
        name: 'final nasal variants',
        search: '(?:[MN][lSs]|nn)(?!\\S)',
        replace: () => 'n'
    },
    {
        name: 'internal nasal variants',
        search: '[mnNYR](?=[pPbBmdDtTnwWqQcCjJkKgG])',
        replace: () => 'M'
    },
    {
        name: 'final anusvāra variants', // A 8.4.59
        search: 'M?[mN](?!\\S)|n(?=\\s+[tdn])|Y(?=\\s+[jc])',
        replace: () => 'M'
    }, 
    {
        name: 'visarga aḥ before voiced consonants',
        search: '(?<!\\sB)(?:a[Hr]|[o])(?=\\s+[\'gGjJqQdDnbBmrylvh])', // ignore bho?
        replace: () => 'aH'
    },
    {
        name: 'visarga aḥ before vowels',
        search: 'aH(?=\\s+[AiIeuUof])',
        replace: () => 'a'
    },
    {
        name: 'visarga aḥ before unvoiced consonants and space + anusvāra',
        search: 'o\\s+(?=[kKcCwWtTpPszSM])',
        replace: () => 'aH a'
    },
    {
        name: 'visarga āḥ variants',
        search: 'AH(?=\\s+[aAiIeEuUogGjJqQdDbBnmyrlvh])',
        replace: () => 'A'
    },
    {
        name: 'other visarga variants',
        search: 'H?[rszS](?!\\S)',
        replace: () => 'H'
    },
    {
        name: 'superfluous avagrahas',
        search: '(\\S)\'+',
        replace: (match) => match[1]
    },
    {
        name: 'double avagrahas',
        search: '\'\'',
        replace: () => 'A'
    },
    {
        name: 'avagrahas',
        search: '\'',
        replace: () => 'a'
    },
    {
        name: 'internal visarga variants',
        search: 'z(?=[kK])|s(?=s)',
        replace: () => 'H'
    },
    {
        name: 'final au/āv',
        search: 'Av(?!\\S)',
        replace: () => 'O'
    },
    {
        name: 'final su',
        search: '(?<=[sz])v(?=\\s+[aAiIuUoOeE])',
        replace: () => 'u'
    },
    {
        name: 'final i',
        search: 'i(?=\\s+[aAuUoOeE])',
        replace: () => 'y'
    },
    {
        name: 'kcch/kś',
        search: 'k(\\s*)(?:S|c?C)',
        replace: (match) => `k${match[1]}S`
    },
    {
        name: 'cś/tś',
        search: '[tc](\\s*)S',
        replace: (match) => `c${match[1]}C`
    },
    {
        name: 'cch/ch',
        search: '([aAiIuUeEoO])C',
        replace: (match) => `${match[1]}cC`
    },
    {
        name: 'final t + hi', // just catch most common case here
        search: 'd(\\s+)D(?=[iy](?:\\s|$))',
        replace: (match) => `t${match[1]}h`
    },
    {
        name: 'final t + voiced syllable', // different rule for t + h = ddh
        search: 'd(?=(?:\\s+[aAiIeEuUoOgGdDbByrv]|\\s*$))',
        replace: () => 't'
    },
    {
        name: 'final t + n/m',
        search: '([ai])n(?=\\s+[nm])',
        replace: (match) => `${match[1]}t`
    },
    {
        name: 'final t + c/j',
        search: 'j(?=\\s+j)|c(?=\\s+c)',
        replace: () => 't'
    },
    {    
        name: 'i/y + vowel',
        search: 'y(?=\\s+[aAuUeEoO])',
        replace: () => 'i'
    },
    {
        name: 'bhd for bdh',
        search: 'Bd',
        replace: () => 'bD'
    }
];
*/
const filters = [
/*
    {
        name: 'valapalagilaka',
        search: 'ṙ',
        replace: () => 'r'
    },
*/
    {
        name: 'ignore long/short e',
        group: 'tamil',
        search: 'ē',
        replace: () => 'e'
    },
    {
        name: 'ignore long/short o',
        group: 'tamil',
        search: 'ō',
        replace: () => 'o'
    },
    {
        name: 'insert glide after back vowels',
        group: 'tamil',
        search: '([aāuūoō])\\s+([aāiīuūeēoō])',
        replace: (match) => `${match[1]} v${match[2]}`
    },
    {
        name: 'insert glide after front vowels',
        group: 'tamil',
        search: '([iīeē])\\s+([aāiīuūeēoō])',
        replace: (match) => `${match[1]} y${match[2]}`
    },
    {
        name: 'ignore puḷḷi',
        group: 'tamil',
        search: '[kṅcñṭṇtnpmyrlvḻḷṟṉ](?!\\s*[aāiīuūeēoōḵ])',
        replace: (match) => `${match[0]}a`
    },
/*
    {
        name: 'pṛṣṭhamātrā e',
        search: 'ê',
        replace: () => 'e'
    },
    {
        name: 'pṛṣṭhamātrā o',
        search: 'ô',
        replace: () => 'o'
    },
    {
        name: 'pṛṣṭhamātrā ai',
        search: 'aî',
        replace: () => 'ai'
    },
    {
        name: 'pṛṣṭhamātrā au',
        search: 'aû',
        replace: () => 'au'
    },
*/
    {
        name: 'candrabindu as anusvāra',
        search: 'm̐',
        replace: () => 'ṃ'
    },
/*
    {
        name: 'oṃkāras',
        search: 'oṁ',
        replace: () => 'oṃ'
    },
*/
    {
        name: 'additional punctuation',
        search: '[()\\[\\],;?!|¦_\\-–—―=+\\d.\\/]+',
        replace: () => ''
    },
    {
        name: 'geminated aspirated consonants',
        search: '([kgcjṭḍtdpb]){2}h',
        replace: (match) => `${match[1]}h` 
    },
    {
        name: 'geminated m after h',
        search: '(?:ṃhm|hmm)',
        replace: () => 'hm'
    },
    {
        name: 'geminated t',
        search: '([rṛi]|p[aā])tt|tt(?=[rvy]\\S)',
        replace: (match) => match[1] ? `${match[1]}t` : 't'
    },
    { 
        name: 'geminated consonants after r',
        search: '([rṛ]\\s*)([kgcjṭḍṇtdnpbmyvl])\\2{1,2}', 
        replace: (match) => `${match[1]}${match[2]}`
    },
    {
        name: 'final nasal variants',
        search: '(?:[ṃṅ][lṣs]|nn)(?!\\S)',
        replace: () => 'n'
    },

    {
        name: 'internal nasal variants',
        search: '[mnṅñṇ](?=[pbmdtnṭḍcjkg])',
        replace: () => 'ṃ'
    },
    {
        name: 'final anusvāra variants', // A 8.4.59
        search: 'ṃ?[mṅ](?!\\S)|n(?=\\s+[tdn])|ñ(?=\\s+[jc])',
        replace: () => 'ṃ'
    }, 
    {
        name: 'visarga aḥ before voiced consonants',
        search: '(?:a[ḥr]|[o])(?=\\s+[\'gjḍdnbmyrlvh])', // ignore bho?
        replace: () => 'aḥ'
    },
    {
        name: 'visarga aḥ before vowels',
        search: 'aḥ(?=\\s+[āiīeuūoṛ])',
        replace: () => 'a'
    },
    {
        name: 'visarga aḥ before unvoiced consonants and space + anusvāra',
        search: 'o\\s+(?=[kcṭtpśṣsṃ])',
        replace: () => 'aḥ a'
    },
    {
        name: 'visarga āḥ variants',
        search: 'āḥ(?=\\s+[aāiīeuūogjḍdnbmyrlvh])',
        replace: () => 'ā'
    },
    {
        name: 'other visarga variants',
        search: 'ḥ?[rśṣs](?!\\S)',
        replace: () => 'ḥ'
    },
    {
        name: 'superfluous avagrahas',
        search: '(\\S)\'+',
        replace: (match) => match[1]
    },
    {
        name: 'double avagrahas',
        search: '\'\'',
        replace: () => 'ā'
    },
    {
        name: 'avagrahas',
        search: '\'',
        replace: () => 'a'
    },
    {
        name: 'internal visarga variants',
        search: 'ṣ(?=k)|s(?=s)',
        replace: () => 's'
    },
    {
        name: 'final au/āv',
        search: 'āv(?!\\S)',
        replace: () => 'au'
    },
    {
        name: 'final su',
        search: '(?<=[sṣ])v(?=\\s+[aāiīuūoe])',
        replace: () => 'u'
    },
    {
        name: 'final i',
        search: 'i(?=\\s+[aāuūeo])',
        replace: () => 'y'
    },
    {
        name: 'kcch/kś',
        search: 'k(\\s*)(?:ś|c?ch)',
        replace: (match) => `k${match[1]}ś`
    },
    {
        name: 'cś/tś',
        search: '[tc](\\s*)ś',
        replace: (match) => `c${match[1]}ch`
    },
    {
        name: 'cch/ch',
        search: '([aāiīuūeo])ch',
        replace: (match) => `${match[1]}cch`
    },
    {
        name: 'final t + hi', // just catch most common case here
        search: 'd(\\s+)dh(?=[iy](?:\\s|$))',
        replace: (match) => `t${match[1]}h`
    },
    {
        name: 'final t + voiced syllable', // different rule for t + h = ddh
        search: 'd(?=(?:\\s+[aāiīeuūogdbyrv]|\\s*$))',
        replace: () => 't'
    },
    {
        name: 'final t + n/m',
        search: '([ai])n(?=\\s+[nm])',
        replace: (match) => `${match[1]}t`
    },
    {
        name: 'final t + c/j',
        search: 'j(?=\\s+j)|c(?=\\s+c)',
        replace: () => 't'
    },
    {    
        name: 'i/y + vowel',
        search: 'y(?=\\s+[aāuūeo])',
        replace: () => 'i'
    },
    {
        name: 'bhd for bdh',
        search: 'bhd',
        replace: () => 'bdh'
    },
    {
        name: 'remove spaces',
        group: 'other',
        search: '\\s',
        replace: () => ''
    },
];
/*
const spaces = {
    none: {
        name: 'remove spaces',
        search: '\\s',
        replace: () => ''
    },
    collapse: {
        name: 'collapse spaces',
        search: '\\s+',
        replace: () => ' '
    }
};
*/
const replaceAll = (filter, str) => {
    const matches = [...str.matchAll(filter.search)];
    //const replacements = [];
    const filtered = [];
    if(matches.length === 0)
        return [str,null];
        //return str;

    let newstr = str; 
    for(const match of [...matches].reverse()) {
        const rep = filter.replace(match);
        newstr = strSplice(newstr,match.index,match[0].length,rep);
        //replacements.unshift(rep);
        filtered.unshift({oldtext: match[0], newtext: rep, index: match.index});
    }
    //return [newstr, {matches: matches, replacements: replacements}];
    return [newstr, filtered];
};
const unreplaceAll = (strs, fs) => {
    //fs: [{index: num, newtext: str, oldtext: str}]
    let newstrs = strs;

    while(fs.length > 0) {
        const match = fs.shift();
        const [offset,head,slice] = splitAt(newstrs,match);
        const newtail = replaceAt(offset,slice,match);
        newstrs = head.concat(newtail);
    }

    return newstrs;
};

const splitAt = (strs,match) => {
    let headlength = 0;
    let splitpoint = 0;
    const head = [];
    for(const str of strs) {
        const n = headlength + str.length;
        if(match.index > n) {
            headlength = n;
            splitpoint = splitpoint + 1;
        }
        else if(match.index === n && match.newtext !== '') {
            headlength = n;
            splitpoint = splitpoint + 1;
            break;
        }
        else break;
    }
    return [match.index - headlength, strs.slice(0,splitpoint), strs.slice(splitpoint)];
};
const replaceAt = (start, slice, match) => {
    slice = [...slice];
    let oldtext = match.oldtext;
    let newlength = match.newtext.length;
    if(start + newlength <= slice[0].length) {
        slice[0] = strSplice(slice[0],start,newlength,oldtext);
        return slice;
    }
    else {
        let tailtext = oldtext;
        let tailstart = start;
        let tailnewlength = newlength;
        let tailindex = match.index;
        let cur = 0;
        //while(tailstart + tailnewlength >= slice[cur].length) {
        while(tailnewlength > 0) {
            if(tailstart + tailnewlength <= slice[0].length) {
                slice[cur] = strSplice(slice[cur],tailstart,tailnewlength,tailtext);
                return slice;
            }
            const splitat = slice[cur].length;
            //const oldslice = slice[cur].slice(0,splitat);
            slice[cur] = tailtext.slice(0,splitat);
            tailtext = tailtext.slice(splitat);
            //console.log(`"${slice[cur]}" replaces "${oldslice}"`);
            tailnewlength = tailnewlength - splitat;
            //console.log(`tail: "${tailtext}" length: ${tailnewlength}`);
            tailstart = 0;
            cur = cur + 1;
        }
    }
    return slice;
};
/*
const unreplaceAll = (strs, fs) => {
    const newstrs = [];
    let start = 0;
    let remainder = null;
    for(const str of strs) {
        if(str.length === 0) {
            newstrs.push('');
            continue; // is this necessary?
        }

        const end = start + str.length;
        let newstr = str;
        //let offset = 0;

        if(remainder) {
            if(remainder.length < str.length ||
                (remainder.length <= str.length && remainder.text.endsWith('h'))) {
                //hacky fix for aspirated consonants
                newstr = strSplice(str,0,remainder.length,remainder.text);
                //offset = remainder.text.length - remainder.length;
                remainder = null;
            }
            else {
                const remhead = remainder.text.slice(0,str.length);
                newstr = remhead;
                newstrs.push(newstr);
                const remtail = remainder.text.slice(str.length);
                remainder = {length: remainder.length - str.length, text: remtail};
                start = start + newstr.length;
                continue;
            }
        }
        while(fs.length > 0 && fs[0].index <= end) {
            const match = fs.shift();
            const matchstart = match.index - start;// + offset;
            const newtxt = match.newtext;
            const oldtxt = match.oldtext;

            if(match.index + newtxt.length <= end) {
                newstr = strSplice(newstr,matchstart,newtxt.length,oldtxt);
                //offset = 0;
                //offset = offset + oldtxt.length - newtxt.length;
            }
            else {
                const splitat = str.length - matchstart;// + offset;
                const head = oldtxt.slice(0,splitat);
                newstr = newstr.slice(0,matchstart) + head;
                const tail = oldtxt.slice(splitat);
                const taillen = newtxt.length - splitat;
                remainder = {length: taillen, text: tail};
                // the while loop should end here
            }
        }
        newstrs.push(newstr);
        start = start + newstr.length;
    }
    return newstrs;
};
*/
const strSplice = function(str,start,len,splice_in) {
    return str.slice(0,start) + splice_in + str.slice(start + len);
};

const filterAll = (str,filterindices = [...filters.keys()]) => {
    let retstr = str;
    //let retstr = str.replaceAll(/([kgcjṭḍtdpb])h/g,(m) => m[0].toUpperCase());
    const filtered = [];
    //for(const filter of [...filters,spaces.none]) {
    for(const i of filterindices) {
        const ret = replaceAll(filters[i],retstr);
        if(ret[1] === null) continue;

        retstr = ret[0];
        filtered.push(ret[1]);
    }
    return [retstr,filtered];
};

const unfilterAll = (strs,filtered) => {
    let retstrs = strs;
    for(const f of filtered.reverse()) {
        retstrs = unreplaceAll(retstrs,f);
    }
    /*
    retstrs = retstrs.map(s => Array.isArray(s) ? 
        s.map(ss => ss.replaceAll(/[KGCJṬḌTDPB]/g,(m) => m[0].toLowerCase() + 'h')) :
        s.replaceAll(/[KGCJṬḌTDPB]/g,(m) => m[0].toLowerCase() + 'h')
    );
    */
    return retstrs;
};
//console.log(Normalizer(['a','r','t','th','ī','s','ā','r','tth','o ','p','a','t','ś','a','l','ī','m','artthisārttho ','pagacchati']));
//console.log(Normalizer(['artthisārttho pārttho pārttho ','pārttho ','pagacchati']));

export { filters, filterAll, unfilterAll };
