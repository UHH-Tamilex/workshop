import {charSplit, aksaraSplit, graphemeSplit, iast} from './split.mjs';

const scorechar = ({match = 1, mismatch = -1}) => (s1,i,s2,j) => {
    const a = s1[i];
    const b = s2[j];
    if(a === b) return match;
    //if(a === '' && b === ' ') return 1;
    //if(a === ' ' && b === '') return 1;
    //if(a === '' || b === '') return -2;
    //if(a === ' ' || b === ' ') return -2;
    //if(iast.vowels.has(a) && iast.vowels.has(b)) return mismatch/2;
    return mismatch;
};

const scorearr = ({match = 1, mismatch = -1, gap_open = 0, gap_extend = -2}) => (s1,i,s2,j) => {
    const a = s1[i];
    const b = s2[j];
    const score = a.length === 1 && b.length === 1 ?
        scorechar({match: match, mismatch: mismatch})(a,0,b,0) :
        affineAlign(a,b,new charConfig(match,mismatch,gap_open,gap_extend,false),{alignment: false});
    return score / Math.max(a.length,b.length);
};

const scorearr_simple = ({match = 1, mismatch = -1}) => (s1,i,s2,j) => {
    const a = s1[i];
    const b = s2[j];
    if(a.length !== b.length) return mismatch;

    for(let n=0;n<a.length;n++)
        if(a[n] !== b[n]) return mismatch;

    return match;
};

const scoremsa = (scorefn) => (arr1,i,arr2,j) => {
    let score = 0;
    let divisor = 0;
    for(const s1 of arr1) {
        for(const s2 of arr2) { 
            const newscore = scorefn(s1,i,s2,j);
            score = score + newscore;
            divisor = divisor + 1;
        }
    }
    return score/divisor;
};

/*
const AlignConfig = function(scorefn, gap_open, gap_extend, gap_skip_initial) {
    this.scorefn = scorefn;
    this.gap = {
        open: gap_open,
        extend: gap_extend,
        skip_initial: gap_skip_initial
    };
};
*/
const arrConfig = function(match, mismatch, gap_open, gap_extend, gap_skip_initial) {
    this.scorefn = scorearr({
        match: match, 
        mismatch: mismatch, 
        gap_open: gap_open, 
        gap_extend: gap_extend
    });
    this.gap = {
        open: gap_open,
        extend: gap_extend,
        skip_initial: gap_skip_initial
    };
};
const arrMsaConfig = function(match, mismatch, gap_open, gap_extend, gap_skip_initial) {
    const scorefn = scorearr({
        match: match, 
        mismatch: mismatch, 
        gap_open: gap_open, 
        gap_extend: gap_extend
    });
    this.scorefn = scoremsa(scorefn);
    this.gap = {
        open: gap_open,
        extend: gap_extend,
        skip_initial: gap_skip_initial
    };
};
const simpleArrConfig = function(match, mismatch, gap_open, gap_extend, gap_skip_initial) {
    this.scorefn = scorearr_simple({match: match, mismatch: mismatch});
    this.gap = {
        open: gap_open,
        extend: gap_extend,
        skip_initial: gap_skip_initial
    };
};

const simpleArrProfileConfig = function(match, mismatch, gap_open, gap_extend, gap_skip_initial) {
    const scorefn = scorearr_simple({match: match, mismatch: mismatch});
    this.scorefn = scoremsa(scorefn);
    this.gap = {
        open: gap_open,
        extend: gap_extend,
        skip_initial: gap_skip_initial
    };
};
const charConfig = function(match, mismatch, gap_open, gap_extend, gap_skip_initial) {
    this.scorefn = scorechar({match: match, mismatch: mismatch});
    this.gap = {
        open: gap_open,
        extend: gap_extend,
        skip_initial: gap_skip_initial
    };
};
const charProfileConfig = function(match, mismatch, gap_open, gap_extend, gap_skip_initial) {
    const scorefn = scorechar({match: match, mismatch: mismatch});
    this.scorefn = scoremsa(scorefn);
    this.gap = {
        open: gap_open,
        extend: gap_extend,
        skip_initial: gap_skip_initial
    };
};
/*
const graphemeConfig = new AlignConfig(
    scorearr({match: 1, mismatch: -1, gap_open: -2, gap_extend: -0.25}),
    //scorearr_simple({match: 1, mismatch: -1}),
    -2,
    -0.25,
    false
);

const charConfig = new AlignConfig(
    scorechar({match: 1, mismatch: -1}),
    -2,
    -0.25,
    false
);
*/
const affineAlign = (s1arr,
                     s2arr,
                     config = new charConfig(1,-1,-2,-0.25,false),
                     options = {
                         alignment: true,
                         matrix: false
                        }
                     ) => {
    const UP   = Symbol('UP');
    const LEFT = Symbol('LEFT');
    const UL   = Symbol('UP-LEFT');

    const s1len = s1arr.length;
    const s2len = s2arr.length;

    // initialize matrix
    const mat    = new Array(s1len);
    const igap   = new Array(s1len);
    const jgap   = new Array(s1len);
    const direc  = new Array(s1len);

    for(let i=0; i<s1len+1; i++) {
        mat[i] = new Array(s2len+1);
        igap[i] = new Array(s2len+1);
        jgap[i] = new Array(s2len+1);
        direc[i] = new Array(s2len+1);
    
        if(i === 0) {
            mat[0][0] = 0;
            igap[0][0] = 0;
            jgap[0][0] = 0;
            direc[0][0] = null;
        }
        else {
            const score = config.gap.skip_initial ? 
                config.gap.extend * i :
                config.gap.open + config.gap.extend * i;
            mat[i][0] = score;
            igap[i][0] = score;
            jgap[i][0] = i === 0 ? 0 : null;
            direc[i][0] = UP;
        }
    }
    for(let j=1; j<s2len+1; j++) {
        // no gap opening penalty at the beginning
        const score = config.gap.skip_initial ? 
            config.gap.extend * j :
            config.gap.open + config.gap.extend * j;
        mat[0][j] = score;
        igap[0][j] = null;
        jgap[0][j] = score;
        direc[0][j] = LEFT;
    }

    // calculate scores
    for(let i=1; i<s1len+1; i++) {
        for(let j=1; j<s2len+1; j++) {
            const ulscore = mat[i-1][j-1] + config.scorefn(s1arr,i-1,s2arr,j-1);
            
            // no gap opening penalty at the bottom row
            const bottomrow = config.gap.skip_initial && j === s2len;
            const igapopen = bottomrow ? 
                mat[i-1][j] :
                mat[i-1][j] + config.gap.open;

            const previgap = igap[i-1][j];
            const igapmax = previgap !== null ?
                Math.max(igapopen,previgap) + config.gap.extend : igapopen + config.gap.extend;

            // no gap opening penalty at the last column
            const lastcol = config.gap.skip_initial && i === s1len;
            const jgapopen = lastcol ? 
                mat[i][j-1] :
                mat[i][j-1] + config.gap.open;
           
            const prevjgap = jgap[i][j-1];
            const jgapmax = prevjgap !== null ?
                Math.max(jgapopen,prevjgap) + config.gap.extend : jgapopen + config.gap.extend;

            const maxval = Math.max(ulscore,igapmax,jgapmax);

            mat[i][j] = maxval;
            igap[i][j] = igapmax;
            jgap[i][j] = jgapmax;

            if( maxval === igapmax) direc[i][j] = UP;
            else if( maxval === jgapmax) direc[i][j] = LEFT;
            else if( maxval === ulscore) direc[i][j] = UL;
        }
    }
    
    if(options.alignment !== true)
            return mat[s1len][s2len];

    // traceback
    const chars = [[],[]];
    var I = s1len;
    var J = s2len;
    const path = [[s1len,s2len]];
    while(I > 0 || J > 0) {
        switch (direc[I][J]) {
        case UP:
            I--;
            chars[0].unshift(s1arr[I]);
            chars[1].unshift('');
            path.unshift([path[0][0]-1,path[0][1]]);
            break;
        case LEFT:
            J--;
            chars[0].unshift('');
            chars[1].unshift(s2arr[J]);
            path.unshift([path[0][0],path[0][1]-1]);
            break;
        case UL:
            I--;
            J--;
            chars[0].unshift(s1arr[I]);
            chars[1].unshift(s2arr[J]);
            path.unshift([path[0][0]-1,path[0][1]-1]);
            break;
        default: break;
        }
    }
    
    if(options.matrix)
        return [...chars,mat[s1len][s2len],mat,new Set(path.map(p => p.join(',')))];
    else
        return [...chars,mat[s1len][s2len]];
        
};
const alignAlign = (p1arr,
                     p2arr,
                     config = new charProfileConfig(1,-1,-2,-0.25,false)
                   ) => {
    const UP   = Symbol('UP');
    const LEFT = Symbol('LEFT');
    const UL   = Symbol('UP-LEFT');

    const p1len = p1arr[0].length;
    const p2len = p2arr[0].length;

    // initialize matrix
    const mat    = new Array(p1len);
    const igap   = new Array(p1len);
    const jgap   = new Array(p1len);
    const direc  = new Array(p1len);

    for(let i=0; i<p1len+1; i++) {
        mat[i] = new Array(p2len+1);
        igap[i] = new Array(p2len+1);
        jgap[i] = new Array(p2len+1);
        direc[i] = new Array(p2len+1);
    
        if(i === 0) {
            mat[0][0] = 0;
            igap[0][0] = 0;
            jgap[0][0] = 0;
            direc[0][0] = null;
        }
        else {
            const score = config.gap.skip_initial ? 
                config.gap.extend * i :
                config.gap.open + config.gap.extend * i;
            mat[i][0] = score;
            igap[i][0] = score;
            jgap[i][0] = i === 0 ? 0 : null;
            direc[i][0] = UP;
        }
    }
    for(let j=1; j<p2len+1; j++) {
        // no gap opening penalty at the beginning
        const score = config.gap.skip_initial ? 
            config.gap.extend * j :
            config.gap.open + config.gap.extend * j;
        mat[0][j] = score;
        igap[0][j] = null;
        jgap[0][j] = score;
        direc[0][j] = LEFT;
    }

    // calculate scores
    for(let i=1; i<p1len+1; i++) {
        for(let j=1; j<p2len+1; j++) {
            const ulscore = mat[i-1][j-1] + config.scorefn(p1arr,i-1,p2arr,j-1);
            
            // no gap opening penalty at the bottom row
            const bottomrow = config.gap.skip_initial && j === p2len;
            const igapopen = bottomrow ? 
                mat[i-1][j] :
                mat[i-1][j] + config.gap.open;

            const previgap = igap[i-1][j];
            const igapmax = previgap !== null ?
                Math.max(igapopen,previgap) + config.gap.extend : igapopen + config.gap.extend;

            // no gap opening penalty at the last column
            const lastcol = config.gap.skip_initial && i === p1len;
            const jgapopen = lastcol ? 
                mat[i][j-1] :
                mat[i][j-1] + config.gap.open;
           
            const prevjgap = jgap[i][j-1];
            const jgapmax = prevjgap !== null ?
                Math.max(jgapopen,prevjgap) + config.gap.extend : jgapopen + config.gap.extend;

            const maxval = Math.max(ulscore,igapmax,jgapmax);

            mat[i][j] = maxval;
            igap[i][j] = igapmax;
            jgap[i][j] = jgapmax;

            if( maxval === igapmax) direc[i][j] = UP;
            else if( maxval === jgapmax) direc[i][j] = LEFT;
            else if( maxval === ulscore) direc[i][j] = UL;
        }
    }

    // traceback
    const chars1 = new Array(p1arr.length);
    for(let n=0;n<p1arr.length;n++)
        chars1[n] = [];
    const chars2 = new Array(p2arr.length);
    for(let n=0;n<p2arr.length;n++)
        chars2[n] = [];
    var I = p1len;
    var J = p2len;
    while(I > 0 || J > 0) {
        switch (direc[I][J]) {
        case UP:
            I--;
            for(let n=0;n<chars1.length;n++)
                chars1[n].unshift(p1arr[n][I]);
            for(let n=0;n<chars2.length;n++)
                chars2[n].unshift('');
            break;
        case LEFT:
            J--;
            for(let n=0;n<chars1.length;n++)
                chars1[n].unshift('');
            for(let n=0;n<chars2.length;n++)
                chars2[n].unshift(p2arr[n][J]);
            break;
        case UL:
            I--;
            J--;
            for(let n=0;n<chars1.length;n++)
                chars1[n].unshift(p1arr[n][I]);
            for(let n=0;n<chars2.length;n++)
                chars2[n].unshift(p2arr[n][J]);
            break;
        default: break;
        }
    }

    return [[...chars1,...chars2],mat[p1len][p2len]];
        
};
export {affineAlign, alignAlign, charConfig, arrConfig, simpleArrConfig, arrMsaConfig};
