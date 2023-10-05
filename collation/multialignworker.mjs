import MultiAlign from './multialign.mjs';

onmessage = function(e) {
    const res = MultiAlign(...e.data);
    postMessage(res);
};
