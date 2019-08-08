var js_wrapped_fib = Module.cwrap("fib", "number", ["number"]);
var js_wrapped_main = Module.cwrap("main", "number");
var js_wrapped_te_interp = Module.cwrap("te_interp", "number", [
  "string",
  "number"
]);

var addOne = Module.cwrap("addOne", null, ["number", "number", "number"]);
var countOccurrences = Module.cwrap("countOccurrences", "number", [
  "number",
  "number",
  "number"
]); // note that also the target char is passed as number (char is an unsigned 8-bit integer)

function chaine() {
  var str = "string to examine for this exampleeeeeeee";
  var target = "e";
  var len = str.length;

  var converted_str = new Uint8Array(toUTF8Array(str)); // array of bytes (8-bit unsigned int) representing the string
  var converted_target = toUTF8Array(target)[0]; // byte representing the target (8-bit unsigned int)

  // alloc memory
  var input_ptr = Module._malloc(len * 1); // 1 byte per element (left just to see)

  Module.HEAPU8.set(converted_str, input_ptr); // write WASM memory calling the set method of the Uint8Array
  var occurrences = countOccurrences(input_ptr, len, converted_target); // call the WASM function
  console.log("Occurrences found: ", occurrences);

  // dealloc memory
  Module._free(input_ptr);
}

// source: https://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
function toUTF8Array(str) {
  var utf8 = [];
  for (var i = 0; i < str.length; i++) {
    var charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(
        0xe0 | (charcode >> 12),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      );
    } else {
      i++;
      charcode =
        0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      );
    }
  }
  return utf8;
}

function ajoute1() {
  var input_array = new Int32Array([10, 5, -3, 120, -70]); // array of 32-bit signed int to pass
  var len = input_array.length; // 5 elements
  var bytes_per_element = input_array.BYTES_PER_ELEMENT; // 4 bytes each element

  // alloc memory, in this case 5*4 bytes
  var input_ptr = Module._malloc(len * bytes_per_element);
  var output_ptr = Module._malloc(len * bytes_per_element);

  Module.HEAP32.set(input_array, input_ptr / bytes_per_element); // write WASM memory calling the set method of the Int32Array, (see below for details)
  addOne(input_ptr, output_ptr, len); // call the WASM function
  var output_array = new Int32Array(Module.HEAP32.buffer, output_ptr, len); // extract data to another JS array
  console.log("The starting array was:", input_array);
  console.log("The result read is:	", output_array);

  // dealloc memory
  Module._free(input_ptr);
  Module._free(output_ptr);
}

function pressBtn() {
  console.log("The result of fib(5) is:", js_wrapped_fib(5));
  console.log(
    `De JS : appel de te_inter("(2+23)/5-1", 0) = ${js_wrapped_te_interp(
      "(2+23)/5-1",
      0
    )}`
  );
  js_wrapped_main();

  //ajoute1();
}

function set_background_color(color_idx) {
  var color = "red";
  if (color_idx == 1) color = "blue";
  else if (color_idx == 2) color = "green";

  document.body.style.backgroundColor = color; // set the new background color
}
