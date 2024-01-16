import { showSaveFilePicker } from 'https://cdn.jsdelivr.net/npm/native-file-system-adapter/mod.js';
import { filters, filterAll, unfilterAll } from './normalize.mjs';
import { aksaraSplit, charSplit, graphemeSplit } from './split.mjs';
import Sanscript from './sanscript.mjs';
//import multiAlign from './multialign.mjs';
import JSZip from './jszip.mjs';

const tagstodelete = ['note','label'];

const ranges = new Map([
    ['tamil', /[\u0b80-\u0bff]/u],
    ['devanagari', /[\u0900-\u097f]/u],
    ['bengali', /[\u0980-\u09ff]/u],
    ['telugu', /[\u0c00-\u0c7f]/u],
    ['malayalam',/[\u0d00-\u0d7f]/u],
    ['sarada',/[𑆃-𑆲]/u],
    ['grantha',/[𑌅-𑌹]/u],
    ['newa',/[𑐀-𑐴]/u]
]);

const _alltexts = new Map();
const _allblocks = new Set();

const parseString = (str,fname) => {
    const parser = new DOMParser();
    const newd = parser.parseFromString(str,'text/xml');
    if(newd.documentElement.nodeName === 'parsererror')
        alert(`${fname} could not be loaded. Please contact your friendly local system administrator. Error: ${newd.documentElement.textContent}`);
    else
        return newd;
};

const upload = async (arr) => {
    const files = arr.map(file => {
        return readOne(file);
    });
    return await Promise.all(files);
};

const readOne = async (file) => {
    const reader = new FileReader();
    return new Promise(res => {
        reader.onload = () => res(reader.result);
        reader.readAsText(file);
    });
};

const updatePreview = async () => {
    const preview = document.getElementById('file-input-box');
    const idpreview = document.getElementById('xml-ids-box');
    const input = document.getElementById('teifiles');

    const files = [...input.files];
    if(files.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'No files selected.';
        preview.querySelector('.checklist').appendChild(p);
    }
    else {
        for(const file of files) {
            const text = await readOne(file);
            const teixml = parseString(text,file.name);
            //const texts = [...teixml.querySelectorAll('text')].filter(t => t.hasAttribute('corresp'));
            const texts = [...teixml.querySelectorAll('text')];
            const title = teixml.querySelector('titleStmt > title').innerHTML;

            for(const text of texts) {
                const id = text.getAttribute('corresp')?.replace(/^#/,'') || teixml.querySelector('idno[type="siglum"]').textContent;
                
                for(const todel of text.querySelectorAll(tagstodelete.join(',')))
                    todel.remove();
                
                for(const gap of [...text.querySelectorAll('gap')]) {
                    const reason = gap.getAttribute('reason');
                    if(reason && reason === 'ellipsis') continue;
                    gap.replaceWith('‡'.repeat(gap.getAttribute('quantity') || 1));
                }
                if(_alltexts.has(id) ||
                   _alltexts.has(`${id}ac`))
                    alert(`Warning: ${id} used more than once.`);
                
                const acpc = text.querySelector('add, del');

                const rdgs = [...text.querySelectorAll('rdg')];
                if(rdgs.length !== 0) {
                    if(acpc) {
                        _alltexts.set(`${id}ac`,{textel: text, filename: file.name, title: title, type: 'ac', par: id});
                        _alltexts.set(`${id}pc`,{textel: text, filename: file.name, title: title, type: 'pc', par: id});
                    }
                    else
                        _alltexts.set(id,{textel: text, filename: file.name, title: title, type: 'lem'});

                    const wits = rdgs.reduce((acc,cur) => {
                        const w = cur.getAttribute('wit');
                        if(!w) return acc;
                        for(const ww of w.split(/\s+/))
                            acc.add(w);
                        return acc;
                    },new Set());

                    for(const wit of wits) {
                        const witid = wit.replace(/^#/,'');
                        _alltexts.set(`${id}-${witid}`,{textel: text, filename: file.name, title: title + ` [witness ${witid}]`, type: wit, par: id});
                    }
                }
                else if(acpc) {
                    _alltexts.set(`${id}ac`,{textel: text, filename: file.name, title: title, type: 'ac', par: id});
                    _alltexts.set(`${id}pc`,{textel: text, filename: file.name, title: title, type: 'pc', par: id});
                }
                else
                    _alltexts.set(id,{textel: text, filename: file.name, title: title});
            }
            const els = [...teixml.querySelectorAll('p[*|id],p[corresp],lg[*|id],lg[corresp],l[*|id],l[corresp],div[*|id]')];
            for(const el of els) {
                const id = el.getAttribute('xml:id') || el.getAttribute('corresp')?.replace(/^#/,'');
                if(id) _allblocks.add(id);
            }
        }
        
        appendList(preview.querySelector('.checklist'), [..._alltexts.keys()].sort());
        appendList(idpreview.querySelector('.checklist'), [..._allblocks].sort());


        document.getElementById('alignsubmit').style.display = 'block';
        document.querySelector('.options').style.display = 'flex';
        
        idpreview.style.opacity = 1;
        idpreview.style.display = 'flex';

        preview.querySelector('legend').style.display = 'block';
        const buttonlabel = preview.querySelector('label[for="teifiles"]');
        buttonlabel.textContent = 'Add more TEI XML files';
        preview.style.border = '1px solid grey';
        preview.querySelector('legend').style.display = 'block';
    }
};

const appendList = (par, els) => {
    par.innerHTML = '';
    const item1 = document.createElement('div');
    const input1 = document.createElement('input');
    input1.setAttribute('type','checkbox');
    input1.setAttribute('name','selectall');
    const label1 = document.createElement('label');
    label1.textContent = 'Select all';
    item1.appendChild(input1);
    item1.appendChild(label1);
    par.appendChild(item1);
    for(const el of els) {
        const item = document.createElement('div');
        const input = document.createElement('input');
        input.setAttribute('type','checkbox');
        const label = document.createElement('label');
        label.textContent = el;
        item.appendChild(input);
        item.appendChild(label);
        par.appendChild(item);
    }
};

const getFilterIndices = () => {
    const ret = [];
    const par = document.getElementById('normalization');
    for(const box of par.querySelectorAll('input:checked')) {
        const i = parseInt(box.value);
        if(isNaN(i)) continue;
        ret.push(i);
    }
    ret.sort((a,b) => a - b);
    return ret;
};

const getSelected = (par) => {
    const ret = [];
    for(const input of par.querySelectorAll('input')) {
        if(input.getAttribute('name') === 'selectall')
            continue;
        if(!input.checked)
            continue;
        ret.push(input.nextElementSibling.textContent);
    }
    return ret;
};
const scriptandfilter = (el,type) => {
    const fis = getFilterIndices();
    const clone = el.cloneNode(true);
    if(type === 'ac') {
        for(const add of clone.querySelectorAll('add'))
            add.remove();
        for(const rdg of clone.querySelectorAll('rdg'))
            rdg.remove();
    }
    else if(type === 'pc') {
        for(const del of clone.querySelectorAll('del'))
            del.remove();
        for(const rdg of clone.querySelectorAll('rdg'))
            rdg.remove();
    }
    else if(type === 'lem') {
        for(const del of clone.querySelectorAll('del'))
            del.remove();
        for(const rdg of clone.querySelectorAll('rdg'))
            rdg.remove();
    }
    else if(type !== undefined) {
        for(const lem of clone.querySelectorAll('lem'))
            lem.remove();
        for(const del of clone.querySelectorAll('del'))
            del.remove();
        for(const rdg of clone.querySelectorAll('rdg'))
            if(!rdg.getAttribute('wit')?.split(/\s+/).includes(type))
                rdg.remove();
    }
    const str = clone.textContent;

    const script = ((str,ranges) => {
        for(const [name,range] of ranges)
            if(str.match(range)) return name;
        return 'iast';
    })(str,ranges);
    const iast = script !== 'iast' ? Sanscript.t(str,script,'iast') : str;
    return filterAll(iast.replaceAll(/[\n\s]+/g,' '),fis);
};

const getScores = () => {
    const par = document.getElementById('scoring');
    const nums = [...document.querySelectorAll('#scoring input[type="number"]')].map(i => parseFloat(i.value));
    const recursive = par.querySelector('input[type="checkbox"]').checked;
    return {scores: nums, recursive: recursive};
};

const align = () => {
    const tok = document.querySelector('input[name="tokenization"]:checked').value;

    const splitfunc = ((tok) => {
        switch(tok) {
            case 'whitespace': return (str) => str.split(/\s+/g).map((s,i,arr) => i > 0 ? ' ' + s : s);
            case 'aksara': return aksaraSplit;
            case 'grapheme': return graphemeSplit;
            default: return charSplit;
        }
    })(tok);

    const scores = getScores();
    const configfunc = tok === 'char' ? 'char' : 
        scores.recursive ? 'arr' : 'arr_simple';

    const selectedtexts = getSelected(document.getElementById('file-input-box'));
    const selectedblocks = getSelected(document.getElementById('xml-ids-box'));
    if(selectedblocks.length === 0 || selectedtexts.length === 0) {
        alert('Nothing selected to be aligned.');
        return;
    }
    
    document.getElementById('blackout').style.display = 'flex';
    document.getElementById('popupmessage').innerHTML = '';
    document.getElementById('spinner').style.display = 'flex';

    
    const alignedblocks = new Map();
    const todo = [];
    for(const block of selectedblocks) {
        const texts = [];
        for(const text of selectedtexts) {
            const {textel, type, par} = _alltexts.get(text);
            let blockel = textel.querySelector(`*[*|id="${block}"], *[corresp="#${block}"]`);
            if(!blockel) continue;

            // TODO: is there a better way
            blockel = blockel.querySelector('*[type="edition"]') || blockel;
            
            if(type) {
                if( (type === 'ac' || type == 'pc') ) {
                    const acpc = blockel.querySelector('add, del');
                    if(!acpc) {
                        if(type === 'ac') {
                            const [clean,filters] = scriptandfilter(blockel,'lem');
                            texts.push({siglum: par, text: splitfunc(clean), filters: filters});
                        }
                        continue;
                    }
                }
                else if(type !== 'lem') {
                   const rdg = blockel.querySelector(`rdg[wit~="${type}"]`);
                   if(!rdg) continue;
                }
            }

            const [clean,filters] = scriptandfilter(blockel,type);
            texts.push({siglum: text, text: splitfunc(clean), filters: filters});
        }
        
        const filtersmap = new Map(texts.map(t => [t.siglum,t.filters]));
        todo.push({workerdata: [texts,configfunc,scores.scores], block: block, filtersmap: filtersmap});
    }

    const alignWorker = new Worker('./multialignworker.mjs',{type: 'module'});
    let n = 0;
    document.getElementById('popupmessage').textContent = `Aligning ${todo[n].block}...`;
    alignWorker.postMessage(todo[n].workerdata);
    alignWorker.onmessage = function(e) {
        if(e.data.hasOwnProperty('progress')) {
            const p = e.data.progress * 100;
            document.getElementById('spinner').style.background = 
                `linear-gradient(0deg, rgb(240,202,121) ${p-5}%, rgb(50,50,50,0.3) ${p}%`;
            if(e.data.hasOwnProperty('message'))
                document.getElementById('popupmessage').textContent = e.data.message;
            return;
        }

        const finished = postprocess(e.data,todo[n].block,todo[n].filtersmap);
        alignedblocks.set(...finished);
        n = n + 1;
        if(n < todo.length) {
            document.getElementById('popupmessage').textContent = `Aligning ${todo[n].block}...`;
            alignWorker.postMessage(todo[n].workerdata);
        }
        else {
            document.getElementById('popupmessage').innerHTML = '<button>Save file</button>';
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('popupmessage').querySelector('button').addEventListener('click', saveAs.bind(null,alignedblocks));
        }
    };
};

const postprocess = (alignment,block,filtersmap) => {
    const clean = alignment.alignment.map(arr => arr.map(a => Array.isArray(a) ? a.join('') : a));
    const newclean = [];
    for(const row of clean) {
        const id = alignment.sigla.shift();
        const f = filtersmap.get(id);
        const unfiltered = unfilterAll([...row],f);
        const ret = new Array(unfiltered.length);
        for(let n=0;n<unfiltered.length;n++) {
            if(unfiltered[n] === row[n])
                ret[n] = unfiltered[n];
            else
                ret[n] = [unfiltered[n],row[n]];
        }
        newclean.push({siglum: id, text: ret});
    }
    return [block,toXML(newclean,alignment.tree)];
};

const makeWitList = () => {
    const newlist = new Map();
    for(const [witid, deets] of _alltexts) {
        if(deets.par) {
            const witlist = newlist.get(deets.par) || [];
            witlist.push([witid,deets]);
            newlist.set(deets.par,witlist);
        }
        else {
            const witlist = newlist.get(witid) || [];
            witlist.unshift([witid,deets]);
            newlist.set(witid,witlist);
        }
    }
    let ret = '<listWit>';
    for(const [witid, witlist] of newlist) {
        ret = ret + `<witness xml:id="${witid}" source="${witlist[0][1].filename}"><abbr type="siglum">${witid}</abbr><expan>${witlist[0][1].title}</expan>`;
        if(witlist[0][1].type && witlist[0][1].type !== 'lem') 
            // this means there was only ac/pc, no parent
            ret = ret + `<witness xml:id="${witlist[0][0]}" type="${witlist[0][1].type}"><abbr type="siglum">${witlist[0][0]}</abbr><expan>${witlist[0][1].title} [${witlist[0][1].type === 'ac' ? 'ante' : 'post'} correctionem]</expan></witness>`;

        for(let n=1;n<witlist.length;n++) {
            const type = witlist[n][1].type === 'ac' ? ' type="ac"' :
                witlist[n][1].type === 'pc' ? ' type="pc"' :
                '';
            const post = witlist[n][1].type === 'ac' ? ' [ante correctionem]' :
                witlist[n][1].type === 'pc' ? ' [post correctionem]' :
                '';
            ret = ret + `<witness xml:id="${witlist[n][0]}"${type}><abbr type="siglum">${witlist[n][0]}</abbr><expan>${witlist[n][1].title}${post}</expan></witness>`;
        }
        ret = ret + '</witness>';
    }
    return ret + '</listWit>';
};

const toXML = (objs,tree) => {
    const witList = makeWitList();
    let ret = `<?xml version="1.0" encoding="UTF-8"?><teiCorpus xmlns="http://www.tei-c.org/ns/1.0" xml:lang="ta"><teiHeader>${witList}<xenoData><stemma format="nexml" id="stemma0">${tree}</stemma></xenoData></teiHeader>`;
    for(const obj of objs) {
        ret = ret + `<TEI n="${obj.siglum}"><text>`;
        const text = obj.text.map((t,i) => Array.isArray(t) ? `<w n="${i}" lemma="${t[1]}">${t[0]}</w>` : `<w n="${i}">${t}</w>`).join('');
        ret = ret + text + '</text></TEI>';
    }
    return ret + '</teiCorpus>';
};

const saveAs = async (blocks) => {

    document.getElementById('blackout').style.display = 'none';

    const outtexts = [...blocks];
    if(outtexts.length === 1) {
        const fname = outtexts[0][0] + '.xml';
        const fileHandle = await showSaveFilePicker({
            _preferPolyfill: false,
            suggestedName: fname,
            types: [ {description: 'TEI XML alignment', accept: {'application/xml': ['.xml']} } ],
        });
        const writer = await fileHandle.createWritable();
        writer.write(outtexts[0][1]);
        writer.close();
        return;
    }

    const zip = new JSZip();
    for(const outtext of outtexts) zip.file(`${outtext[0]}.xml`, outtext[1]);
    zip.generateAsync({type: "blob"})
       .then(async (blob) => {
            const fileHandle = await showSaveFilePicker({
                _preferPolyfill: false,
                suggestedName: 'alignments.zip',
                types: [ {description: 'Zip archive', accept: {'application/zip': ['.zip']} } ],
            });
            const writer = await fileHandle.createWritable();
            writer.write(blob);
            writer.close();
       });
};

const updateCheckboxes = (e) => {
    if(e.target.tagName !== 'INPUT') return;
    const par = e.target.closest('.checklist');
    const parbox = par.querySelector('input[name="selectall"]');
    if(e.target === parbox) {
        for(const box of par.querySelectorAll('input')) {
            box.checked = parbox.checked;
        }
        return;
    }

    let checked = null;
    let unchecked = null;
    for(const box of par.querySelectorAll('input')) {
        if(box === parbox) continue;
        if(box.checked)
            checked = true;
        else unchecked = true;
        if(checked === true && unchecked === true) {
            parbox.indeterminate = true;
            return;
        }
    }
    if(checked) parbox.checked = true;
    else parbox.checked = false;
    parbox.indeterminate = false;
};

const makeOption = (index,obj) => {
    const div = document.createElement('div');
    const box = document.createElement('input');
    box.setAttribute('type','checkbox');
    box.value = index;
    const label = document.createElement('label');
    label.title = `Search: ${obj.search} Replace: ${obj.replace.toString()}`;
    label.append(obj.name);
    div.appendChild(box);
    div.appendChild(label);
    return div;
};

const checkAll = (e) => {
    const details = e.target.parentNode.querySelector('details');
    details.open = true;
    const kids = details.querySelectorAll('input');
    for(const kid of kids) {
        kid.checked = e.target.checked;
    }
};

const updateBoxes = (e) => {
    if(e.target.tagName !== 'INPUT') return;
    const par = e.target.closest('details');
    const parbox = par.parentNode.querySelector('input');
    let checked = null;
    let unchecked = null;
    for(const box of par.querySelectorAll('input')) {
        if(box.checked)
            checked = true;
        else unchecked = true;
        if(checked === true && unchecked === true) {
            parbox.indeterminate = true;
            return;
        }
    }
    if(checked) parbox.checked = true;
    else parbox.checked = false;
    parbox.indeterminate = false;
};

window.addEventListener('load', () => {
    document.getElementById('teifiles').addEventListener('change',updatePreview);
    for(const box of document.querySelectorAll('.checklist'))
        box.addEventListener('click',updateCheckboxes);

    document.getElementById('alignsubmit').addEventListener('click', align);

    const normies = document.getElementById('normalization');
    
    for(const checkbox of normies.querySelectorAll('input'))
        checkbox.addEventListener('click',checkAll);

    const tamil = normies.querySelector('details.tamil');
    tamil.addEventListener('click',updateBoxes);
    const sanskrit = normies.querySelector('details.sanskrit');
    sanskrit.addEventListener('click',updateBoxes);
    for(const [i, filter] of filters.entries()) {
        if(filter.group === 'other')
            normies.insertBefore(makeOption(i,filter),tamil.parentNode);
        else if(filter.group === 'tamil')
            tamil.appendChild(makeOption(i,filter));
        else
            sanskrit.appendChild(makeOption(i,filter));
    }
});

