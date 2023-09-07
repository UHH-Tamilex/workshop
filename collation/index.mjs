import { affineAlign, charConfig, arrConfig, simpleArrConfig } from './affine-align.mjs';
import { filters, filterAll, unfilterAll } from './normalize.mjs';
import { aksaraSplit, charSplit, graphemeSplit } from './split.mjs';

const align = () => {

const fis = getFilterIndices();
const strs = [...document.querySelectorAll('.input-box input')].map(b => b.value);
const filtered = strs.map(s => filterAll(s,fis));

const tok = document.querySelector('input[name="tokenization"]:checked').value;

const splitfunc = ((tok) => {
    switch(tok) {
        case 'whitespace': return (str) => str.split(/(\s+)/g);
        case 'aksara': return aksaraSplit;
        case 'grapheme': return graphemeSplit;
        default: return charSplit;
    }
})(tok);

const split = filtered.map(f => splitfunc(f[0]));

const scores = getScores();
const configfunc = tok === 'char' ? charConfig : 
    scores.recursive ? arrConfig : simpleArrConfig;
const res = affineAlign(...split,new configfunc(...scores.scores,false), {alignment: true, matrix: true});

const path = res.pop();
const matrix = res.pop();
const score = res.pop();

const unfiltered = res.map((r,i) => 
    unfilterAll(
        r.map(b => Array.isArray(b) ? b.join('') : b),
        filtered[i][1]
    )
);
const filteredseqs = res.map(f => f.map(b => Array.isArray(b) ? b.join('') : b));
showResults(unfiltered,filteredseqs,score);
showMatrix(split.map(f => f.map(b => Array.isArray(b) ? b.join('') : b)),matrix,path);
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

const getScores = () => {
    const par = document.getElementById('scoring');
    const nums = [...document.querySelectorAll('#scoring input[type="number"]')].map(i => parseFloat(i.value));
    const recursive = par.querySelector('input[type="checkbox"]').checked;
    return {scores: nums, recursive: recursive};
};

const makeRuby = (base, anno) => {
    const ruby = document.createElement('ruby');
    const rt = document.createElement('rt');
    rt.append(anno);
    ruby.append(base);
    ruby.append(rt);
    return ruby;
};

const showResults = (arr,arr2,score) => {
    const scorebox = document.getElementById('score');
    scorebox.textContent = '';
    scorebox.append(`Score: ${score}`);

    const body = document.getElementById('results').firstElementChild;
    body.innerHTML = '';
    for(const [n,seq] of arr.entries()) {
        const tr = document.createElement('tr');
        const seq2 = arr2[n];
        for(const [m,cell] of seq.entries()) {
            const td = document.createElement('td');

            const filtered = seq2[m];
            if(filtered !== cell.trim())
                td.append(makeRuby(cell,filtered));
            else
                td.append(cell);
            tr.appendChild(td);
        }
        body.appendChild(tr);
    }
};

const showMatrix = (seqs,matrix,path) => {
    const table = document.getElementById('matrix');
    table.closest('details').style.display = 'unset';
    const body = table.firstElementChild;

    body.innerHTML = '';
    const firsttr = document.createElement('tr');
    firsttr.appendChild(document.createElement('td'));
    firsttr.appendChild(document.createElement('td'));
    for(const cell of seqs[1]) {
        const td = document.createElement('td');
        td.append(cell);
        firsttr.appendChild(td);
    }
    body.appendChild(firsttr);
    for(const [x,row] of matrix.entries()) {
        const tr = document.createElement('tr');
        const firsttd = document.createElement('td');
        if(x > 0)
            firsttd.append(seqs[0][x-1]);
        tr.append(firsttd);
        for(const [y,cell] of row.entries()) {
            const td = document.createElement('td');
            td.append(parseFloat(cell.toFixed(2)));
            if(path.has(`${x},${y}`))
                td.className = 'highlit';
            tr.append(td);
        }
        body.append(tr);
    }
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

window.addEventListener('load',() => {
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
