import guideTree from './tree.mjs';
import { affineAlign, alignAlign, charConfig, arrConfig, simpleArrConfig, arrMsaConfig, simpleArrMsaConfig, charMsaConfig } from './affine-align.mjs';

var _msafunc, _pairfunc;

const _progress = {
    total: 0,
    cur: 0,
    update: (message,addone = true) => {
        if(addone) _progress.cur = _progress.cur + 1;
        const ret = {progress: _progress.cur/_progress.total};
        if(message) ret.message = message;
        postMessage(ret);
    }
};

const alignToTree = (branch,textmap) => {
    if(branch.isLeaf()) {
        //console.log(branch.data.id);
        return {sigla: [branch.data.id], alignment: [textmap.get(branch.data.id)]};
    }

    const msa1 = alignToTree(branch.children[0],textmap);
    const msa2 = alignToTree(branch.children[1],textmap);

    if(msa1.sigla.length === 1 && msa2.sigla.length === 1) {
        //console.log([msa1.sigla[0],msa2.sigla[0]]);
        _progress.update();
        const psa = affineAlign(msa1.alignment[0],
                                 msa2.alignment[0],
                                 _pairfunc
                                );
        return {sigla: [msa1.sigla[0], msa2.sigla[0]], alignment: [psa[0],psa[1]]};
    }

    //console.log([...msa1.sigla,...msa2.sigla]);
    _progress.update();
    const msa3 = alignAlign(msa1.alignment,
                            msa2.alignment,
                            _msafunc
                           );
    return {sigla: [...msa1.sigla,...msa2.sigla], alignment: msa3};
};

const multiAlign = (arr,configfunc,scores) => {
    const realignments = scores.pop();
    const msafunc = configfunc === 'arr' ? arrMsaConfig :
        configfunc === 'arr_simple' ? simpleArrMsaConfig :
        charMsaConfig;
    const pairfunc = configfunc === 'arr' ? arrConfig :
        configfunc === 'arr_simple' ? simpleArrConfig :
        charConfig;
    _msafunc = new msafunc(...scores);
    _pairfunc = new pairfunc(...scores);
    const texts = arr.map(a => [a.siglum, a.text]);

    const guidetree = guideTree(texts,2);
    
    _progress.total = guidetree.descendants().length - guidetree.leaves().length;
    _progress.cur = 0;

    const textmap = new Map(texts);
    const alignment = alignToTree(guidetree,textmap);
    alignment.tree = guidetree.toNeXML();
    
    if(realignments)
        return reAlign(alignment,guidetree,realignments);
    else
        return alignment;

    //return alignment;
};

const sumOfPairs = (alignment,skip = new Map()) => {
    //skip = new Map();
    for(let n=0; n < alignment.sigla.length-1; n++) {
        for(let m=n+1; m < alignment.sigla.length; m++) {
            const ids = [alignment.sigla[n],alignment.sigla[m]];
            ids.sort();
            const id = ids.join('');

            if(skip.has(id)) continue;

            skip.set(id, pairScore(alignment.alignment[n], alignment.alignment[m]));
        }
    }
    return {
        scores: skip,
        total: [...skip.values()].reduce((acc,cur) => acc + cur,0)
    };
};

const pairScore = (seq1, seq2) => {
    let ret = 0;
    let seq1gapopen = false;
    let seq2gapopen = false;

    for(let n=0; n<seq1.length; n++ ) {
        if(seq1[n] === '' && seq2[n] === '') continue;
        if(seq1[n] === '') {
            seq2gapopen = false;
            if(!seq1gapopen) {
                seq1gapopen = true;
                ret = ret + _pairfunc.gap.open + _pairfunc.gap.extend;
            }
            else ret = ret + _pairfunc.gap.extend;
        }
        else if(seq2[n] === '') {
            seq1gapopen = false;
            if(!seq2gapopen) {
                seq2gapopen = true;
                ret = ret + _pairfunc.gap.open + _pairfunc.gap.extend;
            }
            else ret = ret + _pairfunc.gap.extend;
        }
        else {
            seq1gapopen = false;
            seq2gapopen = false;
            ret = ret + _pairfunc.scorefn(seq1,n,seq2,n);
        }
    }
    return ret;
};
/*
const pairScore2 = (seq1, seq2) => {
    // https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0160043
    let ret = 0;
    const seq1g = [];
    const seq2g = [];

    for(let n=0; n<seq1.length; n++ ) {
        if(!(seq1[n] === '' && seq2[n] === '')) {
            seq1g.push(seq1[n]);
            seq2g.push(seq2[n]);
        }
        if(seq1[n] !== '' && seq2[n] !== '')
            ret = ret + _pairfunc.scorefn(seq1,n,seq2,n);
    }
    for(const gaplength of [...collateGaps(seq1g),...collateGaps(seq2g)])
        ret = ret + _pairfunc.gap.open + _pairfunc.gap.extend * gaplength;

    return ret;
};

const collateGaps = (seq) => {
    const ret = [];
    let cur = null;
    for(let n=0;n<seq.length;n++) {
        if(seq[n] === '')
            if(cur === null)
                cur = 1;
            else cur = cur + 1;
        if(seq[n] !== '' && cur !== null) {
            ret.push(cur);
            cur = null;
        }
    }
    if(cur !== null) ret.push(cur);
    return ret;
};
*/
const reAlignBranch = (alignment,sigla1,sigla2) => {

    const filterAlignments = (full, part) => {
        const indices = part.sigla.map(s => full.sigla.indexOf(s));
        for(const index of indices)
            part.alignment.push(structuredClone(full.alignment[index]));
        const removesites = [];
        for(let n=0;n<part.alignment[0].length;n++) {
            let allgaps = true;
            for(let m=0;m<part.alignment.length;m++) {
                if(part.alignment[m][n] !== '') {
                    allgaps = false;
                    break;
                }
            }
            if(allgaps) removesites.unshift(n);
        }
        for(const site of removesites)
            for(const alignment of part.alignment)
                alignment.splice(site,1);
    };

    const msa1 = {sigla: sigla1, alignment: []};
    const msa2 = {sigla: sigla2, alignment: []};
    filterAlignments(alignment,msa1);
    filterAlignments(alignment,msa2);

    if(msa1.sigla.length === 1 && msa2.sigla.length === 1) {
        //console.log(msa1.sigla[0] + ' vs. ' + msa2.sigla.join(', '));
        const psa = affineAlign(msa1.alignment[0],
                                 msa2.alignment[0],
                                 _pairfunc
                                );
        return {sigla: [msa1.sigla[0], msa2.sigla[0]], alignment: [psa[0],psa[1]], tree: alignment.tree};
    }

    //console.log(msa1.sigla.join(', ') + ' vs. ' + msa2.sigla.join(', '));
    const msa3 = alignAlign(msa1.alignment,
                            msa2.alignment,
                            _msafunc
                           );
    return {sigla: [...msa1.sigla,...msa2.sigla], alignment: msa3, tree: alignment.tree};
};

const reAlign = (alignment,tree,maxlevel) => {
    //console.log('realigning');

    const originalorder = [...alignment.sigla];

    let sop = sumOfPairs(alignment);
    //console.log(sop);

    const levels = [];
    for(const node of tree.descendants()) {
        const arr = levels[node.depth];
        if(arr)
            arr.push(node);
        else
            levels[node.depth] = [node];
    }
    levels.reverse();
    levels.pop();
   
    const sortfn = (a,b) => tree.depthOf(a) > tree.depthOf(b) ? -1 : 1;
    // sometimes the results are better if levels are sorted with shortest to longest depth?
    for(const level of levels)
        level.sort(sortfn);

    const realmax = Math.min(maxlevel,levels.length-1);
    _progress.total = realmax;
    _progress.cur = 0;
    _progress.update('Improving alignment...',false);

    for(let n=0;n<=realmax;n++) {
        const level = levels[n];
        //if(!level) break;
        for(const node of level) {
            const curleaves = node.isLeaf() ? [node.id] : node.getLeaves().map(l => l.id);
            curleaves.sort();
            const otherleaves = alignment.sigla.filter(s => !curleaves.includes(s));

            const newalignment = reAlignBranch(alignment,curleaves,otherleaves);
            
            const changedids = [];
            const skip = new Map(sop.scores);
            for(const curleaf of curleaves) {
                for(const otherleaf of otherleaves) {
                    const arr = [curleaf,otherleaf];
                    arr.sort();
                    skip.delete(arr.join(''));
                }
            }
            const newsop = sumOfPairs(newalignment,skip);
            //console.log(`level ${n}, SoP: ${newsop.total}`);
            if(newsop.total > sop.total) {
                alignment = newalignment;
                sop = newsop;
            }
        }
        _progress.update();
    }

    const reordered = [];
    for(const siglum of originalorder)
        reordered.push(alignment.alignment[alignment.sigla.indexOf(siglum)]);
    return {sigla: originalorder, alignment: reordered, tree: alignment.tree};
};

export default multiAlign;
