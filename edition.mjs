import { Transliterate } from './lib/js/transliterate.mjs';
import { GitHubFunctions } from './lib/js/githubfunctions.mjs';
import { ApparatusViewer } from './lib/js/apparatus.mjs';
import {addwordsplit} from './debugging/splits.mjs';
import './lib/js/tooltip.mjs';
//import { tamilize, iastToTamil } from './transliterate.mjs';

var Debugging = false;

const lookup = (e) => {
//if(e.target.nodeName === 'RT' || e.target.classList?.contains('word')) {
    const word = e.target.closest('.word');
    if(word) {
        //const clean = e.target.dataset.norm.trim();
        //const clean = word.querySelector('.anno-inline span').textContent;
        const clone = word.cloneNode(true);
        for(const pc of clone.querySelectorAll('.invisible'))
            pc.remove();
        const clean = clone.textContent.replaceAll('\u00AD','');
        window.open(`https://dsal.uchicago.edu/cgi-bin/app/tamil-lex_query.py?qs=${clean}&amp;searchhws=yes&amp;matchtype=exact`,'lexicon',/*'height=500,width=500'`*/);
    }
};

const cleanup = (doc) => {
    const breakup = doc.querySelectorAll('.word br');
    for(const b of breakup) {
        const next = b.nextSibling;
        const par = b.closest('.word');
        if(next) {
            const nextword = par.nextElementSibling;
            if(!nextword.dataset.norm) nextword.dataset.norm = visibleText(nextword);
            nextword.prepend(next);
        }
        par.after(b);
    }
};

const visibleText = (node) => {
    const clone = node.cloneNode(true);
    const walker = document.createTreeWalker(clone,NodeFilter.SHOW_ELEMENT);
    while(walker.nextNode()) {
        const cur = walker.currentNode;
        if(cur.classList.contains('anno-inline') || cur.style.display === 'none') cur.remove();
    }
    return clone.textContent;
};

const apparatusswitch = (e) => {
    const blocks = document.querySelectorAll('.wide');
    const target = document.getElementById('apparatusbutton');
    if(target.dataset.anno === 'apparatus of variants') {
        for(const block of blocks) {
            const trans = block.querySelector('.text-block.translation');
            if(trans) trans.style.display = 'none';
            const app = block.querySelector('.apparatus-block');
            if(app) app.style.display = 'block';
        }
        document.getElementById('translationsvg').style.display = 'revert';
        document.getElementById('apparatussvg').style.display = 'none';
        target.dataset.anno = 'translation';
    }
    else {
        for(const block of blocks) {
            const trans = block.querySelector('.text-block.translation');
            if(trans) trans.style.display = 'block';
            const app = block.querySelector('.apparatus-block');
            if(app) app.style.display = 'none';
        }
        document.getElementById('translationsvg').style.display = 'none';
        document.getElementById('apparatussvg').style.display = 'revert';
        target.dataset.anno = 'apparatus of variants';
    }
};

const wordsplit = (e) => {
    const target = document.getElementById('wordsplitbutton');
    const script = document.getElementById('transbutton').lang === 'en' ? 'taml' : 'iast';
    const standoffs = document.querySelectorAll('.standOff[data-type="wordsplit"]');
    if(target.dataset.anno === 'word-split text') {
        for(const standoff of standoffs) {
            const target = document.getElementById(standoff.dataset.corresp.replace(/^#/,''))?.querySelector('.edition');
        
            if(document.getElementById('transbutton').lang === 'en') {
                Transliterate.revert(target);
            }
            applymarkup(standoff);
            Transliterate.refreshCache(target);
            if(document.getElementById('transbutton').lang === 'en') {
                Transliterate.activate(target);
            }
        }
        document.getElementById('metricalsvg').style.display = 'revert';
        document.getElementById('wordsplitsvg').style.display = 'none';
        target.dataset.anno = 'metrical text';
    }
    else {
        for(const standoff of standoffs) {
            const target = document.getElementById(standoff.dataset.corresp.replace(/^#/,''))?.querySelector('.edition');
            if(document.getElementById('transbutton').lang === 'en')
                Transliterate.revert(target);
            removemarkup(standoff);
            Transliterate.refreshCache(target);
            if(document.getElementById('transbutton').lang === 'en') {
                Transliterate.activate(target);
            }
        }
        document.getElementById('metricalsvg').style.display = 'none';
        document.getElementById('wordsplitsvg').style.display = 'revert';
        target.dataset.anno = 'word-split text';
    }
};

const countpos = (str, pos) => {
    if(pos === 0) return 0;
    let realn = 0;
    for(let n=1;n<=str.length;n++) {
       if(str[n] !== '\u00AD')
           realn = realn + 1;
        if(realn === pos) return n;
    }
};
const nextSibling = (node) => {
    let start = node;
    while(start) {
        let sib = start.nextSibling;
        if(sib) return sib;
        else start = start.parentElement; 
    }
    return false;
};

const nextTextNode = (start,strand) => {
    let next = nextSibling(start);
    while(next) {
        if(next.nodeType === 3) return next;
        else {
            if(next.parentNode.classList.contains('choice') &&
               [...next.parentNode.children].indexOf(next) !== strand) {
                next = nextSibling(next,strand);
            }
            else next = next.firstChild || nextSibling(next);
        }
    }
    return null;
};

const realNextSibling = (walker) => {
    let cur = walker.currentNode;
    while(cur) {
        const sib = walker.nextSibling();
        if(sib) return sib;
        cur = walker.parentNode();
    }
    return null;
};

const applymarkup = (standoff) => {
    const target = document.getElementById(standoff.dataset.corresp.replace(/^#/,''))?.querySelector('.edition');
    if(!target) return;
    
    const fss = [...standoff.querySelectorAll('.fs')]
        .filter(fs => fs.dataset.corresp)
        .map(fs => {
            const pos = fs.dataset.corresp.split(',');
            const translation = fs.querySelector('[data-name="translation"]');
            const ret = {
                start: pos[0],
                end: pos[1],
                strand: fs.dataset.hasOwnProperty('select') ? parseInt(fs.dataset.select) : 0,
                lemma: fs.querySelector('[data-name="lemma"]'),
                duplicate: fs.dataset.rend === 'none',
            };
            if(translation) ret.translation = translation.cloneNode(true);
            return ret;
    });
    const strandpositions = new Map();
    for(const fs of fss) {
        const strand = fs.strand;
        if(!strandpositions.has(strand))
            strandpositions.set(strand,[]);
        
        const posset = strandpositions.get(strand);
        if(!posset.includes(fs.start)) posset.push(fs.start);
        if(!posset.includes(fs.end)) posset.push(fs.end);
    }
    
    const posmaps = [];
    const starts = [];
    for(let n=0;n<strandpositions.size;n++)  {
        posmaps.push(new Map());
        starts.push(0);
    }

    const walker = document.createTreeWalker(target,NodeFilter.SHOW_ALL);
    let cur = walker.nextNode();
    /*
    if(target.closest('.lg')) { // skip spaces at the beginning
        while(cur.nodeType !== 1 || !cur.classList.contains('l'))
            cur = walker.nextNode();
    }
    */
    while(cur) {
        if(cur.nodeType === 1) {
            if(cur.parentNode.classList.contains('choice')) {
                const strand = [...cur.parentNode.children].indexOf(cur);
                const walker2 = document.createTreeWalker(cur,NodeFilter.SHOW_TEXT);
                while(walker2.nextNode()) {
                    const cur2 = walker2.currentNode;
                    const clean = cur2.data.replaceAll('\u00AD','');
                    const end = starts[strand] + clean.length;
                    const positions = strandpositions.get(strand);
                    while(positions[0] <= end) {
                        const pos = positions.shift();
                        const realpos = countpos(cur2.data,pos-starts[strand]);
                        posmaps[strand].set(pos,{node: cur2, pos: realpos});
                    }
                    starts[strand] = end;
                }
                cur = realNextSibling(walker);
            }
            else cur = walker.nextNode();
        }
        else {
            const clean = cur.data.replaceAll('\u00AD','');
            for(const [strand,positions] of strandpositions) {
                const end = starts[strand] + clean.length;
                while(positions[0] <= end) {
                    const pos = positions.shift();
                    const realpos = countpos(cur.data,pos-starts[strand]);
                    posmaps[strand].set(pos,{node: cur, pos: realpos});
                }
                starts[strand] = end;
            }
            cur = walker.nextNode();
        }
    }
    const ranges = [];
    for(const fs of fss) {
        const strand = parseInt(fs.strand);
        const start = posmaps[strand].get(fs.start);
        const end = posmaps[strand].get(fs.end);
        const range = document.createRange();
        if(start.pos === start.node.data.length) {
            // move to the beginning of the next text node in the right strand
            range.setStart(nextTextNode(start.node,strand),0);
            // if there is no next text node something is wrong
        }
        else
            range.setStart(start.node,start.pos);
        
        range.setEnd(end.node,end.pos);
        ranges.push({range: range, fs: fs});
    }
    const lastTextNode = (par) => {
        const walker = document.createTreeWalker(par,NodeFilter.SHOW_TEXT);
        let ret;
        while(walker.nextNode()) ret = walker.currentNode;
        return ret;
    };

    const clipEnd = (range) => {
        const clip = new Range();
        clip.setStart(range.range.endContainer,0);
        clip.setEnd(range.range.endContainer,range.range.endOffset);
        const toremove = document.createElement('span');
        toremove.className = 'placeholder';
        toremove.myOldContent = clip.extractContents();
        toremove.dataset.myOldContent = toremove.myOldContent.textContent;
        clip.insertNode(toremove);
    };
    for(const word of ranges) {
        if(word.range.startContainer.data.length === word.range.startOffset) {
            // move start past the previous range that was surrounded
            const nextsib = word.range.startContainer.nextSibling.nextSibling;
            word.range.setStart(nextsib,0);
        }
        const startseg = word.range.startContainer.parentNode.closest('.choice > span');
        const endseg = word.range.endContainer.parentNode.closest('.choice > span');
        if(startseg && endseg !== startseg) {
            if(word.range.endContainer.data.length !== 0)  {
                // clip the end bit if it hasn't been clipped already
                clipEnd(word);
            }

            const lasttext = lastTextNode(startseg);
            word.range.setEnd(lasttext,lasttext.data.length);
        }
        else if(endseg && !startseg) {
            if(word.range.endContainer.data.length !== 0)  {
                clipEnd(word);
            }

            word.range.setEnd(word.range.startContainer,word.range.startContainer.data.length);
        }
        else {
            const startl = word.range.startContainer.parentNode.closest('.l');
            const endl = word.range.endContainer.parentNode.closest('.l');
            if(startl !== endl) {
                clipEnd(word);
                word.range.setEnd(word.range.startContainer,word.range.startContainer.data.length);
            }
        }
        /*
        const ruby = document.createElement('ruby');
        //word.range.surroundContents(ruby);
        
        ruby.appendChild(word.range.extractContents());
        word.range.insertNode(ruby);
        
        const br = ruby.querySelector('br');
        if(br) ruby.after(br);
        
        const rt = document.createElement('rt');
        rt.append(word.fs.lemma);
        rt.append('\u200B');
        ruby.appendChild(rt);
        */
        const span = document.createElement('span');
        span.className = 'word split';
        
        span.myOldContent = word.range.extractContents();
        span.dataset.myOldContent = span.myOldContent.textContent;
        word.range.insertNode(span);

        span.lang = span.parentNode.lang;
        
        /*
        const br = word.myOldContent.querySelector('br');
        if(br) {
            const newbr = br.cloneNode(true);
            newbr.classList.add('toremove');
            word.after(newbr);
        }
        */
        const clone = word.fs.lemma.cloneNode(true);
        while(clone.firstChild) {
            if(clone.firstChild.nodeType === 1)
                clone.firstChild.lang = 'ta-Latn-t-ta-Taml'; // there's probably a better way
            span.append(clone.firstChild);
        }
        if(word.fs.duplicate)
            span.style.display = 'none';
        if(word.fs.translation) 
            span.dataset.anno = word.fs.translation.textContent;
    }
};

const removemarkup = (standoff) => {
    const target = document.getElementById(standoff.dataset.corresp.replace(/^#/,''));
    if(!target) return;

    for(const toremove of target.querySelectorAll('.toremove')) {
        while(toremove.firstChild)
            toremove.after(toremove.firstChild);
        toremove.remove();
    }
    for(const word of target.querySelectorAll('span.word, span.placeholder')) {
        word.replaceWith(word.myOldContent);
    }
    target.normalize();
};

const go = () => {
    const scripttag = document.getElementById('editionscript');
    if(scripttag.dataset.debugging) {
        Debugging = true;
        ApparatusViewer.debug();
    }

    const recordcontainer = document.getElementById('recordcontainer');
    Transliterate.init(recordcontainer);

    for(const t of recordcontainer.querySelectorAll('.teitext > div > div:first-child')) {
        //tamilize(t);
        for(const b of t.querySelectorAll('ruby br')) {
            b.parentElement.after(b.nextSibling);
            b.parentElement.after(b);
        }
    }
    recordcontainer.querySelector('.teitext').addEventListener('click',lookup);
    
    if(document.querySelector('.standOff[data-type="wordsplit"]')) {
        const wordsplitbutton = document.getElementById('wordsplitbutton');
        wordsplitbutton.style.display = 'block';
        wordsplitbutton.addEventListener('click',wordsplit);
    }
    else if(Debugging) {
        const wordsplitbutton = document.getElementById('wordsplitbutton');
        wordsplitbutton.style.display = 'block';
        wordsplitbutton.style.border = '1px dashed grey';
        wordsplitbutton.dataset.anno = 'add word splits';
        wordsplitbutton.querySelector('svg').style.stroke = 'grey';
        const uploader = document.createElement('input');
        uploader.type = 'file';
        uploader.addEventListener('change',addwordsplit);
        wordsplitbutton.addEventListener('click',() => {uploader.click();});
    }
    

    const lineview = document.querySelector('.line-view-icon');

    if(document.querySelector('.translation')) {
        const apparatusbutton = document.getElementById('apparatusbutton');
        apparatusbutton.style.display = 'block';
        apparatusbutton.addEventListener('click',apparatusswitch);
    }
    else {
        for(const app of document.querySelectorAll('.apparatus-block'))
            app.style.display = 'block';
    }
    //wordsplit({target: analyzebutton});
    //cleanup(document);
    
    lineview.style.display = 'none';

    if(document.querySelector('.app')) {
        ApparatusViewer.init();
        ApparatusViewer.setTransliterator(Transliterate);
    }

    GitHubFunctions.latestCommits();
};

window.addEventListener('load',go);

