import { Sanscript } from './sanscript.mjs';
import { viewPos } from './viewpos.mjs';
import Hypher from './hypher.mjs';
import { hyphenation_ta } from './ta.mjs';
import { hyphenation_ta_Latn } from './ta-Latn.mjs';
import { hyphenation_sa } from './sa.mjs';
import { hyphenation_hi } from './hi.mjs';

const Transliterate = (function() {
    const _state = Object.seal({
        hindic: Object.freeze(['mr','hi','gu','raj','bra']),
        scriptToIso: new Map([
            ['tamil','Taml'],
            ['bengali','Beng'],
            ['devanagari','Deva'],
            ['grantha','Gran'],
            ['malayalam','Mlym'],
            ['newa','Newa'],
            ['sarada','Shrd'],
            ['telugu','Telu'],
            ['nandinagari','Nand']
        ]),
        cachedtext: new Map(),
        parEl: null,
        hyphenator: {
            'ta-Taml': new Hypher(hyphenation_ta),
            'sa-Latn': new Hypher(hyphenation_sa),
            'ta-Latn': new Hypher(hyphenation_ta_Latn),
            'te-Latn': new Hypher(hyphenation_sa),
            'hi-Deva': new Hypher(hyphenation_hi)
        },
        defaultSanscript: null,
        reverselangs: new Map([
            ['ta-Latn-t-ta-Taml','ta-Taml-t-ta-Latn'],
            ['ta-Taml-t-ta-Latn','ta-Latn-t-ta-Taml'],
            ['te-Latn-t-te-Gran','te-Gran-t-te-Latn'],
            ['te-Gran-t-te-Latn','te-Latn-t-te-Gran'],
            /*
            ['mr-Latn-t-mr-Deva','mr-Deva-t-mr-Latn'],
            ['mr-Deva-t-mr-Latn','mr-Latn-t-mr-Deva'],
            ['hi-Latn-t-hi-Deva','hi-Deva-t-hi-Latn'],
            ['hi-Deva-t-hi-Latn','hi-Latn-t-hi-Deva']
            */
        ]),
        isoToScript: new Map(),
        availlangs: null,
        scriptnames: null,
        isonames: null,
        button: null
    });
    
    _state.availlangs = Object.freeze(['sa','ta','te',..._state.hindic]);

    _state.hindic.forEach(code => {
        _state.hyphenator[`${code}-Latn`] = _state.hyphenator['sa-Latn'];
        if(code !== 'hi')
            _state.hyphenator[`${code}-Deva`] = _state.hyphenator['hi-Deva'];
        _state.reverselangs.set(`${code}-Latn-t-${code}-Deva`,`${code}-Deva-t-${code}-Latn`);
        _state.reverselangs.set(`${code}-Deva-t-${code}-Latn`,`${code}-Latn-t-${code}-Deva`);
    });
    /*
    _state.hyphenator['mr-Latn'] = _state.hyphenator['sa-Latn'];
    _state.hyphenator['mr-Deva'] = _state.hyphenator['hi-Deva'];
    _state.hyphenator['hi-Latn'] = _state.hyphenator['sa-Latn'];
    */

    _state.scriptToIso.forEach((val,key) => _state.isoToScript.set(val,key));

    _state.scriptnames = new Set(_state.scriptToIso.keys());

    _state.isonames = new Set(_state.scriptToIso.values());
    for(const val of _state.isonames) {
        if(val === 'tamil') continue;
        _state.reverselangs.set(`sa-${val}-t-sa-Latn`,`sa-Latn-t-sa-${val}`);
        _state.reverselangs.set(`sa-Latn-t-sa-${val}`,`sa-${val}-t-sa-Latn`);
    }

    const events = {
        transClick(e) {
            const vpos = viewPos.getVP(_state.parEl);
            transliterator.toggle();
            viewPos.setVP(_state.parEl,vpos);
        },
    };

    const init = (par = document.body) => {

        // reset state
        _state.parEl = par; 
        if(!_state.parEl.lang) _state.parEl.lang = 'en';

        // find if there are any Tamil or Sanskrit passages
        const foundTamil = par.querySelector('[lang|="ta"]');
        const foundSanskrit = par.querySelector('[lang|="sa"]');
        if(!foundTamil && !foundSanskrit) return;

        if(foundSanskrit) {
            const scripttags = par.getElementsByClassName('record_scripts');
            const defaultSanscript = getSanscript(scripttags);
            if(!defaultSanscript && !foundTamil) {
                // hyphenate text even if no transliteration available
                const walker = document.createTreeWalker(par,NodeFilter.SHOW_ALL);
                prepTextWalker(walker);
                return;
            }
            else _state.defaultSanscript = defaultSanscript;
        }
      
        // prepare the text for transliteration
        prepText();

        // initialize button
        _state.button = document.getElementById('transbutton');
        button.init(foundTamil);
    };

    const button = {
        init(tamil) {
            if(tamil) {
                _state.button.textContent = to.tamil('a');
                _state.button.lang = 'ta-Taml';
            }
            else {
                _state.button.textContent = to[_state.defaultSanscript]('a');
                _state.button.lang = `sa-${_state.scriptToIso.get(_state.defaultSanscript)}`;
            }
            _state.button.addEventListener('click',events.transClick);
            _state.button.style.display = 'block';
        },
        revert() {
            _state.button.textContent = _state.button.dataset.oldcontent;
            _state.button.lang = _state.button.dataset.oldlang;
        },
        transliterate() {
            _state.button.dataset.oldcontent = _state.button.textContent;
            _state.button.dataset.oldlang = _state.button.lang;
            _state.button.textContent = 'A';
            _state.button.lang = 'en';
        },
    };

    const cache = {
        /** Caches the text of a text node, after having applied some transformations:
         *      1. Add appropriate non-breaking spaces,
         *      2. Hyphenate the text
         *      3. Transliterate the text if not in Latin script
         *  @param  {Node}   txtnode
         *  @return {String}         Hyphenated (and transliterated) text
         */
        set(txtnode) {
            // don't break before daṇḍa, or between daṇḍa and numeral/puṣpikā
            const nbsp = String.fromCodePoint('0x0A0');
            const txt = txtnode.data
                .replace(/\s+([\|।॥])/g,`${nbsp}$1`)
                .replace(/([\|।॥])\s+(?=[\d०१२३४५६७८९❈꣸৽৽])/g,`$1${nbsp}`);
            
            const getShortLang = (node) => {
                const s = node.lang.split('-t-');
                if(node.classList.contains('originalscript'))
                    return s[1];
                else
                    return s[0];
            };
            // hyphenate according to script (Tamil or Romanized)
            const shortlang = getShortLang(txtnode.parentNode);
            if(_state.hyphenator.hasOwnProperty(shortlang)) {
                const hyphenated = _state.hyphenator[shortlang].hyphenateText(txt);
                _state.cachedtext.set(txtnode,hyphenated);
                // convert Tamil (and others) to Roman
                if(shortlang === 'ta-Taml') {
                    return to.iast(hyphenated);
                }
                //else if(shortlang === 'hi-Deva' || shortlang === 'mr-Deva') {
                else if(shortlang.split('-')[1] === 'Deva') {
                    // TODO: also deal with 'sa-Beng', 'sa-Shar', etc.
                    return to.iast(hyphenated,'devanagari');
                }
                else return hyphenated;
            }
            else {
                _state.cachedtext.set(txtnode,txt);
                return txt;
            }
        },
        
        /** Retrieves cached text, based on the supplied node.
         *  @param {Node} txtnode
         *  @return       string
         */
        get: (txtnode) => _state.cachedtext.has(txtnode) ?
                               _state.cachedtext.get(txtnode) :
                               txtnode.data,
    };
   
    const getSanscript = (handDescs) => {
        if(handDescs.length === 0) return _state.defaultSanscript;
    
        // just take first script, or Tamil (Grantha) if necessary
        let maybetamil = false;
        for(const handDesc of handDescs) {
            const scripts = handDesc.dataset.script.split(' ');
            for(const script of scripts) {
                if(script === 'tamil') maybetamil = true;
                else if(_state.scriptnames.has(script)) return script;
            }
        }
        return maybetamil ? 'grantha' : false;
        /*
        const scripts = [...handDescs].reduce((acc,cur) => {
            for(const s of cur.dataset.script.split(' '))
                acc.add(s);
                return acc;
        },new Set());
        
        let maybetamil = false;
        for(const s of scripts) {
            if(s === 'tamil') maybetamil = true;
            else if(_state.scriptnames.has(s)) return s;
        }
        return maybetamil ? 'grantha' : false;
        */
    }
    const prepText = () => {
        // tag codicological units associated with a script first
        const synchs = _state.parEl.querySelectorAll('[data-synch]');
        for(const synch of synchs) {
            synch.lang = synch.lang ? synch.lang : 'en';
            const units = synch.dataset.synch.split(' ');
            // decide on a script for Sanskrit
            const scriptcode = (() => {
                // if this is a handDesc element
                if(synch.classList.contains('record_scripts'))
                    return _state.scriptToIso.get(getSanscript([synch]));
                // otherwise
                const unitselector = units.map(s => `[data-synch~='${s}']`);
                const handDescs = [..._state.parEl.getElementsByClassName('record_scripts')].filter(el => el.matches(unitselector));
                const script = getSanscript(handDescs) || _state.defaultSanscript;
                return _state.scriptToIso.get(script);
            })();
            
            const walker = document.createTreeWalker(synch,NodeFilter.SHOW_ALL);
            prepTextWalker(walker,scriptcode);
        }

        // tag rest of the document; use default script for Sanskrit
        const isodefault = _state.scriptToIso.get(_state.defaultSanscript);
        const walker = document.createTreeWalker(_state.parEl,NodeFilter.SHOW_ALL, 
            { acceptNode(node) { return node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-synch') ?
                NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT} });
        prepTextWalker(walker,isodefault);
    };
    
    /**
     * Prepares the text for transliteration:
     * 1. Tags every element with a lang attribute, 
     * 2. Caches Sanskrit and Tamil text nodes,
     *   a. Hyphenates text,
     *   b. Transliterates ta-Taml text into Latin script.
     *   @param {TreeWalker} walker
     *   @param {String}     scriptcode Sanskrit script in use, e.g. Beng, Deva, etc. If undefined, the default 'sa-Latn' tag is used.
     */
    const prepTextWalker = (walker,scriptcode) => {
        let curnode = walker.currentNode;
        while(curnode) {
            if(curnode.nodeType === Node.ELEMENT_NODE) {
                // what about script features? (e.g. valapalagilaka)
                const curlangattr = curnode.lang;
                if(!curlangattr) {
                    // lang undefined; copy from parent
                    curnode.lang = curnode.parentNode.lang;
                    if(curnode.parentNode.classList.contains('originalscript'))
                        curnode.classList.add('originalscript');
                }
                else {
                    const [curlang,curscript] = curlangattr.split('-');
                    if(curlang === 'ta') {
                        if(!curscript) {
                            // assume Madras Lexicon transliteration
                            curnode.lang = 'ta-Latn-t-ta-Taml';
                        }
                        // Tamil in Tamil script
                        else if(curscript === 'Taml') {
                            curnode.classList.add('originalscript');
                            curnode.lang = 'ta-Latn-t-ta-Taml';
                        }
                        // Tamil in other scripts?
                    }

                    else if(curlang === 'sa' || _state.hindic.indexOf(curlang) !== -1) {
                        // case 1: sa-XXXX
                        // case 2: sa
                        // case 3: sa-Latn[-t-sa-XXXX]
                        if(curscript && curscript !== 'Latn') {
                            // Sanskrit(/Hindi/Marathi/etc.) written in a specific script
                            curnode.lang = `${curlang}-Latn-t-${curlang}-${curscript}`;
                            curnode.classList.add('originalscript');
                        }
                        else if(curlangattr === curlang) {
                            // no script specified, assume IAST transliteration
                            // case 1: script is specified by parent or parameter
                                // could be a 'hi-Deva' parent, with 'sa' child === 'sa-Deva'
                            const parscript = (() => {
                                const scriptsplit = curnode.parentNode.lang.split('-');
                                if(scriptsplit.length > 1)
                                    return scriptsplit.pop();
                                else return null;
                            })();
                            let scriptappend = parscript || scriptcode;

                            // if language is unqualified 'sa' and script is 'Taml', 
                            // switch to 'Gran'
                            if(curlang === 'sa' && scriptappend && scriptappend.endsWith('Taml'))
                                scriptappend = 'Gran';

                            curnode.lang = scriptappend ? 
                                `${curlang}-Latn-t-${curlang}-${scriptappend}`:
                            // case 2: script not specified at all
                                `${curlang}-Latn`;
                            /*
                            const parlength = parlang.length;
                            if(parlength > 0 && parlang[parlength-1] !== 'Taml') {
                                curnode.lang = parlangcode + curnode.parentNode.lang;
                            }
                            else {
                                const sascriptcode = scriptcode === 'Taml' ? 
                                    'Gran' : scriptcode; 
                                curnode.lang = sascriptcode ? 
                                    `${curlang}-Latn-t-${curlang}-${sascriptcode}` : 'sa-Latn';
                            
                            }
                            */
                        }
                        // case 3: no change
                    }
                    // unknown language (not ta, sa, hi, mr, etc.)
                }
            }
            else if(curnode.nodeType === Node.TEXT_NODE) {
                const curlang = curnode.parentNode.lang.split('-')[0];
                if(_state.availlangs.includes(curlang)) {
                    curnode.data = cache.set(curnode);
                }
            }
            curnode = walker.nextNode();
        }
    };

    const transliterator = {
        toggle() {
            const subst = _state.parEl.querySelectorAll('span.subst, span.choice, span.expan');
            //const subst = document.querySelectorAll(`span.subst[lang|="${tolang.lang}"],span.choice[lang|="${tolang.lang}"],span.expan[lang|="${tolang.lang}"`);
            if(_state.button.lang === 'en') {
                this.revert();
                for(const s of subst)
                    this.unjiggle(s);
                button.revert();
            }
            else {
                for(const s of subst)
                    if(s.lang.startsWith('sa') || s.lang.startsWith('ta')) this.jiggle(s);
                this.convertNums();
                this.activate();
                button.transliterate();
            }
        },
        
        revert(par = _state.parEl) {
            const puncs = par.getElementsByClassName('invisible');
            for(const p of puncs) p.classList.remove('off');
             
            const walker = document.createTreeWalker(par,NodeFilter.SHOW_ALL);
            var curnode = walker.currentNode;
            while(curnode) {
                if(curnode.nodeType === Node.ELEMENT_NODE) {
                    const rev = _state.reverselangs.get(curnode.lang);
                    if(rev) curnode.lang = rev;
                }
                else if(curnode.nodeType === Node.TEXT_NODE) {
                    // lang attribute has already been reversed (hence take index 1)
                    const parlang = curnode.parentNode.lang.split('-');
                    const fromLatn = parlang[1];
                    if(fromLatn === 'Latn') {
                        const result = (() => {
                            const cached = cache.get(curnode);
                            if(curnode.parentNode.classList.contains('originalscript')) {
                                //TODO: also do for sa-Beng, sa-Deva, etc.
                                const fromcode = _state.isoToScript.get(parlang[4]);
                                return to.iast(cached,fromcode);
                            }
                            else
                                return cached;
                        })();
                        if(result !== undefined) curnode.data = result;
                    }
                }
                curnode = walker.nextNode();
            }
        },
        
        convertNums() {
            const nums = _state.parEl.querySelectorAll('span.num.trad[lang="ta-Latn-t-ta-Taml"], span.num.trad[lang="sa-Latn-t-sa-Gran"], span.num.trad[lang="sa-Latn-t-sa-Mlym"]');
            for(const num of nums) {
                const walker = document.createTreeWalker(num,NodeFilter.SHOW_TEXT,
                    {acceptNode() {return NodeFilter.FILTER_ACCEPT;} });
                var curnode = walker.currentNode;
                while(walker.nextNode()) {
                    const curnode = walker.currentNode;
                    curnode.data = to.nums(curnode.data);
                }
            }
        },

        activate(par = _state.parEl) {
            // Go through all <pc>-</pc> tags and make them invisible,
            // then empty the text node on the left, and add its content
            // to the text not on the right.
            // If there are many <pc> tags, the text node on the right
            // just keeps getting longer.
            // The original state of each text node was previously cached.
            const puncs = par.getElementsByClassName('invisible');
            //const puncs = _state.parEl.querySelectorAll(`.invisible[lang=${langcode}]`);
            for(const p of puncs) {
                if(p.lang === 'en') continue; // en nodes aren't cached
                //if(p.classList.contains('off')) continue;
                p.classList.add('off');
                const prev = p.previousSibling;
                const next = p.nextSibling;
                if(prev && (prev.nodeType === Node.TEXT_NODE) &&
                   next && (next.nodeType === Node.TEXT_NODE)) {
                    next.data = prev.data + next.data;
                    prev.data = '';
                }
            }
             
            const walker = document.createTreeWalker(par,NodeFilter.SHOW_ALL);
            var curnode = walker.currentNode;
            while(curnode) {
                if(curnode.nodeType === Node.ELEMENT_NODE) {
                    const rev = _state.reverselangs.get(curnode.lang);
                    if(rev) curnode.lang = rev;
                }
                else if(curnode.nodeType === Node.TEXT_NODE) {
                    const [lang, script] = (() => {
                        const s = curnode.parentNode.lang.split('-');
                        return [s[0],s[1]];
                    })();
                    if(_state.availlangs.includes(lang)) {
                        const scriptfunc = (() => {
                            if(to.hasOwnProperty(script))
                                return to[script];
                            return null;
                        })();
                        const result = (() => {
                            if(curnode.parentElement.dataset.hasOwnProperty('glyph'))
                                return curnode.parentElement.dataset.glyph;
                            if(curnode.parentElement.classList.contains('originalscript'))
                                return cache.get(curnode);
                            if(!scriptfunc) return undefined;
                            return scriptfunc(curnode.data);
                        })();
                        if(result !== undefined) curnode.data = result;
                    }
                }
                curnode = walker.nextNode();
            }
        },
        jiggle(node/*,script,lang*/) {
            if(node.firstChild.nodeType !== 3 && node.lastChild.nodeType !== 3) 
                return;
            
            this.unjiggle(node);
            
            const [lang,script] = (() => {
                const s = node.lang.split('-');
                return [s[0],s[s.length - 1]];
            })();
            
            if(!node.hasOwnProperty('origNode'))
                node.origNode = node.cloneNode(true);

            const kids = node.childNodes;
            const starts_with_vowel = /^[aāiīuūeoêôṛṝl̥l̥̄ṃḥ]/;
            const ends_with_consonant = /[kgṅcjñṭḍṇtdnpbmyrlḷḻvṣśsh]$/;

            const telugu_vowels = ['ā','i','ī','e','o','_','ai','au'];
            const telu_cons_headstroke = ['h','k','ś','y','g','gh','c','ch','jh','ṭh','ḍ','ḍh','t','th','d','dh','n','p','ph','bh','m','r','ḻ','v','ṣ','s'];
            var telugu_del_headstroke = false;
            var telugu_kids = [];
            var add_at_beginning = [];
            const starts_with_text = (kids[0].nodeType === 3);

            for (let kid of kids) {
                if(kid.nodeType > 3) continue;

                const txt = kid.textContent.trim();
                if(txt === '') continue;
                if(txt === 'a') { 
                    kid.textContent = '';
                    continue;
                }
                if(txt === 'aḥ') {
                    kid.textContent = 'ḥ';
                    continue;
                }

                if(txt.match(ends_with_consonant)) {
                    // add 'a' if node ends in a consonant
                    const last_txt = findTextNode(kid,true);
                    last_txt.textContent = last_txt.textContent.replace(/\s+$/,'') + 'a';
                    if(script === 'Telu' &&
                   telu_cons_headstroke.indexOf(txt) >= 0) {
                    // if there's a vowel mark in the substitution, 
                    // remove the headstroke from any consonants
                        telugu_kids.push(kid);
                    }
                }
            
                // case 1, use aalt:
                // ta<subst>d <del>ip</del><add>it</add>i</subst>
                // case 2, use aalt:
                // <subst>d <del>apy </del><add>ity </add>i</subst>va
                // case 3, no aalt:
                // <subst><del>apy </del><add>ity </add>i</subst>va
            
                // use aalt if node is a text node
                if(kid === node.lastChild && kid.nodeType === 3) {
                    const cap = document.createElement('span');
                    cap.appendChild(kid.cloneNode(false));
                    node.replaceChild(cap,kid);
                    kid = cap; // redefines 'kid'
                    //kid.classList.add('aalt',lang,script);
                    kid.classList.add('aalt');
                    kid.lang = node.lang;
                }
                else if(starts_with_text) {
                // use aalt if node starts with a vowel
                // or if there's a dangling consonant
                    if( (kid.nodeType === 1 && txt.match(starts_with_vowel)) || 
                        (kid.nodeType === 1 && ends_with_consonant))
                        kid.classList.add('aalt');
                }
                switch (script) {
                case 'Deva':
                case 'Nand':
                    if(txt === 'i') 
                        add_at_beginning.unshift(kid);
                    else if(txt === 'ê') {
                        kid.classList.remove('aalt');
                        kid.classList.add('cv01');
                        add_at_beginning.unshift(kid);
                    }
                    else if(txt === 'ô') {
                        const new_e = kid.cloneNode(true);
                        replaceTextInNode('ô','ê',new_e);
                        new_e.classList.remove('aalt');
                        new_e.classList.add('cv01');
                        add_at_beginning.unshift(new_e);
                        replaceTextInNode('ô','ā',kid);
                    }
                    else if(txt === 'aî') {
                        const new_e = kid.cloneNode(true);
                        replaceTextInNode('aî','ê',new_e);
                        new_e.classList.remove('aalt');
                        new_e.classList.add('cv01');
                        add_at_beginning.unshift(new_e);
                        replaceTextInNode('aî','e',kid);
                    }
                    else if(txt === 'aû') {
                        const new_e = kid.cloneNode(true);
                        replaceTextInNode('aû','ê',new_e);
                        new_e.classList.remove('aalt');
                        new_e.classList.add('cv01');
                        add_at_beginning.unshift(new_e);
                        replaceTextInNode('aû','o',kid);
                    }
                    break;
                case 'Beng':
                case 'Newa':
                case 'Shrd':
                    if(txt === 'i') 
                        add_at_beginning.unshift(kid);
                    else if(txt === 'e' || txt === 'ai') {
                        add_at_beginning.unshift(kid);
                    }
                    else if(txt === 'o') {
                        const new_e = kid.cloneNode(true);
                        replaceTextInNode('o','e',new_e);
                        add_at_beginning.unshift(new_e);
                        replaceTextInNode('o','ā',kid);
                    }
                    else if(txt === 'au') {
                        const new_e = kid.cloneNode(true);
                        replaceTextInNode('au','e',new_e);
                        add_at_beginning.unshift(new_e);
                    }
                    break;
                case 'Gran':
                case 'Taml':
                case 'Mlym':
                    if(txt === 'e' || txt === 'ē' || txt === 'ê' || 
                       txt === 'ai' || txt === 'aî')  {
                        add_at_beginning.unshift(kid);
                    }
                    else if(txt === 'o' || txt === 'ô') {
                        const new_e = kid.cloneNode(true);
                        replaceTextInNode(/[oōô]/,'e',new_e);
                        add_at_beginning.unshift(new_e);
                        replaceTextInNode(/[oōô]/,'ā',kid);
                    }
                    else if(txt === 'ō') {
                        const new_e = kid.cloneNode(true);
                        replaceTextInNode(/ō/,'ē',new_e);
                        add_at_beginning.unshift(new_e);
                        replaceTextInNode(/ō/,'ā',kid);
                    }
                    break;
                case 'Telu':
                    if(!telugu_del_headstroke &&
                       telugu_vowels.indexOf(txt) >= 0)
                        
                        telugu_del_headstroke = true;
                    break;

                }
            } // end for let kid of kids

            for (const el of add_at_beginning) {
                node.insertBefore(el,node.firstChild);
            }

            if(telugu_del_headstroke) {
                for (const el of telugu_kids) {
                    const lasttxtnode = findTextNode(el,true);
                    lasttxtnode.textContent = lasttxtnode.textContent + '\u200D\u0C4D';
                    //cache.set(lasttxtnode);
                }
            }
            /*
            // cache text again since elements are moved around
            const walker = document.createTreeWalker(node,NodeFilter.SHOW_TEXT,null,false);
            while(walker.nextNode()) cache.set(walker.currentNode);
            */
        },
    
        unjiggle(node) {
            if(node.hasOwnProperty('origNode'))
                node.replaceWith(node.origNode);
        }

    };

    const to = {

        smush: function(text,d_conv = false) {
            // d_conv is DHARMA convention
            if(!d_conv) text = text.toLowerCase();
        
            // remove space between word-final consonant and word-initial vowel
            text = text.replace(/([gḍdrmvynhs]) ([aāiīuūṛeēoōêô])/g, '$1$2');
        
            if(d_conv) text = text.toLowerCase();
        
            // remove space between word-final consonant and word-intial consonant
            text = text.replace(/([kgcjñḍtdnpbmrlyẏvśṣsṙ]) ([kgcjṭḍtdnpbmyẏrlvśṣshḻ])/g, '$1$2');

            // join final o/e/ā and avagraha/anusvāra
            text = text.replace(/([oōeēā]) ([ṃ'])/g,'$1$2');

            text = text.replace(/ü/g,'\u200Cu');
            text = text.replace(/ï/g,'\u200Ci');

            text = text.replace(/_{1,2}(?=\s*)/g, function(match) {
                if(match === '__') return '\u200D';
                else if(match === '_') return '\u200C';
            });

            return text;
        },
        
        nums: function(text) {
            const newarr = [];
            const rev = text.split('').reverse();
            let offset = 0;
            for(let i=0; i < rev.length; i++) {
                const num = rev[i];
                const reps = i - offset;
                if(/[23456789]/.test(num))
                    newarr.unshift(num + '⁰'.repeat(reps));
                else if(num === '1') {
                    if(reps === 0) newarr.unshift('1');
                    else newarr.unshift('\u200c'+'⁰'.repeat(reps));
                }
                else if(num !== '0') {
                    newarr.unshift(num);
                    offset = i+1;
                }
                if(reps === 3) offset = i+1; // only goes up to 1000
            }
            return newarr.join('');
        },

        iast: function(text,from) {
            const f = from || 'tamil';
            const literated = Sanscript.t(text,f,'iast')
                .replace(/^⁰|([^\d⁰])⁰/g,'$1¹⁰');
                //.replace(/l̥/g,'ḷ');
            if(f !== 'tamil')
                return literated.replace(/e/g,'ĕ')
                                .replace(/ē/g,'e')
                                .replace(/o(?!ṁ)/g,'ǒ')
                                .replace(/ō/g,'o');
            else return literated;
        },
        
        tamil: function(text) {
            const grv = new Map([
                ['\u0B82','\u{11300}'],
                ['\u0BBE','\u{1133E}'],
                ['\u0BBF','\u{1133F}'],
                ['\u0BC0','\u{11340}'],
                ['\u0BC1','\u{11341}'],
                ['\u0BC2','\u{11342}'],
                ['\u0BC6','\u{11347}'],
                ['\u0BC7','\u{11347}'],
                ['\u0BC8','\u{11348}'],
                ['\u0BCA','\u{1134B}'],
                ['\u0BCB','\u{1134B}'],
                ['\u0BCC','\u{1134C}'],
                ['\u0BCD','\u{1134D}'],
                ['\u0BD7','\u{11357}']
            ]);
            const grc = ['\u{11316}','\u{11317}','\u{11318}','\u{1131B}','\u{1131D}','\u{11320}','\u{11321}','\u{11322}','\u{11325}','\u{11326}','\u{11327}','\u{1132B}','\u{1132C}','\u{1132D}'];

            const smushed = text
                //.replace(/([kṅcñṭṇtnpmyrlvḻḷṟṉ])\s+([aāiīuūeēoō])/g, '$1$2')
                //.replace(/ḷ/g,'l̥')
                .replace(/(^|\s)_ā/g,'$1\u0B85\u200D\u0BBE')
                .replace(/(\S)([AĀIĪUŪEĒOŌ])/g,'$1\u200C$2')
                .replace(/(\S)·/g,'$1\u200C')
                .toLowerCase();
            const rgex = new RegExp(`([${grc.join('')}])([${[...grv.keys()].join('')}])`,'g');
            const pretext = Sanscript.t(smushed,'iast','tamil');
            return pretext.replace(rgex, function(m,p1,p2) {
                return p1+grv.get(p2); 
            });
        },
        grantha: function(txt) {
            const grv = new Map([
                ['\u{11300}','\u0B82'],
                ['\u{1133E}','\u0BBE'],
                ['\u{1133F}','\u0BBF'],
                ['\u{11340}','\u0BC0'],
                ['\u{11341}','\u0BC1'],
                ['\u{11342}','\u0BC2'],
                ['\u{11347}','\u0BC6'],
                ['\u{11348}','\u0BC8'],
                ['\u{1134B}','\u0BCA'],
                ['\u{1134C}','\u0BCC'],
                ['\u{1134D}','\u0BCD'],
                ['\u{11357}','\u0BD7']
            ]);
            const tmc = ['\u0BA9','\u0BB1','\u0BB3','\u0BB4'];
            const rgex = new RegExp(`([${tmc.join('')}])([${[...grv.keys()].join('')}])`,'gu');
            //const smushed = txt
            //    .replace(/([kṅcñṭṇtnpmyrlvḻ])\s+([aāiīuūeēoō])/g, '$1$2')
            //    .toLowerCase()
            const smushed = to.smush(txt,true)
                .replace(/e/g,'ē')
                .replace(/o(?![ṁḿ])/g,'ō')
                //.replace(/ḿ/g,'ṁ') // no Jaina oṃkāra
                .replace(/(\S)·/g,'$1\u200C');
                //.replace(/ḷ/g,'l̥');
            const pretext = Sanscript.t(smushed,'iast','grantha');
            return pretext.replace(rgex, function(m,p1,p2) {
                return p1+grv.get(p2); 
            });
        },
        malayalam: function(txt) {
            const chillu = {
                'ക':'ൿ',
                'ത':'ൽ',
                'ന':'ൻ',
                'മ':'ൔ',
                'ര':'ർ',
            };

            const smushed = to.smush(txt,true)
                .replace(/(^|\s)_ā/,'$1\u0D3D\u200D\u0D3E')
                //.replace(/(^|\s)_r/,"$1\u0D3D\u200D\u0D30\u0D4D");
                //FIXME (replaced by chillu r right now)
                .replace(/(\S)·/g,'$1\u200C');
            
            const newtxt = Sanscript.t(smushed,'iast','malayalam')
                // use chillu final consonants	
                .replace(/([കതനമര])്(?![^\s\u200C,—’―])/g, function(match,p1) {
                    return chillu[p1];
                });
	
            /*
            const replacedtxt = _state.features.has('dotReph') ?
                // use dot reph
                newtxt.replace(/(^|[^്])ര്(?=\S)/g,'$1ൎ') :
                newtxt;
            */
            const replacedtxt = newtxt.replace(/(^|[^്])ര്(?=\S)/g,'$1ൎ');

            return replacedtxt;
        },
        
        devanagari: function(txt) {

            const pretext = txt//.replace(/ṙ/g, 'r')
                .replace(/e/g,'ē')
                .replace(/o(?![ṁḿ])/g,'ō')
                .replace(/([^aāiīuūeēoōṛṝl̥l̥̄])ṃ/,'$1\'\u200Dṃ') // standalone anusvāra
                .replace(/([^aāiīuūeēoōṛṝl̥l̥̄])ḥ/,'$1\'\u200Dḥ') // standalone visarga
                .replace(/(^|\s)_y/,'$1\'\u200Dy') // half-form of ya
                .replace(/(^|\s)_ā/g,'$1\u093D\u200D\u093E')
                .replace(/(^|\s)_r/g,'$1\u093D\u200D\u0930\u094D');

            const smushed = to.smush(pretext);

            const text = Sanscript.t(smushed,'iast','devanagari')
                .replace(/¯/g, 'ꣻ');

            return text;
        },

        bengali: function(txt) {

            const pretext = txt//.replace(/ṙ/g, 'r')
                .replace(/e/g,'ē')
                .replace(/o(?![ṁḿ])/g,'ō')
                .replace(/(^|\s)_ā/g,'$1\u093D\u200D\u093E')
                .replace(/(^|\s)_r/g,'$1\u093D\u200D\u0930\u094D');

            const smushed = to.smush(pretext);

            const text = Sanscript.t(smushed,'iast','bengali')
                .replace(/ত্(?=\s)|ত্$/g,'ৎ');
            return text;
        },

        telugu: function(txt) {

            const pretext = txt.replace(/(^|\s)_ā/,'$1\u0C3D\u200D\u0C3E')
                .replace(/(^|\s)_r/,'$1\u0C3D\u200D\u0C30\u0C4D');
            // FIXME: should be moved to the right of the following consonant cluster

            const smushedtext = to.smush(pretext);
            //const replacedtext = _state.features.has('valapalagilaka') ?
            //    smushedtext.replace(/r(?=[kgcjṭḍṇtdnpbmyvlh])/,'ṙ') : smushedtext;
            const replacedtext = smushedtext.replace(/r(?=[kgcjṭḍṇtdnpbmyvlh])/,'ṙ');

            const posttext = replacedtext//.replace(/ê/g,'e') // no pṛṣṭhamātrās
                //.replace(/ô/g,'o') // same with o
                .replace(/ṙ/g,'r\u200D') // valapalagilaka
                //.replace(/ṁ/g,'ṃ') // no telugu oṃkāra sign
                //.replace(/ḿ/g,'ṃ')
                //.replace(/î/g,'i') // no pṛṣṭhamātrās
                //.replace(/û/g,'u');

            return Sanscript.t(posttext,'iast','telugu');
        },
        
        newa: function(txt) {

            const pretext = txt//.replace(/ṙ/g, 'r')
                .replace(/e/g,'ē')
                .replace(/o(?![ṁḿ])/g,'ō');

            const smushed = to.smush(pretext);

            const text = Sanscript.t(smushed,'iast','newa');

            return text;
        },

        sarada: function(txt) {

            const pretext = txt//.replace(/ṙ/g, 'r')
                .replace(/e/g,'ē')
                .replace(/o(?![ṁḿ])/g,'ō');

            const smushed = to.smush(pretext);

            const text = Sanscript.t(smushed,'iast','sarada')
                .replace(/¯/g, '\u{111DC}');
            return text;
        },

        nandinagari: function(txt) {

            const pretext = txt//.replace(/ṙ/g, 'r')
                .replace(/e/g,'ē')
                .replace(/o(?![ṁḿ])/g,'ō');

            const smushed = to.smush(pretext);

            const text = Sanscript.t(smushed,'iast','nandinagari')
                .replace(/¯/g, '\u{119E3}');
            return text;
        },
    };
    
    for(const [key, val] of _state.scriptToIso) {
        to[val] = to[key];
    }
    
    const findTextNode  = function(node,last = false) {
        if(node.nodeType === 3) return node;
        const walker = document.createTreeWalker(node,NodeFilter.SHOW_TEXT,null,false);
        if(!last) return walker.nextNode;
        else {
            let txt;
            while(walker.nextNode())
                txt = walker.currentNode;
            return txt;
        }
    };

    const replaceTextInNode = function(text, replace, node) {
        const walker = document.createTreeWalker(node,NodeFilter.SHOW_TEXT,null,false);
        while(walker.nextNode()) {
            const cur_txt = walker.currentNode.textContent;
            if(cur_txt.match(text))
                walker.currentNode.textContent = replace;
        }
    };
    
    return Object.freeze({
        init: init,
        to: to,
        scripts: function() { return _state.scriptnames;},
        refreshCache: (par) => {
            const walker = document.createTreeWalker(par,NodeFilter.SHOW_ALL);
            prepTextWalker(walker);
        },
        activate: transliterator.activate,
        revert: transliterator.revert

    });
}());

export { Transliterate };
