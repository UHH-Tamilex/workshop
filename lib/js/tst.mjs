import { Transliterate } from './transliterate.mjs';
import { AlignmentViewer } from './alignment.mjs';
import { ApparatusViewer } from './apparatus.mjs';
import { MiradorWrapper } from './miradorwrapper.mjs';
import { GitHubFunctions } from './githubfunctions.mjs';
import './tooltip.mjs';

const _state = Object.seal({
    manifest: null,
    mirador: null,
});

const init = function() {

    const params = new URLSearchParams(window.location.search);
    // load image viewer if facsimile available
    const viewer = document.getElementById('viewer');

    const corresps = params.getAll('corresp');
    let facs,scrollel;
    if(corresps.length > 0) {
        scrollel = findCorresp(corresps);
        if(scrollel) {
            const res = findFacs(scrollel);
            if(res) facs = res.split(':')[0] - 1;
        }
    }
    if(viewer) {
        _state.manifest = viewer.dataset.manifest;
        const param = params.get('facs');
        const page = facs || (param ? parseInt(param) - 1 : null);
        if(_state.mirador)
            MiradorWrapper.refresh(_state.mirador,viewer.dataset.manifest, page || viewer.dataset.start);
        else
            _state.mirador = MiradorWrapper.start('viewer',viewer.dataset.manifest,page || viewer.dataset.start);
    }
    
    // initialize events for the record text
    const recordcontainer = document.getElementById('recordcontainer');

    cleanLb(recordcontainer);

    Transliterate.init(recordcontainer);
    
    // start all texts in diplomatic view
    for(const l of recordcontainer.querySelectorAll('.line-view-icon')) {
        const teitext = l.closest('.teitext');
        const lb = teitext?.querySelector('.lb, .pb');
        if(!lb)
            l.style.display = 'none';
        else {
            if(teitext.classList.contains('edition'))
                l.classList.add('diplo'); // lineView will then switch it to paragraph mode
            lineView(l);
        }
    }
    for(const excerpt of recordcontainer.querySelectorAll('.excerpt')) {
        for(const el of excerpt.querySelectorAll('p,.lg,.l,.ab,.caesura'))
            el.classList.add('diplo');
    }

    // check for GitHub commit history
    GitHubFunctions.latestCommits();

    if(document.querySelector('.app'))
        ApparatusViewer.init();

    recordcontainer.addEventListener('click',events.docClick);
    recordcontainer.addEventListener('copy',events.removeHyphens);

    if(scrollel) scrollTo(scrollel);

};

const findCorresp = (corresps) => {
    const str = corresps.map(c => `[data-corresp='${c}']`).join(' ');
    const el = document.querySelector(str);
    return el || false;
};

const scrollTo = (el) => {

    el.scrollIntoView({behaviour: 'smooth', block: 'center'});
    el.classList.add('highlit');
    document.addEventListener('click',() => {
       el.classList.remove('highlit'); 
    },{once: true});
};

const findFacs = (startel) => {

    const prev = (e)  => {
        let prevEl = e.previousElementSibling;
        if(prevEl) {
            while(prevEl.lastElementChild)
                prevEl = prevEl.lastElementChild;
            return prevEl;
        }
   
        let par = e.parentNode;
        while(par && !par.classList?.contains('teitext')) {
            let parPrevEl = par.previousElementSibling;
            if(parPrevEl) {
                while(parPrevEl.lastElementChild)
                    parPrevEl = parPrevEl.lastElementChild;
                return parPrevEl;
            }
            par = par.parentNode;
        }
        return false;
    };
    
    const forwardFind = (e) => {
        const walker = document.createTreeWalker(e,NodeFilter.SHOW_ALL);
        while(walker.nextNode()) {
            const cur = walker.currentNode;
            if(cur.nodeType === 3 && cur.data.trim() !== '') 
                return false;
            else if(cur.nodeType === 1 && 'loc' in cur.dataset) 
                return cur.dataset.loc;
        }
            
    };
    
    const found = forwardFind(startel);
    if(found) return found;

    var p = prev(startel);
    while(p) {
        if(!p) return '';
        if('loc' in p.dataset) {
            return p.dataset.loc;
        }
        p = prev(p);
    }
    return false;
};

const events = {

    docClick: function(e) {
        const locel = e.target.closest('[data-loc]');
        if(locel) {
            MiradorWrapper.jumpTo(_state.mirador,_state.manifest,locel.dataset.loc);
            return;
        }
        const lineview = e.target.closest('.line-view-icon');
        if(lineview) {
            lineView(lineview);
            return;
        }
        const apointer = e.target.closest('.alignment-pointer');
        if(apointer) {
            e.preventDefault();
            AlignmentViewer.viewer(apointer.href);
            return;
        }

        if(e.target.dataset.hasOwnProperty('scroll')) {
            e.preventDefault();
            const el = document.getElementById(e.target.href.split('#')[1]);
            el.scrollIntoView({behavior: 'smooth', inline:'end'});
        }
    },
    removeHyphens: function(ev) {
        ev.preventDefault();
        const hyphenRegex = new RegExp('\u00AD','g');
        var sel = window.getSelection().toString();
        sel = ev.target.closest('textarea') ? 
            sel :
            sel.replace(hyphenRegex,'');
        (ev.clipboardData || window.clipboardData).setData('Text',sel);
    },
};


const cleanLb = (par) => {
    const lbs = par.querySelectorAll('[data-nobreak]');
    for(const lb of lbs) {
        const prev = lb.previousSibling;
        if(prev && prev.nodeType === 3)
            prev.data = prev.data.trimEnd();
    }
};


const lineView = function(icon) {
    const par = icon.closest('.teitext');
    if(icon.classList.contains('diplo')) {
        par.classList.remove('diplo');

        const els = par.querySelectorAll('.diplo');
        for(const el of els)
            el.classList.remove('diplo');
       /* 
        if(document.getElementById('record-fat')) {
            const apps = par.querySelectorAll('.app');
            for(const app of apps)
                app.style.display = 'initial';
        }
        */
        icon.title = 'diplomatic view';
    }
    else {
        icon.classList.add('diplo');
        par.classList.add('diplo');
        
        const els = par.querySelectorAll('p,.para,div.lg,div.l,div.ab,.pb,.lb,.cb,.caesura,.milestone');
        for(const el of els)
            el.classList.add('diplo');
        /*
        if(document.getElementById('record-fat')) {
            const apps = par.querySelectorAll('.app');
            for(const app of apps)
                app.style.display = 'none';
        } 
        */
        icon.title = 'paragraph view';
    }

};
//window.addEventListener('load',init);

const TSTViewer = Object.freeze({
    init: init,
    newMirador: MiradorWrapper.start,
    killMirador: (which) => {
        const win = which || _state.mirador;
        if(win) MiradorWrapper.kill(win);
    },
    getMirador: () => _state.mirador,
    getMiradorCanvasId: MiradorWrapper.getMiradorCanvasId,
    refreshMirador: MiradorWrapper.refresh,
    jumpToId: MiradorWrapper.jumpToId,
    setAnnotations: MiradorWrapper.setAnnotations
});

export { TSTViewer };
