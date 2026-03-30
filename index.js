import readlinesync from 'readline-sync' 
import {Addition, Subtraction, Multipication, Division} from './CalculatorModule.js'

function getNumber(prompt){
 const value=readlinesync.questionInt(prompt);
 return value;
}

function main(){
    console.log("Calculator Application");
    console.log("1. Addition");
    console.log("2. Subtraction");
    console.log("3. Multiplication");
    console.log("4. Division");
    const choice =readlinesync.questionInt("Enter your choice: ");
   const firstNumber=getNumber('Enter first number');
   const secondNumber=getNumber('Enter second number');
   var result=0;
    switch(choice){
        case 1:
        result= Addition(firstNumber,secondNumber);
        break;
        case 2:
        result= Subtraction(firstNumber,secondNumber);
        break;
            case 2:
        result= Multipication(firstNumber,secondNumber);
        break;
            case 2:
        result= Division(firstNumber,secondNumber);
        break;
        default:
            console.log("Wrong choice");
    }
    console.log('Result: '+result);
   
}

main();

