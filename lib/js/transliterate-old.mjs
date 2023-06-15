import { Sanscript } from './sanscript.mjs';
import { viewPos } from './viewpos.mjs';
import Hypher from './hypher.mjs';
import { hyphenation_ta } from './ta.mjs';
import { hyphenation_ta_Latn } from './ta-Latn.mjs';
import { hyphenation_sa } from './sa.mjs';

const Transliterate = (function() {
    'use strict';
    const _state = {
        curlang: 'en',
        availlangs: ['en'],
        availsanscripts: ['bengali','devanagari','grantha','malayalam','newa','sarada','telugu','nandinagari'],
        features: new Set(),
        langselector: '',
        otherlangs: ['ta','sa'],
        otherscripts: ['ta-Taml'],
        savedtext: new Map(),
        cleanedcache: new Map(),
        parEl: null,
        hyphenator: {
            ta: new Hypher(hyphenation_ta),
            sa: new Hypher(hyphenation_sa),
            'ta-Latn': new Hypher(hyphenation_ta_Latn)
        }
    };
    
    const init = function(par) {

        // reset state
        _state.availlangs = ['en'];

        // prepare transliteration functions
        const langtags = [...document.getElementsByClassName('record_languages')];
        const langs = langtags.reduce((acc,cur) => {
            const arr = acc;
            if(cur.dataset.mainlang) arr.push(cur.dataset.mainlang);
            if(cur.dataset.otherlangs) 
                cur.dataset.otherlangs.split(' ').forEach(str => arr.push(str));
            return arr;
        },[]);
        if(langs.includes('tam')) {
            _state.availlangs.push('ta-tamil');
            _state.langselector = _state.langselector ?
                [_state.langselector,'[lang|="ta"]'].join(',') :
                '[lang|="ta"]';
        }
        if(langs.includes('san')) {
            const scripttags = [...document.getElementsByClassName('record_scripts')];
            const scripts = new Set();
            for(const tag of scripttags) {
                tag.dataset.script.split(' ').forEach(str => scripts.add(str));
                tag.dataset.scriptref.split(' ').forEach(str => _state.features.add(str));
            }
            for(const script of _state.availsanscripts) {
                if(scripts.has(script))
                    _state.availlangs.push(`sa-${script}`);
            }
            _state.langselector = _state.langselector ? 
                [_state.langselector,'[lang|="sa"]'].join(',') :
                '[lang|="sa"]';
        }
        
        _state.parEl = par || document.body; 
        if(!_state.parEl.lang) _state.parEl.lang = 'en';

        refreshCache();

        const button = document.getElementById('transbutton');
        if(_state.availlangs.length > 1)
            button.addEventListener('click',events.transClick);
        else button.style.display = 'none';

    };
    const refreshCache = () => {
        const walker = document.createTreeWalker(_state.parEl,NodeFilter.SHOW_ALL);
        var curnode = walker.currentNode;
        while(curnode) {
            if(curnode.nodeType === Node.ELEMENT_NODE) {
                if(!curnode.lang) curnode.lang = curnode.parentNode.lang;
            }
            else if(curnode.nodeType === Node.TEXT_NODE) {
                const curlang = curnode.parentNode.lang.replace(/-\w+$/,'');
                if(_state.otherlangs.includes(curlang)) {
                    curnode.data = cacheText(curnode);
                }
            }
            curnode = walker.nextNode();
        }
    };

    const events = {
        transClick: function(e) {
            const i = _state.availlangs.indexOf(_state.curlang);
            const nexti = _state.availlangs.length === i+1 ? 0 : i+1;
            const vpos = viewPos.getVP(_state.parEl);
            cycleScript(e.target,_state.curlang,_state.availlangs[nexti]);
            viewPos.setVP(_state.parEl,vpos);
        },
    };

    const cycleScript = function(button,from,to) {
        const parselangcode = function(str) {
            const s = str.split('-');
            return {
                lang: s[0],
                script: s.length > 1 ? s[1] : ''
            };
        };

        const fromlang = parselangcode(from);
        if(fromlang.script) button.classList.remove(fromlang.script);


        if(to === 'en') {
            const nodes = document.querySelectorAll(_state.langselector);
            for(const n of nodes) {
                if(fromlang.script)
                    n.classList.remove(fromlang.lang,fromlang.script);
                else
                    n.classList.remove(fromlang.lang);
            }
            textWalk(walkers.roman,fromlang.lang);

            const subst = document.querySelectorAll('span.subst, span.choice, span.expan');
            for(const s of subst)
                unjiggle(s);
            
            button.innerHTML = 'A';
        }
        else {
            const tolang = parselangcode(to);
            const subst = document.querySelectorAll(`span.subst[lang|="${tolang.lang}"],span.choice[lang|="${tolang.lang}"],span.expan[lang|="${tolang.lang}"`);
            for(const s of subst)
                jiggle(s,tolang.script,tolang.lang);
            const nodes = document.querySelectorAll(`[lang|="${tolang.lang}"]`);
            for(const n of nodes) {
                if(fromlang.script)
                    n.classList.remove(fromlang.lang,fromlang.script);
                else
                    n.classList.remove(fromlang.lang);
                n.classList.add(tolang.lang,tolang.script);
            }
            textWalk(walkers[to],tolang.lang);
            button.innerHTML = Sanscript.t('a','iast',tolang.script);
            button.classList.add(tolang.script);
        }
        _state.curlang = to;
    };

    const cacheText = function(txtnode) {
        // don't break before daṇḍa, or between daṇḍa and numeral/puṣpikā
        const nbsp = String.fromCodePoint('0x0A0');
        const txt = txtnode.data
            .replace(/\s+\|/g,`${nbsp}|`)
            .replace(/\|\s+(?=[\d❈꣸])/g,`|${nbsp}`);
        
        // hyphenate according to script (Tamil or Romanized)
        const lang = txtnode.parentNode.lang;
        const hyphenlang = ((lang) => {
            switch(lang) {
                case 'ta-Taml':
                    return 'ta';
                case 'ta':
                    return 'ta-Latn';
                case 'sa':
                    return 'sa';
                default:
                    return null;
            }
        })(lang);

        if(hyphenlang) {
            const hyphenated = _state.hyphenator[hyphenlang].hyphenateText(txt);
            _state.savedtext.set(txtnode,hyphenated);
            // convert Tamil to Roman
            if(lang === 'ta-Taml')
                return to.iast(hyphenated);
            else return hyphenated;
        }
        else {
            _state.savedtext.set(txtnode,txt);
            return txt;
        }
    };
    
    const textWalk = function(func,langcode) {
        const puncs = _state.parEl.querySelectorAll(`.invisible[lang=${langcode}]`);
        if(func !== walkers.roman) {
            for(const p of puncs) {

                if(p.classList.contains('off')) continue;
                // if switching between brahmic scripts, switch everything back on first?
                p.classList.add('off');
                const prev = p.previousSibling;
                const next = p.nextSibling;
                if(prev && (prev.nodeType === Node.TEXT_NODE) &&
                   next && (next.nodeType === Node.TEXT_NODE)) {
                    next.data = prev.data + next.data;
                    prev.data = '';
                    _state.cleanedcache.set(next,next.data);
                    _state.cleanedcache.set(prev,'');
                }
            }
            // to improve: check for adjacent invisible nodes
        } else {
            for(const p of puncs) p.classList.remove('off');
        }
         
        const walker = document.createTreeWalker(_state.parEl,NodeFilter.SHOW_TEXT);
        var curnode = walker.currentNode;
        while(curnode) {
            const code = curnode.parentNode.lang.replace(/-\w+$/,'');
            if(_state.otherlangs.includes(code)) {
                const result = ( func !== walkers.roman && 
                    curnode.parentElement.dataset.hasOwnProperty('glyph') ) ? 
                    curnode.parentElement.dataset.glyph : func(curnode);
                if(result !== undefined) curnode.data = result;
            }
            curnode = walker.nextNode();
        }
    };
    
    const getCached = (txtnode) => _state.cleanedcache.has(txtnode) ? _state.cleanedcache.get(txtnode) : _state.savedtext.has(txtnode) ? _state.savedtext.get(txtnode) : txtnode.data;

    const walkers = {
        'ta-tamil': function(txtnode) {
            const cached = getCached(txtnode);
            if(txtnode.parentNode.lang === 'ta')
                return to.tamil(cached);
            else if(txtnode.parentNode.lang === 'sa')
                return to.grantha(cached);
            else if(txtnode.parentNode.lang === 'ta-Taml')
                return cached;
        },
        'sa-devanagari': function(txtnode) {
            const cached = getCached(txtnode);
            if(txtnode.parentNode.lang === 'sa')
                return to.devanagari(cached);
        },
        'sa-grantha': function(txtnode) {
            const cached = getCached(txtnode);
            if(txtnode.parentNode.lang === 'sa')
                return to.grantha(cached);
        },
        'sa-malayalam': function(txtnode) {
            const cached = getCached(txtnode);
            if(txtnode.parentNode.lang === 'sa')
                return to.malayalam(cached);
        },
        'sa-telugu': function(txtnode) {
            const cached = getCached(txtnode);
            if(txtnode.parentNode.lang === 'sa')
                return to.telugu(cached);
        },
        'sa-bengali': function(txtnode) {
            const cached = getCached(txtnode);
            if(txtnode.parentNode.lang === 'sa')
                return to.bengali(cached);
        },
        'sa-newa': function(txtnode) {
            const cached = getCached(txtnode);
            if(txtnode.parentNode.lang === 'sa')
                return to.newa(cached);
        },
        'sa-sarada': function(txtnode) {
            const cached = getCached(txtnode);
            if(txtnode.parentNode.lang === 'sa')
                return to.sarada(cached);
        },
        'sa-nandinagari': function(txtnode) {
            const cached = getCached(txtnode);
            if(txtnode.parentNode.lang === 'sa')
                return to.nandinagari(cached);
        },

        roman: function(txtnode) {
            if(_state.otherlangs.includes(txtnode.parentNode.lang))
                //return _state.savedtext.get(txtnode);
                return getCached(txtnode);
            else if(txtnode.parentNode.lang === 'ta-Taml')
                return to.iast(txtnode.data);
        },
    };

    const to = {

        smush: function(text,placeholder,d_conv = false) {
            // d_conv is DHARMA convention
            if(!d_conv) text = text.toLowerCase();
        
            // remove space between a word that ends in a consonant and a word that begins with a vowel
            text = text.replace(/([ḍdrmvynhs]) ([aāiīuūṛeēoōêô])/g, '$1$2'+placeholder);
        
            if(d_conv) text = text.toLowerCase();
        
            // remove space between a word that ends in a consonant and a word that begins with a consonant
            text = text.replace(/([kgcjñḍtdnpbmrlyẏvśṣsṙ]) ([kgcjṭḍtdnpbmyẏrlvśṣshḻ])/g, '$1'+placeholder+'$2');

            // join final o/e/ā and avagraha/anusvāra
            text = text.replace(/([oōeēā]) ([ṃ'])/g,'$1'+placeholder+'$2');

            text = text.replace(/ü/g,'\u200Cu');
            text = text.replace(/ï/g,'\u200Ci');

            text = text.replace(/_{1,2}(?=\s*)/g, function(match) {
                if(match === '__') return '\u200D';
                else if(match === '_') return '\u200C';
            });

            return text;
        },

        iast: function(text,from) {
            const f = from || 'tamil';
            return Sanscript.t(text,f,'iast')
                .replace(/^⁰|([^\d⁰])⁰/g,'$1¹⁰')
                .replace(/l̥/g,'ḷ');
        },
        
        tamil: function(text/*,placeholder*/) {
            /*const pl = placeholder || '';
            const txt = to.smush(text,pl);
            return Sanscript.t(txt,'iast','tamil');*/
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
                .replace(/([kṅcñṭṇtnpmyrlvḻḷṟṉ])\s+([aāiīuūeēoō])/g, '$1$2')
                .replace(/ḷ/g,'l̥')
                .replace(/(^|\s)_ā/g,'$1\u0B85\u200D\u0BBE')
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
            const smushed = to.smush(txt,'',true)
                .replace(/e/g,'ē')
                .replace(/o(?![ṁḿ])/g,'ō')
                .replace(/ḿ/g,'ṁ') // no Jaina oṃkāra
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

            const smushed = to.smush(txt,'',true)
                .replace(/(^|\s)_ā/,'$1\u0D3D\u200D\u0D3E')
                //.replace(/(^|\s)_r/,"$1\u0D3D\u200D\u0D30\u0D4D");
                //FIXME (replaced by chillu r right now)
                .replace(/(\S)·/g,'$1\u200C');
            
            const newtxt = Sanscript.t(smushed,'iast','malayalam')
                // use chillu final consonants	
                .replace(/([കതനമര])്(?![^\s\u200C,—’―])/g, function(match,p1) {
                    return chillu[p1];
                });
	
            const replacedtxt = _state.features.has('dotReph') ?
                // use dot reph
                newtxt.replace(/(^|[^്])ര്(?=\S)/g,'$1ൎ') :
                newtxt;
            
            return replacedtxt;
        },
        
        devanagari: function(txt,placeholder) {

            const pretext = txt.replace(/ṙ/g, 'r')
                .replace(/e/g,'ē')
                .replace(/o(?![ṁḿ])/g,'ō')
                .replace(/([^aāiīuūeēoōṛṝḷḹ])ṃ/,'$1\'\u200Dṃ') // standalone anusvāra
                .replace(/([^aāiīuūeēoōṛṝḷḹ])ḥ/,'$1\'\u200Dḥ') // standalone visarga
                .replace(/(^|\s)_y/,'$1\'\u200Dy') // half-form of ya
                .replace(/(^|\s)_ā/g,'$1\u093D\u200D\u093E')
                .replace(/(^|\s)_r/g,'$1\u093D\u200D\u0930\u094D');

            const smushed = to.smush(pretext, (placeholder || '') );

            const text = Sanscript.t(smushed,'iast','devanagari')
                .replace(/¯/g, 'ꣻ');

            return text;
        },

        bengali: function(txt,placeholder) {

            const pretext = txt.replace(/ṙ/g, 'r')
                .replace(/e/g,'ē')
                .replace(/o(?![ṁḿ])/g,'ō')
                .replace(/(^|\s)_ā/g,'$1\u093D\u200D\u093E')
                .replace(/(^|\s)_r/g,'$1\u093D\u200D\u0930\u094D');

            const smushed = to.smush(pretext, (placeholder || '') );

            const text = Sanscript.t(smushed,'iast','bengali')
                .replace(/¯/g, 'ꣻ')
                .replace(/ত্(?=\s)|ত্$/g,'ৎ');
            return text;
        },

        telugu: function(txt,placeholder) {

            const pretext = txt.replace(/(^|\s)_ā/,'$1\u0C3D\u200D\u0C3E')
                .replace(/(^|\s)_r/,'$1\u0C3D\u200D\u0C30\u0C4D');
            // FIXME: should be moved to the right of the following consonant

            const smushedtext = to.smush(pretext,(placeholder || ''));        
            const replacedtext = _state.features.has('valapalagilaka') ?
                smushedtext.replace(/r(?=[kgcjṭḍṇtdnpbmyvlh])/,'ṙ') : smushedtext;

            const posttext = replacedtext.replace(/ê/g,'e') // no pṛṣṭhamātrās
                .replace(/ô/g,'o') // same with o
                .replace(/ṙ/g,'r\u200D') // valapalagilaka
                //.replace(/ṁ/g,'ṃ') // no telugu oṃkāra sign
                .replace(/ḿ/g,'ṃ')
                .replace(/î/g,'i') // no pṛṣṭhamātrās
                .replace(/û/g,'u');

            return Sanscript.t(posttext,'iast','telugu');
        },
        
        newa: function(txt,placeholder) {

            const pretext = txt.replace(/ṙ/g, 'r')
                .replace(/e/g,'ē')
                .replace(/o(?![ṁḿ])/g,'ō')
                .replace(/(^|\s)_ā/g,'$1\u093D\u200D\u093E')
                .replace(/(^|\s)_r/g,'$1\u093D\u200D\u0930\u094D');

            const smushed = to.smush(pretext, (placeholder || '') );

            const text = Sanscript.t(smushed,'iast','newa')
                .replace(/¯/g, 'ꣻ');
            return text;
        },

        sarada: function(txt,placeholder) {

            const pretext = txt.replace(/ṙ/g, 'r')
                .replace(/e/g,'ē')
                .replace(/o(?![ṁḿ])/g,'ō')
                .replace(/(^|\s)_ā/g,'$1\u093D\u200D\u093E')
                .replace(/(^|\s)_r/g,'$1\u093D\u200D\u0930\u094D');

            const smushed = to.smush(pretext, (placeholder || '') );

            const text = Sanscript.t(smushed,'iast','sarada')
                .replace(/¯/g, 'ꣻ');
            return text;
        },

        nandinagari: function(txt,placeholder) {

            const pretext = txt.replace(/ṙ/g, 'r')
                .replace(/e/g,'ē')
                .replace(/o(?![ṁḿ])/g,'ō');

            const smushed = to.smush(pretext, (placeholder || '') );

            const text = Sanscript.t(smushed,'iast','nandinagari')
                .replace(/¯/g, '\u{119E3}');
            return text;
        },
    };
    
    const jiggle = function(node,script,lang) {
        if(node.firstChild.nodeType !== 3 && node.lastChild.nodeType !== 3) 
            return;
        
        unjiggle(node);

        if(!node.hasOwnProperty('origNode'))
            node.origNode = node.cloneNode(true);

        const kids = node.childNodes;
        const starts_with_vowel = /^[aāiīuūeoêôṛṝḷṃḥ]/;
        const ends_with_consonant = /[kgṅcjñṭḍṇtdnpbmyrlvṣśsh]$/;

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
                if(script === 'telugu' &&
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
                kid.classList.add('aalt',lang,script);
                kid.lang = lang;
            }
            else if(starts_with_text) {
            // use aalt if node starts with a vowel
            // or if there's a dangling consonant
                if( (kid.nodeType === 1 && txt.match(starts_with_vowel)) || 
                    (kid.nodeType === 1 && ends_with_consonant))
                    kid.classList.add('aalt');
            }
            switch (script) {
            case 'devanagari':
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
            case 'bengali':
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
            case 'grantha':
            case 'tamil':
            case 'malayalam':
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
            case 'telugu':
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
                cacheText(lasttxtnode);
            }
        }
        
        // cache text again since elements are moved around
        const walker = document.createTreeWalker(node,NodeFilter.SHOW_TEXT,null,false);
        while(walker.nextNode()) cacheText(walker.currentNode);
    };
    
    const unjiggle = function(node) {
        if(node.hasOwnProperty('origNode'))
            node.replaceWith(node.origNode);
    };

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
    
    return {
        init: init,
        to: to,
        scripts: () => new Set(_state.availsanscripts),
        refreshCache: refreshCache
    };
}());

export { Transliterate };
