const needlemanWunsch = (s1,s2,op={G:2,P:1,M:-1}) => {
    const UP   = Symbol('UP');
    const LEFT = Symbol('LEFT');
    const UL   = Symbol('UP-LEFT');

    const mat   = {};
    const direc = {};
    //const s1arr = s1.split('');
    const s1arr = s1;
    const s1len = s1arr.length;
    //const s2arr = s2.split('');
    const s2arr = s2;
    const s2len = s2arr.length;

    // initialization
    for(let i=0; i<s1len+1; i++) {
        mat[i] = {0:0};
        direc[i] = {0:[]};
        for(let j=1; j<s2len+1; j++) {
            mat[i][j] = (i === 0) ? 0 : 
                (s1arr[i-1] === s2arr[j-1]) ? op.P : op.M;
            direc[i][j] = [];
        }
    }

    // calculate each value
    for(let i=0; i<s1len+1; i++) {
        for(let j=0; j<s2len+1; j++) {
            const newval = (i === 0 || j === 0) ? 
                -op.G * (i + j) : 
                Math.max(mat[i-1][j] - op.G, mat[i-1][j-1] + mat[i][j], mat[i][j-1] - op.G);
            if (i > 0 && j > 0) {

                if( newval === mat[i-1][j] - op.G) direc[i][j].push(UP);
                if( newval === mat[i][j-1] - op.G) direc[i][j].push(LEFT);
                if( newval === mat[i-1][j-1] + mat[i][j]) direc[i][j].push(UL);
            }
            else {
                direc[i][j].push((j === 0) ? UP : LEFT);
            }
            mat[i][j] = newval;
        }
    }

    // get result
    const chars = [[],[]];
    var I = s1len;
    var J = s2len;
    //const max = Math.max(I, J);
    while(I > 0 || J > 0) {
        switch (direc[I][J][0]) {
        case UP:
            I--;
            chars[0].unshift(s1arr[I]);
            chars[1].unshift('');
            break;
        case LEFT:
            J--;
            chars[0].unshift('');
            chars[1].unshift(s2arr[J]);
            break;
        case UL:
            I--;
            J--;
            chars[0].unshift(s1arr[I]);
            chars[1].unshift(s2arr[J]);
            break;
        default: break;
        }
    }

    return chars;
};

export default needlemanWunsch;
