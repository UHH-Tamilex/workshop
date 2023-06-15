import needlemanWunsch from './needlemanwunsch.mjs';

var Transliterate;
const setTransliterator = (obj) => Transliterate = obj;
var Debugging = false;

const nextSibling = (node) => {
    let start = node;
    while(start) {
        const sib = start.nextSibling;
        if(sib) return sib;
        else start = start.parentElement; 
    }
    return null;
};

const nextTextNode = (start) => {
    let next = nextSibling(start);
    while(next) {
        if(next.nodeType === 3) return next;
        else next = next.firstChild || nextSibling(next);
    }
    return null;
};

const prevSibling = (node) => {
    let start = node;
    while(start) {
        const sib = start.previousSibling;
        if(sib) return sib;
        else start = start.parentElement; 
    }
    return null;
};

const prevTextNode = (start) => {
    let prev = prevSibling(start);
    while(prev) {
        if(prev.nodeType === 3) return prev;
        else prev = prev.lastChild || prevSibling(prev);
    }
    return null;
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

const findEls = (range) => {
    const container = range.cloneContents();
    if(container.firstElementChild) return true;
    return false;
};

const highlight = {
    inline(targ) {
        const par = targ.closest('div.text-block');
        if(!par) return;

        const allleft = [...par.querySelectorAll('.lem-inline')];
        const pos = allleft.indexOf(targ);
        const right = par.parentElement.querySelector('.apparatus-block');
        const allright = right.querySelectorAll(':scope > .app > .lem');
        allright[pos].classList.add('highlit');
    },
    apparatus(targ) {
        const par = targ.closest('div.apparatus-block');
        if(!par) return;
        const left = par.parentElement.querySelector('.text-block'); // or .edition?
        if(targ.dataset.corresp) {
            if(document.getElementById('transbutton').lang === 'en') {
                Transliterate.revert(left);
            }
            highlightcoords(targ,left);
            if(document.getElementById('transbutton').lang === 'en') {
                Transliterate.refreshCache(left);
                Transliterate.activate(left);
            }
        }
        else {
            const allright = [...par.querySelectorAll(':scope > .app > .lem')];
            const pos = allright.indexOf(targ);
            const allleft = left.querySelectorAll('.lem-inline');
            if(allleft.length !== 0)
               allleft[pos].classList.add('highlit');
        }
    },
};

const suggestLemmata = (lemma, par) => {
    if(document.getElementById('transbutton').lang === 'en') {
        Transliterate.revert(par);
    }
    const haystack = par.textContent.replaceAll('\u00AD','');
    const re = new RegExp(lemma.dataset.text.replaceAll(/\s/g,'\\s+'),'g');
    let res = re.exec(haystack);
    const coords = [];
    while(res !== null) {
        coords.push([res.index,res.index + res[0].length]);
        res = re.exec(haystack);
    }
    const ranges = [];
    for(const coord of coords) {
        ranges.push([highlightcoord(coord, lemma, par, permalightrange),coord]);
    }
    if(document.getElementById('transbutton').lang === 'en') {
        Transliterate.refreshCache(par);
        Transliterate.activate(par);
    }
    for(const range of ranges) showRangeCoords(...range);
};

const getOffset = (el) => {
    const rect = el.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {top: rect.top + scrollTop, left: rect.left + scrollLeft};
};
const showRangeCoords = (startel,coord) => {
        const placement = getOffset(startel);
        const tBox = document.createElement('div');
        const tBoxDiv = document.createElement('div');
        tBox.className = 'coord-suggestion';
        document.body.appendChild(tBox);

        tBox.style.top = (placement.top - 35) + 'px';
        tBox.style.left = placement.left + 'px';
        tBoxDiv.append(coord.join(','));
        tBox.appendChild(tBoxDiv);

        tBox.animate([
            {opacity: 0 },
            {opacity: 1, easing: 'ease-in'}
            ], 200);
};
const textPosInElement = (el,pos) => {
    const walker = document.createTreeWalker(el,NodeFilter.SHOW_TEXT, { acceptNode() {return NodeFilter.FILTER_ACCEPT;}});
    let start = 0;
    let cur = walker.currentNode;
    while(walker.nextNode()) {
        cur = walker.currentNode;
        const clean = cur.data.replaceAll('\u00AD','');
        const end = start + clean.length;
        if(pos <= end)
            return [cur,countpos(cur.data,pos-start)];
        start = end;
    }
    if(!cur.data) // if there is no text node
        return [nextTextNode(cur),0];
    else return [cur,cur.data.length];
};

const rangeFromCoords = (positions, lem, target) => {
    const range = document.createRange();

    const realNextSibling = (walker) => {
        let cur = walker.currentNode;
        while(cur) {
            const sib = walker.nextSibling();
            if(sib) return sib;
            cur = walker.parentNode();
        }
        return null;
    };

    const walker = document.createTreeWalker(target,NodeFilter.SHOW_ALL, { acceptNode() {return NodeFilter.FILTER_ACCEPT;}});
    let start = 0;
    let oldstart = 0;
    let started = false;
    let skip = null;
    let cur = walker.nextNode();
    /*
    if(target.closest('.lg')) { // skip spaces at the beginning
        while(cur.nodeType !== 1 || !cur.classList.contains('l'))
            cur = walker.nextNode();
    }
    */
    let startToAdjust = null;
    let endToAdjust = null;
    while(cur) {
        if(cur.nodeType === 1) {
            
            if(cur.nodeName === 'SPAN' && 
               cur.parentNode.classList.contains('choice') &&
               cur !== cur.parentNode.firstChild) {

                cur = realNextSibling(walker);
                continue;
            }

            if(!cur.myOldContent) {
                cur = walker.nextNode();
                continue;
            }
            const clean = cur.myOldContent.textContent.replaceAll('\u00AD','');
            
            const newclean = cur.textContent.replaceAll('\u00AD','');
            /*
            if(clean.length === newclean.length) { 
                // skips setting startToAdjust/endToAdjust
                // this can cause problems if the word split adds a character and removes a character, making the string length the same
                cur = walker.nextNode();
                continue;
            }
            */

            const oldend = oldstart + clean.length;
            const newend = start + clean.length;
            if(!started && positions[0] <= oldend) {
                const [textnode, textnodepos] = textPosInElement(cur,positions[0]-oldstart);
                startToAdjust = true;
                range.setStart(textnode,textnodepos);
                started = true;
            }
            if(positions[1] <= oldend) {
                const [textnode, textnodepos] = textPosInElement(cur,positions[1]-oldstart);
                endToAdjust = true;
                range.setEnd(textnode,textnodepos);
                break;
            }
            start = newend;
            oldstart = oldend;
            cur = realNextSibling(walker);
        }
        else if(cur.nodeType === 3) {
            const clean = cur.data.replaceAll('\u00AD','');
            const end = start + clean.length;
            if(!started && positions[0] <= end) {
                const realpos = countpos(cur.data,positions[0]-start);
                range.setStart(cur,realpos);
                started = true;
            }
            if(positions[1] <= end) {
                const realpos = countpos(cur.data,positions[1]-start);
                range.setEnd(cur,realpos);
                break;
            }
            start = end;
            oldstart = oldstart + clean.length;
            cur = walker.nextNode();
        }
    }
    
    if(startToAdjust || endToAdjust) 
        // if start/end containers are in word splits
        realignToWordSplits(range,lem,startToAdjust,endToAdjust);
    if(range.startOffset === range.startContainer.data.length) {
        // move to the beginning of the next text node
        range.setStart(nextTextNode(range.startContainer),0);
        // if there is no next text node something is wrong
    }
    return range;
};

const realignToWordSplits = (range,lem,startSeg,endSeg) => {
    if(startSeg && range.startOffset > 0)
        range.setStart(range.startContainer,range.startOffset-1);
    if(endSeg && range.endOffset < range.endContainer.data.length)
        range.setEnd(range.endContainer,range.endOffset+1);
    const lemtext = lem.dataset.text;

    const aligned = needlemanWunsch(range.toString(),lemtext);
    const startShiftLeft = countGaps(aligned[0],0);
    const startShiftRight = countGaps(aligned[1],0);
    const endShiftRight = countGaps(aligned[0],1);
    const endShiftLeft = countGaps(aligned[1],1);
   
    const newstart = range.startOffset - startShiftLeft - startShiftRight;
    if(newstart < 0) {
        let newcontainer = prevTextNode(range.startContainer);
        while(newcontainer.data === '' || 
              newcontainer.data === ' ' ||
            wrongSeg(newcontainer)) {
            newcontainer = prevTextNode(newcontainer);
        }
        range.setStart(newcontainer,newcontainer.data.length+newstart);
    }
    else
        range.setStart(range.startContainer,newstart);
    
    const newend = range.endOffset - endShiftLeft + endShiftRight;
    if(newend > range.endContainer.data.length) {
        let newcontainer = nextTextNode(range.endContainer);
        while(newcontainer.data === '' || 
              newcontainer.data === ' ' ||
              wrongSeg(newcontainer)) {
            newcontainer = nextTextNode(newcontainer);
        }
        range.setEnd(newcontainer,newend - range.endOffset);
    }
    else
        range.setEnd(range.endContainer,newend);
};

const countGaps = (arr,dir = 0) => {
   let count = 0;
   const clone = dir ? [...arr].reverse() : [...arr];
   for(const c of clone) {
       if(c === '') count += 1;
       else break;
   }
   return count;
};

const highlightcoords = (lem,target) => {
    const multiple = lem.dataset.corresp.split(';').reverse();
    for(const coord of multiple) highlightcoord(coord.split(','), lem, target);
};

const wrongSeg = (txtnode) => {
    const el = txtnode.parentNode.closest('.choice > span');
    return el && el !== el.parentNode.firstChild;
};

const highlightrange = (range,classname = 'highlit') => {
    const lemma = document.createElement('span');
    lemma.className = `${classname} temporary`;
    lemma.append(range.extractContents());
    range.insertNode(lemma);
    lemma.lang = lemma.parentElement.lang;
    return lemma;
};

const permalightrange = (range) => highlightrange(range,'permalit');

const highlightcoord = (positions, lem, target, highlightfn = highlightrange) => {
    const range = rangeFromCoords(positions, lem, target);
    if(!findEls(range))
        return highlightfn(range);

    const toHighlight = [];
    const start = (range.startContainer.nodeType === 3) ?
        range.startContainer :
        range.startContainer.childNodes[range.startOffset];

    const end = (range.endContainer.nodeType === 3) ?
        range.endContainer :
        range.endContainer.childNodes[range.endOffset-1];

    if(start.nodeType === 3 && range.startOffset !== start.length && !wrongSeg(start)) {
        const textRange = document.createRange();
        textRange.setStart(start,range.startOffset);
        textRange.setEnd(start,start.length);
        toHighlight.push(textRange);
    }
    
    const getNextNode = (n) => n.firstChild || nextSibling(n);

    for(let node = getNextNode(start); node !== end; node = getNextNode(node)) {
        if(node.nodeType === 3 && !wrongSeg(node)) {
            const textRange = document.createRange();
            textRange.selectNode(node);
            toHighlight.push(textRange);
        }
    }

    if(end.nodeType === 3 && range.endOffset > 0 && !wrongSeg(end)) {
        const textRange = document.createRange();
        textRange.setStart(end,0);
        textRange.setEnd(end,range.endOffset);
        toHighlight.push(textRange);
    }
    
    const firsthighlit = highlightfn(toHighlight.shift());

    for(const hiNode of toHighlight)
        highlightfn(hiNode);

    target.normalize();
    return firsthighlit;
};

const unhighlight = (targ) => {
    const highlit = /*par*/document.querySelectorAll('.highlit');
    if(highlit.length === 0) return;
    
    targ = targ ? targ.closest('div.wide') : highlit[0].closest('div.wide');
    const par = targ.querySelector('.text-block'); // or .edition?
    if(!par) return;
    if(document.getElementById('transbutton').lang === 'en') {
        Transliterate.revert(par);
    }
    for(const h of highlit) {
        if(h.classList.contains('temporary')) {
            while(h.firstChild)
                h.after(h.firstChild);
            h.remove();
        }
        else h.classList.remove('highlit');
    }
    par.normalize();
    Transliterate.refreshCache(par);
    if(document.getElementById('transbutton').lang === 'en') {
        Transliterate.activate(par);
    }
};

const unpermalight = () => {
    const highlit = /*par*/document.querySelectorAll('.permalit');
    if(highlit.length === 0) return;
    
    const targ = highlit[0].closest('div.wide');
    const par = targ.querySelector('.text-block'); // or .edition?
    if(!par) return;
    if(document.getElementById('transbutton').lang === 'en') {
        Transliterate.revert(par);
    }
    for(const h of highlit) {
        if(h.classList.contains('temporary')) {
            while(h.firstChild)
                h.after(h.firstChild);
            h.remove();
        }
        else h.classList.remove('permalit');
    }
    par.normalize();
    Transliterate.refreshCache(par);
    if(document.getElementById('transbutton').lang === 'en') {
        Transliterate.activate(par);
    }
};

const Events = { 
    docMouseover(e) {
        const lem_inline = e.target.closest('.lem-inline');
        if(lem_inline) highlight.inline(lem_inline);
        const lem = e.target.closest('.lem');
        if(lem) {
            highlight.apparatus(lem);
        }
    },

    docMouseout(e) {
        if(e.target.closest('.lem') ||
           e.target.closest('.lem-inline'))
            unhighlight(e.target);
    },
    docClick(e) {
        for(const tooltip of document.querySelectorAll('.coord-suggestion'))
            tooltip.remove();
        unpermalight(); 

        const targ = e.target.closest('.lemmalookup');
        if(!targ) return;
        const par = targ.closest('div.apparatus-block');
        if(!par) return;
        const left = par.parentElement.querySelector('.text-block');
        const lemma = targ.nextSibling;
        suggestLemmata(lemma,left);

    },
};

const init = () => {
    document.addEventListener('mouseover',Events.docMouseover);
    document.addEventListener('mouseout',Events.docMouseout);
    if(Debugging) document.addEventListener('click',Events.docClick);
};

const ApparatusViewer = {
    init: init,
    setTransliterator: setTransliterator,
    debug: () => Debugging = true
};

export { ApparatusViewer };
