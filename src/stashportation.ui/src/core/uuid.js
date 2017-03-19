// Taken from StackOverflow
// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#answer-21963136

const lut = new Array(256);

// Initialize the lookup table once and then use it anywhere.
for(var i = 0; i < 16; ++i)
    lut[i] = '0'+i.toString(16);
for(var j = 16; j < 256; ++j)
    lut[j] = j.toString(16);

export default function generate() {
    var d0 = (Math.random()*0x100000000)>>0,
		d1 = (Math.random()*0x100000000)>>0,
		d2 = (Math.random()*0x100000000)>>0,
		d3 = (Math.random()*0x100000000)>>0;

    return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
        lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
        lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
        lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
}