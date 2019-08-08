#include <stdio.h>
#include <emscripten.h> // note we added the emscripten header
#include <time.h>   // for time
#include <stdlib.h> // for rand
#include "tinyexpr.h"

int countOccurrences(char* str, int len, char target){
	int i, count = 0;
	for(i = 0; i < len; i++){
    	if(str[i] == target){
        	count++;
    	}
	}
	return count;
}

// now the pointers represent two array of length equal to len
void addOne(int* input_ptr, int* output_ptr, int len){
	int i;
	for(i = 0; i < len; i++)
    	output_ptr[i] = input_ptr[i] + 1;
}

int fib(int n){
    if(n == 0 || n == 1)
        return 1;
    else
        return fib(n - 1) + fib(n - 2);
}

int main(){
    printf("Hello world!\n");
    int res = fib(5);
    printf("fib(5) = %d\n", res);
    printf("WASM is running!");
    emscripten_run_script("alert('I have been called from C!')");
    //emscripten_run_script("set_background_color(1)");

    srand(time(NULL));      	// initialize random seed
    int color_idx = rand() % 255; // could be 0, 1 or 2
    
    EM_ASM(
        // here you can write inline javascript code!
        console.log("(1) I have been printed from inline JavaScript!");
        console.log("I have no parameters and I do not return anything :(");
        // end of javascript code
    );
        
    // note the underscore and the curly brackets (to pass one or more parameters)
    EM_ASM_({
        console.log("(2) I have received a parameter! It is:", $0);
        console.log("Setting the background to that color index!");
        set_background_color($0);
    }, color_idx);
        
    // note that you have to specify the return type after EM_ASM_
    int result = EM_ASM_INT({
        console.log("(3) I received two parameters! They are:", $0, $1);
        console.log("Let's return their sum!");
        return sum($0, $1);
    
        function sum(a, b){
            return a + b;
        }
    }, 13, 10);
    
    printf("(4) The C code received %d as result!\n", result);

    printf("The result of (2+23)/5-1 is: %f\n", te_interp("(2+23)/5-1", 0));
    
    return 0;
}