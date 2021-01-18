/*
 * Library to convert formulas from infix, to postfix to prefix and evaluate expressions
 *
 */

// function fac (n) {
// 	res = 1;
// 	for (let i=1; i <= n; i++) {
// 		res = res * i;
// 	}
// 	return res;
// }

// Check if this is an operator
function isOperator (c) {

  switch (c) {
    case "+":
    case "-":
    case "*":
    case "%":
    case "^":
    case "/":
      return true;
    default:
      return false;
  }

}

// Get the operator priority
function getOperatorPriority (c) {

  switch (c) {
    case "+":
    case "-":
      return 1;
    case "*":
    case "%":
    case "/":
      return 2;
    case "^":
      return 3;
    case "!":
      return 4;
    default:
      return 0;
  }

}

/*
 * Evaluate a prefix expression
 *
 * @param string    s   the string with the expression
 *
 * @return integer      the result of the evaluation
 * 
 */

export function evalPrefix (s, base = 10) {

  // Create stack
  let stack = [];
  let res = 0;
  let op1, op2, e;

  // Decompose expression using regex
  let elems = s.match(/[0-9a-f]+|[-+*/^()!]/g);
  console.log(elems);

  // Scan prefix strang from end to begin
  for (let i = elems.length - 1; i >= 0; i--) {

      e = elems[i];

      if (!isOperator(e)) {

        // Push integer
        stack.push(parseInt(e, base));

      } else {  

        // Perform calculation
        op1 = stack.pop();
        op2 = stack.pop();
        switch (e) {
          case "+" :
            res = op1 + op2;
            break;
          case "-" :
            res = op1 - op2;
            break;
          case "*" :
            res = op1 * op2;
            break;
          case "%" :
            res = op1 % op2;
            break;
          case "^" :
            res = op1 ** op2;
            break;
          case "/" :
            res = op1 / op2;
            break;
          default :
            throw ("Illegal operator found");

        }
        stack.push(res);
      }
  }

  return stack.pop();

}

/*
 * Convert an infix expression to a prefix expression
 *
 * @param string    s   the string with the infix expression
 *
 * @return string   s   the string with the prefix expression
 * 
 */

export function in2Prefix (s) {
    
  // Create a postfix string
  let post = in2Postfix(s);
  let res = "";
  
  // Decompose expression using regex
  let elems = post.match(/[0-9a-f]+|[-+*/^()!]/g);

  for (let e = post.length-1; e >= 0; e--) {
    res += elems[e] + " ";
  }

  // Return infix
  return res;

}

/*
 * Convert an infix expression to a postfix expression
 *
 * @param string    s   the string with the infix expression
 *
 * @return string   s   the string with the prefix expression
 * 
 */

export function in2Postfix (s) {
    
  let stack = [];
  let res = "";
  let c2;
  
  // Decompose expression using regex
  let elems = s.match(/[0-9a-f]+|[-+*/^()!]/g);

  // Process all elements
  for (let e of elems) {

    if (e == "(") {

      // Push opening bracket
      stack.push(e);

    } else if (e == ")") {

      // Pop elements and add to string until ( is encountered)
      while (stack.length > 0 && (stack[stack.length-1] != "(")) {
          c2 = stack.pop();
          res += c2 + " ";
      }
      //Remove opening brack if any
      if (stack[stack.length-1] == "(") stack.pop(); 

    } else if (isOperator(e)) {

      // Pop and add to string until higher precedence operator is found
      while (stack.length > 0 && (getOperatorPriority(e) <= getOperatorPriority(stack[stack.length-1])) ) {
          c2 = stack.pop();
          res += c2 + " ";
      }

      // Now push lower precedence operator
      stack.push(e);

    } else {

      // Operand
      res += e + " ";
    }
  }

  // Clean stack
  while (stack.length > 0) {
    res += stack.pop() + " ";
  }
  return res;
}

/*
 * Evaluate a postfix expression
 *
 * @param string    s   the string with the infix expression
 *
 * @return integer   the outcome of the expression
 * 
 */

function evalPostfix (s, base = 10) {
	
  let stack = [];
  let op1, op2;

  // Decompose expression using regex
  let elems = s.match(/[0-9a-f]+|[-+*/^()!]/g);

  // Process each element
	for (let e of elems) {

    switch (e) {
			case "+" :
				op1 = stack.pop();
				op2 = stack.pop();
				stack.push(op2 + op1);
				break;
			case "*" :
				op1 = stack.pop();
				op2 = stack.pop();
				stack.push(op2 * op1);
				break;
			case "-" :
				op1 = stack.pop();
				op2 = stack.pop();
				stack.push(op2 - op1);
				break;
			case "/" :
				op1 = stack.pop();
				op2 = stack.pop();
				stack.push(op2 / op1);
				break;
			case "%" :
				op1 = stack.pop();
				op2 = stack.pop();
				stack.push(op2 % op1);
				break;
			case "^" :
				op1 = stack.pop();
				op2 = stack.pop();
				stack.push(op2 ** op1);
				break;
			default :
        stack.push (parseInt(e, base));
				break;
		}
	}
	return stack.pop();
}


export function evalInfix (s, base = 10) {

  return evalPostfix( in2Postfix(s), base );

}