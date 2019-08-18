# webassemblytests (Emscripten)

WebAssembly talk :
https://www.youtube.com/watch?v=qDTpLKJ6e4M&t=124s

WebAssembly install : 
https://webassembly.org/getting-started/developers-guide/

Tutorial for dummies :
https://marcoselvatici.github.io/WASM_tutorial/index.html

#compile with :
emcc hello.c tinyexpr.c -o hello.html -O2 -s WASM=1 -s EXPORTED_FUNCTIONS='["_fib","_main","_te_interp","_addOne","_countOccurrences"]' -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap", "getValue", "setValue"]'
