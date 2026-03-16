import type { DrillTask } from "@/types/courseTypes";

export const stringsDrillsEn: DrillTask = {
  topic: "Strings",
  mcQuestions: [
    {
      id: "mcq-strings-1",
      type: 'multiple-choice',
      question: "How do you concatenate two strings in Python?",
      options: ["str1 + str2", "str1 & str2", "str1 . str2", "concat(str1, str2)"],
      correctAnswer: "str1 + str2"
    },
    {
      id: "mcq-strings-3",
      type: "multiple-choice",
      question: "What is str() used for?",
      options: [
        "To add numbers",
        "To convert numbers to text",
        "To convert text to numbers",
        "To delete text"
      ],
      correctAnswer: "To convert numbers to text",
      explanation: "str() converts numbers (e.g., 77) to text (\"77\"), so you can concatenate them with +."
    },
    {
      id: "mcq-strings-4",
      type: "spot-the-error",
      question: "What is the error in this code?",
      code: "weight = 77\nprint(\"Weight: \" + weight)",
      options: [
        "weight should be text",
        "str() is missing around weight",
        "A comma is needed instead of +",
        "No error"
      ],
      correctAnswer: "str() is missing around weight",
      explanation: "Correct: print(\"Weight: \" + str(weight)) - You can only concatenate text + text."
    },
    {
      id: "mcq-strings-5",
      type: "fill-the-blank",
      question: "Complete the code:",
      code: "bmi = 24.5\nprint(\"BMI: \" + ___(bmi))",
      options: ["str", "int", "float", "text"],
      correctAnswer: "str",
      explanation: "str(bmi) converts the number 24.5 to text for concatenation."
    },
    {
      id: "mcq-strings-6",
      type: "multiple-choice",
      question: "How do you combine text with variables in Python (old method)?",
      options: [
        "Text & Variable",
        "Text + str(Variable)",
        "Text . Variable",
        "concat(Text, Variable)"
      ],
      correctAnswer: "Text + str(Variable)",
      explanation: "With + you can concatenate strings: \"Hello\" + str(age)"
    },
    {
      id: "mcq-strings-7",
      type: "spot-the-error",
      question: "Find the error:",
      code: "name = 'Anna'\nprint('Hello' + name)",
      options: [
        "str() is missing",
        "A space is missing",
        "name should be a number",
        "No error - but 'Hello' and name stick together"
      ],
      correctAnswer: "No error - but 'Hello' and name stick together",
      explanation: "The code runs but outputs 'HelloAnna'. Better: 'Hello ' + name (with space)"
    },
    {
      id: "mcq-strings-8",
      type: "predict-output",
      question: "What does this code output?",
      code: "x = 'Python'\ny = 'Rocks'\nprint(x + ' ' + y)",
      options: ["Python Rocks", "PythonRocks", "Python'+'Rocks", "Error"],
      correctAnswer: "Python Rocks",
      explanation: "The three strings are concatenated: 'Python' + ' ' + 'Rocks' = 'Python Rocks'"
    },
    {
      id: "mcq-strings-9",
      type: "fill-the-blank",
      question: "Complete for output 'Age: 30':",
      code: "age = 30\nprint('Age: ' ___ ___(age))",
      options: ["+ str", ", str", "+ int", "& str"],
      correctAnswer: "+ str",
      explanation: "For concatenation: + to join, str() to convert"
    },
    {
      id: "mcq-strings-10",
      type: "multiple-choice",
      question: "What is the advantage of f-strings?",
      options: [
        "Faster than print()",
        "Simpler than str() + '+' concatenation",
        "You don't need variables",
        "Only works with numbers"
      ],
      correctAnswer: "Simpler than str() + '+' concatenation",
      explanation: "f-strings are shorter and more readable: f'Value: {x}' instead of 'Value: ' + str(x)"
    },
    {
      id: "mcq-strings-11",
      type: "spot-the-error",
      question: "What is missing in this code?",
      code: "name = 'Anna'\nprint('Hello {name}')",
      options: [
        "The f before the string",
        "str() around name",
        "Parentheses around name",
        "No error"
      ],
      correctAnswer: "The f before the string",
      explanation: "f-strings need the f prefix: print(f'Hello {name}')"
    },
    {
      id: "mcq-strings-12",
      type: "predict-output",
      question: "What does this code output?",
      code: "x = 10\ny = 20\nprint(f'{x} + {y} = {x + y}')",
      options: ["10 + 20 = 30", "x + y = x + y", "{10} + {20} = {30}", "Error"],
      correctAnswer: "10 + 20 = 30",
      explanation: "f-strings can contain variables AND calculations: {x + y} becomes 30"
    },
    {
      id: "mcq-strings-13",
      type: "fill-the-blank",
      question: "Complete for output 'Amount: 100€':",
      code: "amount = 100\nprint(___'Amount: {amount}€')",
      options: ["f", "s", "t", "format"],
      correctAnswer: "f",
      explanation: "The f before the string activates f-string formatting"
    },
    {
      id: "mcq-strings-16",
      type: "spot-the-error",
      question: "What is wrong?",
      code: "number = 50\nprint('Value: ' + number)",
      options: [
        "str() is missing around number",
        "The + is wrong",
        "print is misspelled",
        "No error"
      ],
      correctAnswer: "str() is missing around number",
      explanation: "Numbers must be converted to text with str(): 'Value: ' + str(number)"
    },
    {
      id: "mcq-strings-17",
      type: "predict-output",
      question: "What does this code output?",
      code: "a = 'Yes'\nb = 'indeed'\nprint(a + b)",
      options: ["Yes indeed", "Yesindeed", "Yes\nindeed", "Error"],
      correctAnswer: "Yesindeed",
      explanation: "String concatenation joins strings directly, without spaces."
    },
    {
      id: "mcq-strings-18",
      type: "fill-the-blank",
      question: "How do you convert the number 99 to text?",
      code: "text = ___(99)",
      options: ["str", "int", "text", "string"],
      correctAnswer: "str",
      explanation: "str() converts any value to a string (text)."
    },
    {
      id: "mcq-strings-19",
      type: "predict-output",
      question: "What does this code output?",
      code: "number = 7\nprint(f'The number is {number}')",
      options: ["The number is 7", "The number is {number}", "The number is number", "Error"],
      correctAnswer: "The number is 7",
      explanation: "f-strings replace {number} with the variable's value (7)."
    },
    {
      id: "mcq-strings-20",
      type: "multiple-choice",
      question: "Which statement about f-strings is TRUE?",
      options: [
        "You need str() for numbers in f-strings",
        "f-strings don't need str() for numbers",
        "f-strings only work with text",
        "The f must be at the end of the string"
      ],
      correctAnswer: "f-strings don't need str() for numbers",
      explanation: "f-strings automatically convert numbers to text."
    },
    {
      id: "mcq-strings-22",
      type: "spot-the-error",
      question: "What is wrong?",
      code: "print(f'Value: {value}')",
      options: [
        "Variable 'value' was not defined",
        "f-string syntax is wrong",
        "Parentheses are missing",
        "No error possible"
      ],
      correctAnswer: "Variable 'value' was not defined",
      explanation: "Before using a variable in an f-string, it must exist."
    },
    {
      id: "mcq-strings-23",
      type: "fill-the-blank",
      question: "How do you output 'Result: 50'?",
      code: "x = 50\nprint(___'Result: {x}')",
      options: ["f", "s", "str", "format"],
      correctAnswer: "f",
      explanation: "f before the string for f-string formatting."
    },
    {
      id: "mcq-strings-24",
      type: "predict-output",
      question: "What does this code output?",
      code: "a = 'Hello'\nb = 'World'\nprint(a + ' ' + b)",
      options: ["Hello World", "HelloWorld", "a b", "Error"],
      correctAnswer: "Hello World",
      explanation: "The strings are joined with a space in between."
    },
    {
      id: "mcq-strings-25",
      type: "multiple-choice",
      question: "Which function converts a number to text?",
      options: ["int()", "str()", "float()", "text()"],
      correctAnswer: "str()",
      explanation: "str() converts any value to a string (text)."
    }
  ],
  codeTasks: [
    {
      id: "code-strings-2",
      step: 2,
      title: "String formatting",
      description: "Use f-strings to create a greeting.",
      blocks: [{ type: "code", content: "name = 'Anna'\n# Create the output: 'Hello Anna! Welcome!" }],
      showHints: false,
      path: "/drills/strings/2",
      courseId: "python-drills",
      prompt: "Use f-strings to create the output 'Hello Anna! Welcome!'",
      starterCode: "name = 'Anna'\n# Create the output: 'Hello Anna! Welcome!'",
      solutionString: "Hello Anna! Welcome!",
      solutionCode: ["f\"", "{name}", "print("]
    },
    {
      id: "code-strings-3",
      step: 3,
      title: "str() - Type conversion",
      description: "Convert the number 42 to text with str() and print the result.",
      blocks: [{ type: "code", content: "# Your code here" }],
      showHints: false,
      path: "/drills/strings/3",
      courseId: "python-drills",
      prompt: "Convert the number 42 to text with str() and print the result.",
      starterCode: "# Your code here",
      solutionString: "42",
      solutionCode: ["str(", "42", "print("]
    },
    {
      id: "code-strings-4",
      step: 4,
      title: "str() - Concatenation",
      description: "Variable 'count' has value 10. Print 'Count: 10' using str().",
      blocks: [{ type: "code", content: "count = 10\n# Your code here" }],
      showHints: false,
      path: "/drills/strings/4",
      courseId: "python-drills",
      prompt: "Variable 'count' has value 10. Print 'Count: 10'. You need str() to convert count to text.",
      starterCode: "count = 10\n# Your code here",
      solutionString: "Count: 10",
      solutionCode: ["str(", "count", "print(", "+ "]
    },
    {
      id: "code-strings-5",
      step: 5,
      title: "String concatenation",
      description: "Join 'Hello' and 'World' with a space in between and print the result.",
      blocks: [{ type: "code", content: "# Your code here" }],
      showHints: false,
      path: "/drills/strings/5",
      courseId: "python-drills",
      prompt: "Join 'Hello' and 'World' with a space in between. Print the result. You should concatenate three strings with +. Hint: ' ' is a string with a space.",
      starterCode: "# Your code here",
      solutionString: "Hello World",
      solutionCode: ["'Hello'", "+", " ", "'World'", "print("]
    },
    {
      id: "code-strings-6",
      step: 6,
      title: "String concatenation with variable",
      description: "name = 'Max'. Print 'Welcome Max' using concatenation.",
      blocks: [{ type: "code", content: "name = 'Max'\n# Your code here" }],
      showHints: false,
      path: "/drills/strings/6",
      courseId: "python-drills",
      prompt: "Variable 'name' has value 'Max'. Print 'Welcome Max' using string concatenation (+).",
      starterCode: "name = 'Max'\n# Your code here",
      solutionString: "Welcome Max",
      solutionCode: ["'Welcome '", "+ ", "name", "print("]
    },
    {
      id: "code-strings-7",
      step: 7,
      title: "f-String basics",
      description: "name = 'Max'. Print 'Hello Max' using an f-string.",
      blocks: [{ type: "code", content: "name = 'Max'\n# Your code here" }],
      showHints: false,
      path: "/drills/strings/7",
      courseId: "python-drills",
      prompt: "Variable 'name' has value 'Max'. Print 'Hello Max' using an f-string. Don't forget the f before the string!",
      starterCode: "name = 'Max'\n# Your code here",
      solutionString: "Hello Max",
      solutionCode: ["f'", "{name}", "print("]
    },
    {
      id: "code-strings-8",
      step: 8,
      title: "f-String with number",
      description: "age = 25. Print 'Age: 25 years' using an f-string.",
      blocks: [{ type: "code", content: "age = 25\n# Your code here" }],
      showHints: false,
      path: "/drills/strings/8",
      courseId: "python-drills",
      prompt: "Variable 'age' has value 25. Print 'Age: 25 years' using an f-string. Don't forget the f before the string!",
      starterCode: "age = 25\n# Your code here",
      solutionString: "Age: 25 years",
      solutionCode: ["f'", "{age}", "print(", "years"]
    },
    {
      id: "code-strings-9",
      step: 9,
      title: "Join two strings",
      description: "Join 'Good' and 'day' with a space.",
      blocks: [{ type: "code", content: "# Join the words" }],
      showHints: false,
      path: "/drills/strings/9",
      courseId: "python-drills",
      prompt: "Join 'Good' and 'day' with a space in between and print the result.",
      starterCode: "# Join the words",
      solutionString: "Good day",
      solutionCode: ["'Good'", "+ ", "' '", "'day'", "print("]
    },
    {
      id: "code-strings-10",
      step: 10,
      title: "Join number with str()",
      description: "Join 'Points: ' with the number 100.",
      blocks: [{ type: "code", content: "points = 100\n# Print 'Points: 100'" }],
      showHints: false,
      path: "/drills/strings/10",
      courseId: "python-drills",
      prompt: "Join 'Points: ' with the variable points (100) and print the result. Use str() for the number!",
      starterCode: "points = 100\n# Print 'Points: 100'",
      solutionString: "Points: 100",
      solutionCode: ["'Points: '", "+ ", "str(", "points", "print("]
    },
    {
      id: "code-strings-12",
      step: 12,
      title: "f-String with two variables",
      description: "Print 'City: Berlin, Country: Germany' with an f-string.",
      blocks: [{ type: "code", content: "city = 'Berlin'\ncountry = 'Germany'\n# Your code here" }],
      showHints: false,
      path: "/drills/strings/12",
      courseId: "python-drills",
      prompt: "Use an f-string to output 'City: Berlin, Country: Germany'. Use both variables.",
      starterCode: "city = 'Berlin'\ncountry = 'Germany'\n# Your code here",
      solutionString: "City: Berlin, Country: Germany",
      solutionCode: ["f'", "{city}", "{country}", "print("]
    },
    {
      id: "code-strings-13",
      step: 13,
      title: "Combine text with number",
      description: "Create 'Score: 42' with str() and concatenation.",
      blocks: [{ type: "code", content: "score = 42\n# Your code here" }],
      showHints: false,
      path: "/drills/strings/13",
      courseId: "python-drills",
      prompt: "Combine the text 'Score: ' with the number 42. Use str() to convert the number to text.",
      starterCode: "score = 42\n# Your code here",
      solutionString: "Score: 42",
      solutionCode: ["'Score: '", "+ ", "str(", "score", "print("]
    },
    {
      id: "code-strings-14",
      step: 14,
      title: "Multiple concatenation",
      description: "Create 'Hello Anna, welcome!' with variables.",
      blocks: [{ type: "code", content: "greeting = 'Hello '\nuser = 'Anna'\nending = ', welcome!'\n# Your code here" }],
      showHints: false,
      path: "/drills/strings/14",
      courseId: "python-drills",
      prompt: "Join all three variables to 'Hello Anna, welcome!' and print the result.",
      starterCode: "greeting = 'Hello '\nuser = 'Anna'\nending = ', welcome!'\n# Your code here",
      solutionString: "Hello Anna, welcome!",
      solutionCode: ["greeting", "+ ", "user", "ending", "print("]
    },
    {
      id: "code-strings-15",
      step: 15,
      title: "f-String with calculation",
      description: "Print 'Sum of 7 and 8 is 15' with an f-string.",
      blocks: [{ type: "code", content: "a = 7\nb = 8\n# Your code here" }],
      showHints: false,
      path: "/drills/strings/15",
      courseId: "python-drills",
      prompt: "Use an f-string to output 'Sum of 7 and 8 is 15'. The 15 should be calculated ({a + b}).",
      starterCode: "a = 7\nb = 8\n# Your code here",
      solutionString: "Sum of 7 and 8 is 15",
      solutionCode: ["f'", "{a}", "{b}", "{a + b}", "print("]
    }
  ]
};
