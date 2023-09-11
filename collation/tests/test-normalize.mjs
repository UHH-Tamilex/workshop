import { filterAll, unfilterAll } from './normalize.mjs';
import { aksaraSplit, charSplit, graphemeSplit } from './split.mjs';

//const s1 = 'k,r,a,y,a,ṇ,ā,d,dh,a,r,a,ṇ,ā,t,y,ā,c,ñ,ā,y,āḥ'.split(',');
//const s2 = 'bh,a,r,a,ṇ,ā,d,a,p,a,h,a,r,a,ṇ,ā,t,y,ā,c,ñ,a,y,ā'.split(',');

const strs = [
    'maṇinā vārtta māṇviṉait tēra',
    'maṇinā yātta māṇviṉait tēri',
    'ārthisārttho pahāram |',
    'samārtthisārthaḥ | hāraḥ'
    ];

for (const str of strs) {
    const f = filterAll(str);
    
    const splits = [
        charSplit(f[0]),
        graphemeSplit(f[0]),
        aksaraSplit(f[0]),
        f[0].split(/(\s+)/g)
    ];
    
    const deepjoin = (a) => a.map(b => Array.isArray(b) ? b.join('') : b);

    const tests = splits.map(g => {
        const filters = JSON.parse(JSON.stringify(f[1]));
        const u = unfilterAll(deepjoin(g),filters);
        return u.join('') === str;
    });

    for(const test of tests)
        if(test === false)
            console.log(`Failed: ${str}`);
    console.log(`Passed: ${str}`);
}
