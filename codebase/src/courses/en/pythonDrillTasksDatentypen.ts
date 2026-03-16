import type { DrillTask } from "@/types/courseTypes";

/**
 * Complete English translations for all Python drill tasks
 * IDs are kept identical to German version for static mapping
 */

export const datentypenDrillsEn: DrillTask = {
  topic: "Datentypen",
  mcQuestions: [
    {
      id: "mcq-datentypen-1",
      type: "multiple-choice",
      question: "What is the difference between 77 and '77'?",
      options: [
        "None, both are the same",
        "77 is a number, '77' is text",
        "'77' is a number, 77 is text",
        "77 is faster than '77'"
      ],
      correctAnswer: "77 is a number, '77' is text",
      explanation: "Without quotes = number, with quotes = text (string)"
    },
    {
      id: "mcq-datentypen-2",
      type: "spot-the-error",
      question: "Find the error - we want to store weight as a number:",
      code: "weight = \"77\"",
      options: [
        "Missing a semicolon",
        "weight is not a valid name",
        "The quotes make 77 text instead of a number",
        "No error"
      ],
      correctAnswer: "The quotes make 77 text instead of a number",
      explanation: "For calculations we need numbers: weight = 77 (without quotes)"
    },
    {
      id: "mcq-datentypen-3",
      type: "predict-output",
      question: "What happens with this code?",
      code: "x = \"10\"\ny = 5\nresult = x + y\nprint(result)",
      options: ["15", "105", "Error", "10 5"],
      correctAnswer: "Error",
      explanation: "You cannot add text ('10') with a number (5). This causes a TypeError."
    },
    {
      id: "mcq-datentypen-4",
      type: "multiple-choice",
      question: "Which statement is correct?",
      options: [
        "Text always needs quotes in Python",
        "Numbers need quotes",
        "Both need quotes",
        "Nothing needs quotes"
      ],
      correctAnswer: "Text always needs quotes in Python",
      explanation: "Text/Strings: 'Hello' or \"Hello\". Numbers: 42 or 3.14 (without quotes)"
    },
    {
      id: "mcq-datentypen-5",
      type: "multiple-choice",
      question: "Which calculation rule applies in Python?",
      options: [
        "Left to right",
        "Multiplication before addition (then left to right)",
        "Parentheses before multiplication before addition",
        "Addition before multiplication"
      ],
      correctAnswer: "Parentheses before multiplication before addition",
      explanation: "Like in math: parentheses first, then * and /, then + and -"
    },
    {
      id: "mcq-datentypen-6",
      type: "predict-output",
      question: "What does this code output?",
      code: "result = 10 + 5 * 2\nprint(result)",
      options: ["30", "20", "15", "Error"],
      correctAnswer: "20",
      explanation: "Multiplication first: 5 * 2 = 10, then 10 + 10 = 20"
    },
    {
      id: "mcq-datentypen-7",
      type: "predict-output",
      question: "What does this code output?",
      code: "result = (10 + 5) * 2\nprint(result)",
      options: ["30", "20", "15", "17"],
      correctAnswer: "30",
      explanation: "Parentheses first: (10 + 5) = 15, then 15 * 2 = 30"
    },
    {
      id: "mcq-datentypen-8",
      type: "multiple-choice",
      question: "How do you calculate 5% of 100?",
      options: ["100 * 5", "100 * 0.05", "100 / 5", "100 + 5"],
      correctAnswer: "100 * 0.05",
      explanation: "5% = 5/100 = 0.05, so 100 * 0.05 = 5"
    },
    {
      id: "mcq-datentypen-9",
      type: "predict-output",
      question: "What does this code output?",
      code: "price = 100\ndiscount = 20\nnew_price = price * (1 - discount/100)\nprint(new_price)",
      options: ["80", "80.0", "120", "20"],
      correctAnswer: "80.0",
      explanation: "20% discount: 100 * (1 - 0.20) = 100 * 0.80 = 80.0"
    },
    {
      id: "mcq-datentypen-10",
      type: "multiple-choice",
      question: "What is the data type of 3.14?",
      options: [
        "int (integer)",
        "float (decimal number)",
        "str (text)",
        "bool (boolean)"
      ],
      correctAnswer: "float (decimal number)"
    },
    {
      id: "mcq-datentypen-11",
      type: "predict-output",
      question: "What does this code output?",
      code: "print(8 / 2)",
      options: ["4", "4.0", "4,0", "Error"],
      correctAnswer: "4.0",
      explanation: "Division (/) in Python ALWAYS returns a float, even for whole numbers."
    },
    {
      id: "mcq-datentypen-12",
      type: "spot-the-error",
      question: "What is wrong?",
      code: "temperature = 22,5",
      options: [
        "Comma instead of period for decimal number",
        "temperature is a reserved word",
        "Missing quotes",
        "No error"
      ],
      correctAnswer: "Comma instead of period for decimal number",
      explanation: "Python uses the PERIOD for decimal numbers: 22.5 (not 22,5)"
    },
    {
      id: "mcq-datentypen-13",
      type: "predict-output",
      question: "What is 7 + 3 * 2?",
      code: "print(7 + 3 * 2)",
      options: ["13", "20", "17", "Error"],
      correctAnswer: "13",
      explanation: "Multiplication first: First 3 * 2 = 6, then 7 + 6 = 13"
    },
    {
      id: "mcq-datentypen-14",
      type: "fill-the-blank",
      question: "What is missing for the result 36?",
      code: "print((4 + 2) ___ 6)",
      options: ["+", "-", "*", "/"],
      correctAnswer: "*",
      explanation: "(4 + 2) = 6, and 6 * 6 = 36"
    },
    {
      id: "mcq-datentypen-15",
      type: "multiple-choice",
      question: "Which data type is used for whole numbers?",
      options: ["float", "int", "str", "num"],
      correctAnswer: "int"
    },
    {
      id: "mcq-datentypen-16",
      type: "predict-output",
      question: "What does this code output?",
      code: "print(50 - 20 + 10)",
      options: ["40", "20", "60", "Error"],
      correctAnswer: "40",
      explanation: "Left to right: 50 - 20 = 30, then 30 + 10 = 40"
    },
    {
      id: "mcq-datentypen-17",
      type: "spot-the-error",
      question: "Why doesn't this calculation work?",
      code: "total = '5' + 3",
      options: [
        "You cannot add text ('5') with a number (3)",
        "total is a reserved word",
        "Missing print()",
        "No error"
      ],
      correctAnswer: "You cannot add text ('5') with a number (3)",
      explanation: "'5' is a string (text), 3 is an int. This causes a TypeError."
    },
    {
      id: "mcq-datentypen-18",
      type: "predict-output",
      question: "What does this code output?",
      code: "print(2 * 3 + 4 * 2)",
      options: ["14", "20", "28", "Error"],
      correctAnswer: "14",
      explanation: "Multiplications first: 2*3=6 and 4*2=8, then 6+8=14"
    },
    {
      id: "mcq-datentypen-19",
      type: "multiple-choice",
      question: "What data type is 5.0?",
      options: ["int", "float", "str", "double"],
      correctAnswer: "float",
      explanation: "Numbers with a decimal point are always float, even if they have .0"
    },
    {
      id: "mcq-datentypen-20",
      type: "predict-output",
      question: "What does this code output?",
      code: "print(10 - 3 - 2)",
      options: ["5", "9", "3", "Error"],
      correctAnswer: "5",
      explanation: "Left to right: 10-3=7, then 7-2=5"
    },
    {
      id: "mcq-datentypen-21",
      type: "spot-the-error",
      question: "What is the problem?",
      code: "result = 10 / 0",
      options: [
        "Division by zero is not allowed",
        "result is misspelled",
        "Missing print()",
        "No error"
      ],
      correctAnswer: "Division by zero is not allowed",
      explanation: "Division by 0 causes a ZeroDivisionError."
    },
    {
      id: "mcq-datentypen-22",
      type: "fill-the-blank",
      question: "Which operator for multiplication?",
      code: "print(5 ___ 4)  # Result: 20",
      options: ["+", "-", "*", "/"],
      correctAnswer: "*",
      explanation: "* is the multiplication operator. 5 * 4 = 20"
    },
    {
      id: "mcq-datentypen-23",
      type: "predict-output",
      question: "What does this code output?",
      code: "print((8 - 2) * (1 + 2))",
      options: ["18", "12", "9", "Error"],
      correctAnswer: "18",
      explanation: "(8-2)=6 and (1+2)=3, then 6*3=18"
    },
    {
      id: "mcq-datentypen-24",
      type: "multiple-choice",
      question: "What happens with 5 / 2?",
      options: [
        "Result is 2 (integer)",
        "Result is 2.5 (decimal)",
        "Error",
        "Result is 3"
      ],
      correctAnswer: "Result is 2.5 (decimal)",
      explanation: "Division (/) always returns a float."
    },
    {
      id: "mcq-datentypen-25",
      type: "predict-output",
      question: "What does this code output?",
      code: "x = 10\ny = 3\nprint(x - y)",
      options: ["7", "13", "30", "Error"],
      correctAnswer: "7",
      explanation: "10 - 3 = 7"
    }
  ],
  codeTasks: [
    {
      id: "code-datentypen-1",
      step: 1,
      title: "Create a text variable",
      description: "Create a variable 'name' as text with the value 'Max'. Print it to the console.",
      blocks: [{ type: "code", content: "# Your code here" }],
      showHints: false,
      path: "/drills/datentypen/1",
      courseId: "python-drills",
      prompt: "Create a variable 'name' as text with value 'Max' and print it. Remember: text needs quotes!",
      starterCode: "# Your code here",
      solutionString: "Max",
      solutionCode: ["name", "= ", "'", "print("]
    },
    {
      id: "code-datentypen-2",
      step: 2,
      title: "Mixed data types",
      description: "Create 'price' as number 19.99 and 'product' as text 'Book'. Print both.",
      blocks: [{ type: "code", content: "# Your code here" }],
      showHints: false,
      path: "/drills/datentypen/2",
      courseId: "python-drills",
      prompt: "Create 'price' variable as number 19.99 (without quotes) and 'product' variable as text 'Book' (with quotes). Print both values.",
      starterCode: "# Your code here",
      solutionString: "19.99\nBook",
      solutionCode: ["price", "product", "= 19.99", "= ", "'", "print(price"]
    },
    {
      id: "code-datentypen-3",
      step: 4,
      title: "Mathematical operation",
      description: "Calculate 15 + 7 and print the result.",
      blocks: [{ type: "code", content: "# Your code here" }],
      showHints: false,
      path: "/drills/datentypen/4",
      courseId: "python-drills",
      prompt: "Calculate 15 + 7 and print the result.",
      starterCode: "# Your code here",
      solutionString: "22",
      solutionCode: ["15", "+ ", "7", "print("]
    },
    {
      id: "code-datentypen-4",
      step: 5,
      title: "Division and variable",
      description: "Calculate 20 / 4 and store in variable 'result'. Print result.",
      blocks: [{ type: "code", content: "# Your code here" }],
      showHints: false,
      path: "/drills/datentypen/5",
      courseId: "python-drills",
      prompt: "Calculate 20 / 4 and store the result in variable 'result'. Print result.",
      starterCode: "# Your code here",
      solutionString: "5.0",
      solutionCode: ["result", "= ", "20", "/ ", "4", "print("]
    },
    {
      id: "code-datentypen-5",
      step: 6,
      title: "Percentage calculation",
      description: "Calculate 10% of 200 and print the result.",
      blocks: [{ type: "code", content: "# Your code here" }],
      showHints: false,
      path: "/drills/datentypen/6",
      courseId: "python-drills",
      prompt: "Calculate 10% of 200 (200 * 0.10) and print the result.",
      starterCode: "# Your code here",
      solutionString: "20.0",
      solutionCode: ["200", "* ", "0.10", "print("]
    },
    {
      id: "code-datentypen-6",
      step: 7,
      title: "Calculate discount",
      description: "price = 100, discount = 25%. Calculate new price after discount and print it.",
      blocks: [{ type: "code", content: "price = 100\ndiscount = 25\n# Your code here" }],
      showHints: false,
      path: "/drills/datentypen/7",
      courseId: "python-drills",
      prompt: "Variable price = 100, discount = 25 (percent). Calculate the price after discount and print it. Tip: First convert discount to decimal (discount/100), then subtract from price.",
      starterCode: "price = 100\ndiscount = 25\n# Your code here",
      solutionString: "75.0",
      solutionCode: ["price", "* ", "(1 ", "- ", "discount", "/100", "print("]
    },
    {
      id: "code-datentypen-7",
      step: 8,
      title: "Multiplication",
      description: "Calculate 7 * 8 and print the result.",
      blocks: [{ type: "code", content: "# Calculate 7 times 8" }],
      showHints: false,
      path: "/drills/datentypen/8",
      courseId: "python-drills",
      prompt: "Calculate 7 * 8 and print the result.",
      starterCode: "# Calculate 7 times 8",
      solutionString: "56",
      solutionCode: ["7", "*", "8", "print("]
    },
    {
      id: "code-datentypen-8",
      step: 9,
      title: "Using parentheses",
      description: "Calculate (5 + 3) * 4 and print the result.",
      blocks: [{ type: "code", content: "# Calculate (5 + 3) * 4" }],
      showHints: false,
      path: "/drills/datentypen/9",
      courseId: "python-drills",
      prompt: "Calculate (5 + 3) * 4 and print the result. Use parentheses!",
      starterCode: "# Calculate (5 + 3) * 4",
      solutionString: "32",
      solutionCode: ["(5", "+", "3)", "*", "4", "print("]
    },
    {
      id: "code-datentypen-9",
      step: 10,
      title: "Division with variable",
      description: "Divide 100 by 4 and store the result.",
      blocks: [{ type: "code", content: "# Calculate and store the result" }],
      showHints: false,
      path: "/drills/datentypen/10",
      courseId: "python-drills",
      prompt: "Calculate 100 / 4, store the result in 'result' and print it.",
      starterCode: "# Calculate and store the result",
      solutionString: "25.0",
      solutionCode: ["result", "=", "100", "/", "4", "print("]
    },
    {
      id: "code-datentypen-10",
      step: 11,
      title: "Multiple operations",
      description: "Calculate 10 + 5 - 3 and print the result.",
      blocks: [{ type: "code", content: "# Calculate 10 + 5 - 3" }],
      showHints: false,
      path: "/drills/datentypen/11",
      courseId: "python-drills",
      prompt: "Calculate 10 + 5 - 3 and print the result.",
      starterCode: "# Calculate 10 + 5 - 3",
      solutionString: "12",
      solutionCode: ["10", "+", "5", "-", "3", "print("]
    },
    {
      id: "code-datentypen-11",
      step: 12,
      title: "Create a decimal number",
      description: "Create a decimal number and print it.",
      blocks: [{ type: "code", content: "# Create a decimal number" }],
      showHints: false,
      path: "/drills/datentypen/12",
      courseId: "python-drills",
      prompt: "Create a variable 'pi' with value 3.14 and print it.",
      starterCode: "# Create a decimal number",
      solutionString: "3.14",
      solutionCode: ["pi", "= 3.14", "print("]
    },
    {
      id: "code-datentypen-12",
      step: 13,
      title: "Multiply two numbers",
      description: "Multiply two variables.",
      blocks: [{ type: "code", content: "a = 6\nb = 9\n# Multiply and print" }],
      showHints: false,
      path: "/drills/datentypen/13",
      courseId: "python-drills",
      prompt: "Multiply a and b and print the result.",
      starterCode: "a = 6\nb = 9\n# Multiply and print",
      solutionString: "54",
      solutionCode: ["a", "*", "b", "print("]
    },
    {
      id: "code-datentypen-13",
      step: 14,
      title: "Complex parentheses",
      description: "Calculate ((2 + 3) * 4) and print the result.",
      blocks: [{ type: "code", content: "# Calculate ((2 + 3) * 4)" }],
      showHints: false,
      path: "/drills/datentypen/14",
      courseId: "python-drills",
      prompt: "Calculate ((2 + 3) * 4) and print the result.",
      starterCode: "# Calculate ((2 + 3) * 4)",
      solutionString: "20",
      solutionCode: ["(2", "+", "3)", "*", "4", "print("]
    },
    {
      id: "code-datentypen-14",
      step: 15,
      title: "Subtraction with variables",
      description: "Subtract two variables.",
      blocks: [{ type: "code", content: "large = 100\nsmall = 37\n# Calculate the difference" }],
      showHints: false,
      path: "/drills/datentypen/15",
      courseId: "python-drills",
      prompt: "Calculate large - small and print the result.",
      starterCode: "large = 100\nsmall = 37\n# Calculate the difference",
      solutionString: "63",
      solutionCode: ["large", "-", "small", "print("]
    },
    {
      id: "code-datentypen-15",
      step: 16,
      title: "Add three numbers",
      description: "Add three numbers.",
      blocks: [{ type: "code", content: "# Calculate 11 + 22 + 33" }],
      showHints: false,
      path: "/drills/datentypen/16",
      courseId: "python-drills",
      prompt: "Calculate 11 + 22 + 33 and print the result.",
      starterCode: "# Calculate 11 + 22 + 33",
      solutionString: "66",
      solutionCode: ["11", "+", "22", "+", "33", "print("]
    }
  ]
};
