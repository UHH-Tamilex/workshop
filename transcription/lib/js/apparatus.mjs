const nextSibling = (node) => {
    let start = node;
    while(start) {
        let sib = start.nextSibling;
        if(sib) return sib;
        else start = start.parentElement; 
    }
    return false;
};

const nextTextNode = (start) => {
    let next = nextSibling(start);
    while(next) {
        if(next.nodeType === 3) return next;
        else next = next.firstChild || nextSibling(next);
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
    /*
    const walk = document.createTreeWalker(container,NodeFilter.SHOW_ELEMENT,null,false);
    if(walk.nextNode()) return true;
    return false;
    */
};

const getNextNode = function(node,skipKids = false) {
    if(node.firstChild && !skipKids)
        return node.firstChild;
    while(node) {
        if(node.nextSibling) return node.nextSibling;
        node = node.parentNode;
    }
    return null;
};

var Transliterate;
const setTransliterator = (obj) => Transliterate = obj;

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
            highlightcoords(targ.dataset.corresp,left);
            if(document.getElementById('transbutton').lang === 'en') {
                Transliterate.refreshCache(left);
                Transliterate.activate(left);
            }
        }
        else {
            const allright = [...par.querySelectorAll(':scope > .app > .lem')];
            const pos = allright.indexOf(targ);
            const allleft = left.querySelectorAll('.lem-inline');
            allleft[pos].classList.add('highlit');
        }
    },
};

const textPosInElement = (el,pos) => {
    const walker = document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
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
    return [cur,cur.data.length];
};

const highlightcoords = (coords,target) => {
    const positions = coords.split(',');
    const range = document.createRange();

    /*
    const walker = document.createTreeWalker(target,NodeFilter.SHOW_TEXT);
    let start = 0;
    let started = false;
    while(walker.nextNode()) {
        const cur = walker.currentNode;
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
    }
    */
    const walker = document.createTreeWalker(target,NodeFilter.SHOW_ALL);
    let start = 0;
    let oldstart = 0;
    let started = false;
    let cur = walker.nextNode();
    while(cur) {
        if(cur.nodeType === 1) {
            if(!cur.myOldContent) {
                cur = walker.nextNode();
                continue;
            }
            const clean = cur.myOldContent.textContent.replaceAll('\u00AD','');
            const newclean = cur.textContent.replaceAll('\u00AD','');
            if(clean.length === newclean.length) {
                cur = walker.nextNode();
                continue;
            }
            const oldend = oldstart + clean.length;
            const newend = start + clean.length;
            if(!started && positions[0] <= oldend) {
                const realpos = countpos(cur.myOldContent.textContent,positions[0]-oldstart);
                const [textnode, textnodepos] = textPosInElement(cur,realpos);
                range.setStart(textnode,textnodepos);
                started = true;
            }
            if(positions[1] <= oldend) {
                const realpos = countpos(cur.myOldContent.textContent,positions[1]-oldstart);
                const [textnode, textnodepos] = textPosInElement(cur,realpos);
                range.setEnd(textnode,textnodepos);
                break;
            }
            start = newend;
            oldstart = oldend;
            cur = walker.nextSibling();
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
    if(range.startOffset === range.startContainer.data.length) {
        // move to the beginning of the next text node
        range.setStart(nextTextNode(range.startContainer),0);
        // if there is no next text node something is wrong
    }
    if(!findEls(range))
        highlightrange(range);
    else {
        const toHighlight = [];
        const start = (range.startContainer.nodeType === 3) ?
            range.startContainer :
            range.startContainer.childNodes[range.startOffset];
   
        const end = (range.endContainer.nodeType === 3) ?
            range.endContainer :
            range.endContainer.childNodes[range.endOffset-1];
  
        if(start.nodeType === 3 && range.startOffset !== start.length) {
            const textRange = start.ownerDocument.createRange();
            textRange.setStart(start,range.startOffset);
            textRange.setEnd(start,start.length);
            toHighlight.push(textRange);
        }

        for(let node = getNextNode(start); node !== end; node = getNextNode(node)) {
            if(node.nodeType === 3) {
                const textRange = node.ownerDocument.createRange();
                textRange.selectNode(node);
                toHighlight.push(textRange);
            }
        }

        if(end.nodeType === 3 && range.endOffset > 0) {
            const textRange = end.ownerDocument.createRange();
            textRange.setStart(end,0);
            textRange.setEnd(end,range.endOffset);
            toHighlight.push(textRange);
        }
        for(const hiNode of toHighlight)
            highlightrange(hiNode);
    }
    target.normalize();
};

const highlightrange = (range) => {
    const lemma = document.createElement('span');
    lemma.className = 'highlit temporary';
    lemma.append(range.extractContents());
    range.insertNode(lemma);
    lemma.lang = lemma.parentElement.lang;
};

const unhighlight = (targ) => {
    const par = targ.closest('div.wide').querySelector('.text-block'); // or .edition?
    if(!par) return;
    const transbutton = document.getElementById('transbutton');
    if(transbutton.style.display === 'block' && transbutton.lang === 'en') {
        Transliterate.revert(par);
    }
    //for(const h of par.querySelectorAll('.highlit')) {
    for(const h of document.querySelectorAll('.highlit')) {
        if(h.classList.contains('temporary')) {
            while(h.firstChild)
                h.after(h.firstChild);
            h.remove();
        }
        else h.classList.remove('highlit');
    }
    par.normalize();
    if(transbutton.style.display === 'block')
        Transliterate.refreshCache(par);
    if(transbutton.style.display === 'block' && transbutton.lang === 'en') {
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
};

const init = () => {
    document.addEventListener('mouseover',Events.docMouseover);
    document.addEventListener('mouseout',Events.docMouseout);
};

const ApparatusViewer = {
    init: init,
    setTransliterator: setTransliterator
};

export { ApparatusViewer };
