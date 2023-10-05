import guideTree from './tree.mjs';
import { affineAlign, alignAlign, charConfig, arrConfig, simpleArrConfig, arrMsaConfig, simpleArrMsaConfig, charMsaConfig } from './affine-align.mjs';

var _msafunc, _pairfunc;

const alignToTree = (branch,textmap) => {
    if(branch.isLeaf()) {
        //console.log(branch.data.id);
        return {sigla: [branch.data.id], alignment: [textmap.get(branch.data.id)]};
    }

    const msa1 = alignToTree(branch.children[0],textmap);
    const msa2 = alignToTree(branch.children[1],textmap);

    if(msa1.sigla.length === 1 && msa2.sigla.length === 1) {
        //console.log([msa1.sigla[0],msa2.sigla[0]]);
        const psa = affineAlign(msa1.alignment[0],
                                 msa2.alignment[0],
                                 _pairfunc
                                );
        return {sigla: [msa1.sigla[0], msa2.sigla[0]], alignment: [psa[0],psa[1]]};
    }

    //console.log([...msa1.sigla,...msa2.sigla]);
    const msa3 = alignAlign(msa1.alignment,
                            msa2.alignment,
                            _msafunc
                           );
    return {sigla: [...msa1.sigla,...msa2.sigla], alignment: msa3};
};

const multiAlign = (arr,configfunc,scores) => {

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

    const textmap = new Map(texts);
    const alignment = alignToTree(guidetree,textmap);
    alignment.tree = guidetree.toNeXML();
    return alignment;
};

export default multiAlign;
