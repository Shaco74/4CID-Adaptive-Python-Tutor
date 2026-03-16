import type { DrillTask } from "@/types/courseTypes";

// English drill tasks for Variables topic
export const variablenDrillsEn: DrillTask = {
  topic: "Variablen",
  mcQuestions: [
    {
      id: "mcq-variablen-1",
      type: 'multiple-choice',
      question: "What is a variable in Python?",
      options: [
        "A mathematical equation",
        "A container for storing values",
        "A function",
        "A file type"
      ],
      correctAnswer: "A container for storing values"
    },
    {
      id: "mcq-variablen-2",
      type: 'multiple-choice',
      question: "How do you create a variable with value 10?",
      options: [
        "var x = 10",
        "x = 10",
        "let x = 10",
        "int x = 10"
      ],
      correctAnswer: "x = 10"
    },
    {
      id: "mcq-variablen-3",
      type: "predict-output",
      question: "What does this code output?",
      code: "name = 'Max'\nprint(name)",
      options: ["name", "Max", "'Max'", "Error"],
      correctAnswer: "Max",
      explanation: "The variable name contains the value 'Max', which gets output."
    },
    {
      id: "mcq-variablen-4",
      type: "spot-the-error",
      question: "Which variable name is invalid?",
      code: "A: name = 'Max'\nB: 2name = 'Max'\nC: _name = 'Max'\nD: Name = 'Max'",
      options: [
        "Only B is invalid",
        "B and D are invalid",
        "All are valid",
        "Only C is invalid"
      ],
      correctAnswer: "Only B is invalid",
      explanation: "Variable names cannot start with a number."
    },
    {
      id: "mcq-variablen-5",
      type: "predict-output",
      question: "What does this code output?",
      code: "x = 5\nx = 10\nprint(x)",
      options: ["5", "10", "5 10", "Error"],
      correctAnswer: "10",
      explanation: "The variable x is overwritten with 10."
    },
    {
      id: "mcq-variablen-6",
      type: "multiple-choice",
      question: "Which variable names are allowed in Python?",
      options: [
        "Only lowercase letters",
        "Letters, numbers, underscores (not starting with number)",
        "Everything except spaces",
        "Only English words"
      ],
      correctAnswer: "Letters, numbers, underscores (not starting with number)"
    },
    {
      id: "mcq-variablen-7",
      type: "predict-output",
      question: "What does this code output?",
      code: "a = 3\nb = 7\nprint(a + b)",
      options: ["a + b", "10", "37", "Error"],
      correctAnswer: "10",
      explanation: "a + b adds the values 3 and 7."
    },
    {
      id: "mcq-variablen-8",
      type: "spot-the-error",
      question: "What's wrong with this code?",
      code: "my name = 'Max'",
      options: [
        "Variable names cannot contain spaces",
        "Max needs double quotes",
        "Missing colon",
        "No error"
      ],
      correctAnswer: "Variable names cannot contain spaces",
      explanation: "Use underscore instead: my_name = 'Max'"
    },
    {
      id: "mcq-variablen-9",
      type: "predict-output",
      question: "What does this code output?",
      code: "text = 'Hello'\nprint(text + '!')",
      options: ["Hello!", "text!", "Hello !", "Error"],
      correctAnswer: "Hello!",
      explanation: "The string 'Hello' is concatenated with '!'."
    },
    {
      id: "mcq-variablen-10",
      type: "fill-the-blank",
      question: "Complete the code to store 42 in the variable:",
      code: "answer ___ 42",
      options: ["==", "=", ":", "->"],
      correctAnswer: "=",
      explanation: "In Python, a single = is used for assignment."
    },
    {
      id: "mcq-variablen-11",
      type: "multiple-choice",
      question: "Which character is used for assignment in Python?",
      options: ["==", "=", ":=", "=>"],
      correctAnswer: "="
    },
    {
      id: "mcq-variablen-12",
      type: "predict-output",
      question: "What does this code output?",
      code: "x = 'Python'\nprint(x)",
      options: ["x", "Python", "'Python'", "Error"],
      correctAnswer: "Python",
      explanation: "print(x) outputs the value of x, not the name."
    },
    {
      id: "mcq-variablen-13",
      type: "spot-the-error",
      question: "What's the error?",
      code: "print(message)\nmessage = 'Hello'",
      options: [
        "Variable is used before being defined",
        "print is wrong",
        "Missing quotes",
        "No error"
      ],
      correctAnswer: "Variable is used before being defined",
      explanation: "message must be defined before it can be used."
    },
    {
      id: "mcq-variablen-14",
      type: "predict-output",
      question: "What does this code output?",
      code: "num = 100\nnum = num + 50\nprint(num)",
      options: ["100", "150", "100 + 50", "Error"],
      correctAnswer: "150",
      explanation: "num = num + 50 adds 50 to the old value."
    },
    {
      id: "mcq-variablen-15",
      type: "multiple-choice",
      question: "What can variables in Python store?",
      options: [
        "Only numbers",
        "Only text",
        "Numbers, text, and more",
        "Only whole numbers"
      ],
      correctAnswer: "Numbers, text, and more"
    },
    {
      id: "mcq-variablen-16",
      type: "predict-output",
      question: "What does this code output?",
      code: "a = 'Hello'\nb = 'World'\nprint(a, b)",
      options: ["Hello World", "HelloWorld", "a b", "Error"],
      correctAnswer: "Hello World",
      explanation: "print() with comma automatically adds a space."
    },
    {
      id: "mcq-variablen-17",
      type: "spot-the-error",
      question: "What's wrong?",
      code: "class = 'Python'",
      options: [
        "class is a reserved keyword",
        "Missing quotes",
        "Lowercase is wrong",
        "No error"
      ],
      correctAnswer: "class is a reserved keyword",
      explanation: "class is a reserved word in Python and cannot be used as variable name."
    },
    {
      id: "mcq-variablen-18",
      type: "predict-output",
      question: "What does this code output?",
      code: "price = 10\ntax = 2\ntotal = price + tax\nprint(total)",
      options: ["10", "2", "12", "price + tax"],
      correctAnswer: "12",
      explanation: "total stores the result of 10 + 2 = 12."
    },
    {
      id: "mcq-variablen-19",
      type: "fill-the-blank",
      question: "Complete to output the variable:",
      code: "name = 'Max'\n___(name)",
      options: ["show", "print", "output", "display"],
      correctAnswer: "print",
      explanation: "print() is the function for output in Python."
    },
    {
      id: "mcq-variablen-20",
      type: "multiple-choice",
      question: "What's the difference between x = 5 and x == 5?",
      options: [
        "No difference",
        "= assigns, == compares",
        "= compares, == assigns",
        "Both compare"
      ],
      correctAnswer: "= assigns, == compares"
    },
    {
      id: "mcq-variablen-21",
      type: "predict-output",
      question: "What does this code output?",
      code: "x = 10\ny = x\nx = 20\nprint(y)",
      options: ["10", "20", "x", "Error"],
      correctAnswer: "10",
      explanation: "y received a copy of the value, x's change doesn't affect y."
    },
    {
      id: "mcq-variablen-22",
      type: "spot-the-error",
      question: "What's the error?",
      code: "1st_place = 'Gold'",
      options: [
        "Variable cannot start with a number",
        "Gold needs different quotes",
        "Underscore not allowed",
        "No error"
      ],
      correctAnswer: "Variable cannot start with a number",
      explanation: "Use: first_place = 'Gold'"
    },
    {
      id: "mcq-variablen-23",
      type: "predict-output",
      question: "What does this code output?",
      code: "text = 'A'\ntext = text + 'B'\ntext = text + 'C'\nprint(text)",
      options: ["A", "ABC", "A B C", "Error"],
      correctAnswer: "ABC",
      explanation: "The strings are concatenated step by step."
    },
    {
      id: "mcq-variablen-24",
      type: "multiple-choice",
      question: "Which statement is TRUE about variables?",
      options: [
        "Variables cannot be changed",
        "Variables can change their values",
        "Variables must be declared with type",
        "Variable names must be numbers"
      ],
      correctAnswer: "Variables can change their values"
    },
    {
      id: "mcq-variablen-25",
      type: "fill-the-blank",
      question: "Complete to double the number:",
      code: "num = 5\nnum = num ___ 2\nprint(num)  # Output: 10",
      options: ["+", "-", "*", "/"],
      correctAnswer: "*",
      explanation: "5 * 2 = 10, doubles the number."
    }
  ],
  codeTasks: [
    {
      id: "code-variablen-1",
      step: 1,
      title: "Create variable",
      description: "Create a variable name with the value 'Python'.",
      blocks: [{ type: "code", content: "# Create a variable" }],
      showHints: false,
      path: "/drills/variablen/1",
      courseId: "python-drills",
      prompt: "Create a variable called 'name' with the value 'Python' and output it.",
      starterCode: "# Create a variable and output it",
      solutionString: "Python",
      solutionCode: ["name", "=", "Python", "print"]
    },
    {
      id: "code-variablen-2",
      step: 2,
      title: "Calculate with variables",
      description: "Calculate the sum of two numbers.",
      blocks: [{ type: "code", content: "a = 5\nb = 3\n# Calculate and output the sum" }],
      showHints: false,
      path: "/drills/variablen/2",
      courseId: "python-drills",
      prompt: "The variables a and b are given. Calculate the sum and output it.",
      starterCode: "a = 5\nb = 3\n# Calculate and output the sum",
      solutionString: "8",
      solutionCode: ["print", "a + b"]
    },
    {
      id: "code-variablen-3",
      step: 3,
      title: "Overwrite variable",
      description: "Change the value of a variable.",
      blocks: [{ type: "code", content: "x = 10\n# Change x to 20 and output it" }],
      showHints: false,
      path: "/drills/variablen/3",
      courseId: "python-drills",
      prompt: "x is initially 10. Change x to 20 and output the new value.",
      starterCode: "x = 10\n# Change x to 20 and output it",
      solutionString: "20",
      solutionCode: ["x = 20", "print"]
    },
    {
      id: "code-variablen-4",
      step: 4,
      title: "Concatenate text",
      description: "Combine two texts.",
      blocks: [{ type: "code", content: "first = 'Hello'\nlast = 'World'\n# Combine and output" }],
      showHints: false,
      path: "/drills/variablen/4",
      courseId: "python-drills",
      prompt: "Combine first and last with a space in between and output the result.",
      starterCode: "first = 'Hello'\nlast = 'World'\n# Combine and output",
      solutionString: "Hello World",
      solutionCode: ["print", "first", "+", "last"]
    },
    {
      id: "code-variablen-5",
      step: 5,
      title: "Increase value",
      description: "Increase a variable by 1.",
      blocks: [{ type: "code", content: "counter = 0\n# Increase counter by 1 and output" }],
      showHints: false,
      path: "/drills/variablen/5",
      courseId: "python-drills",
      prompt: "Increase the counter by 1 and output the result.",
      starterCode: "counter = 0\n# Increase counter by 1 and output",
      solutionString: "1",
      solutionCode: ["counter = counter + 1", "print"]
    },
    {
      id: "code-variablen-6",
      step: 6,
      title: "Calculate price",
      description: "Calculate the total price of an item.",
      blocks: [{ type: "code", content: "price = 100\ndiscount = 20\n# Calculate final price (price - discount) and output" }],
      showHints: false,
      path: "/drills/variablen/6",
      courseId: "python-drills",
      prompt: "Calculate the final price (price minus discount) and output it.",
      starterCode: "price = 100\ndiscount = 20\n# Calculate final price and output",
      solutionString: "80",
      solutionCode: ["print", "price - discount"]
    },
    {
      id: "code-variablen-7",
      step: 7,
      title: "Swap values",
      description: "Swap the values of two variables.",
      blocks: [{ type: "code", content: "a = 1\nb = 2\n# Swap so a=2 and b=1, then output both" }],
      showHints: false,
      path: "/drills/variablen/7",
      courseId: "python-drills",
      prompt: "Swap the values of a and b. Output a and b after swapping.",
      starterCode: "a = 1\nb = 2\n# Swap values\n\nprint(a)\nprint(b)",
      solutionString: "2\n1",
      solutionCode: ["a, b = b, a"]
    },
    {
      id: "code-variablen-8",
      step: 8,
      title: "Average calculation",
      description: "Calculate the average of three numbers.",
      blocks: [{ type: "code", content: "n1 = 10\nn2 = 20\nn3 = 30\n# Calculate and output the average" }],
      showHints: false,
      path: "/drills/variablen/8",
      courseId: "python-drills",
      prompt: "Calculate the average of n1, n2 and n3. Output the result.",
      starterCode: "n1 = 10\nn2 = 20\nn3 = 30\n# Calculate and output the average",
      solutionString: "20.0",
      solutionCode: ["(n1 + n2 + n3) / 3", "print"]
    },
    {
      id: "code-variablen-9",
      step: 9,
      title: "Build greeting",
      description: "Build a personalized greeting.",
      blocks: [{ type: "code", content: "name = 'Max'\n# Create greeting 'Hello Max!' and output" }],
      showHints: false,
      path: "/drills/variablen/9",
      courseId: "python-drills",
      prompt: "Create a greeting in the format 'Hello Max!' and output it.",
      starterCode: "name = 'Max'\n# Create greeting and output",
      solutionString: "Hello Max!",
      solutionCode: ["print", "Hello", "name"]
    },
    {
      id: "code-variablen-10",
      step: 10,
      title: "Calculate rectangle area",
      description: "Calculate the area of a rectangle.",
      blocks: [{ type: "code", content: "width = 5\nheight = 3\n# Calculate area (width * height) and output" }],
      showHints: false,
      path: "/drills/variablen/10",
      courseId: "python-drills",
      prompt: "Calculate the area of the rectangle (width times height) and output it.",
      starterCode: "width = 5\nheight = 3\n# Calculate and output area",
      solutionString: "15",
      solutionCode: ["width * height", "print"]
    },
    {
      id: "code-variablen-11",
      step: 11,
      title: "Increase by 10",
      description: "Increase a value by 10.",
      blocks: [{ type: "code", content: "score = 50\n# Increase score by 10 and output" }],
      showHints: false,
      path: "/drills/variablen/11",
      courseId: "python-drills",
      prompt: "Increase the score by 10 and output the new value.",
      starterCode: "score = 50\n# Increase by 10 and output",
      solutionString: "60",
      solutionCode: ["score = score + 10", "print"]
    },
    {
      id: "code-variablen-12",
      step: 12,
      title: "Double the number",
      description: "Double a number.",
      blocks: [{ type: "code", content: "num = 7\n# Double num and output" }],
      showHints: false,
      path: "/drills/variablen/12",
      courseId: "python-drills",
      prompt: "Double the number num and output the result.",
      starterCode: "num = 7\n# Double and output",
      solutionString: "14",
      solutionCode: ["num * 2", "print"]
    },
    {
      id: "code-variablen-13",
      step: 13,
      title: "Calculate total",
      description: "Calculate the total of items.",
      blocks: [{ type: "code", content: "apples = 5\nbananas = 3\noranges = 2\n# Calculate total and output" }],
      showHints: false,
      path: "/drills/variablen/13",
      courseId: "python-drills",
      prompt: "Calculate the total number of fruits and output it.",
      starterCode: "apples = 5\nbananas = 3\noranges = 2\n# Calculate total",
      solutionString: "10",
      solutionCode: ["apples + bananas + oranges", "print"]
    },
    {
      id: "code-variablen-14",
      step: 14,
      title: "Subtract half",
      description: "Subtract half from a number.",
      blocks: [{ type: "code", content: "value = 100\n# Subtract half and output" }],
      showHints: false,
      path: "/drills/variablen/14",
      courseId: "python-drills",
      prompt: "Subtract half of the value and output the result.",
      starterCode: "value = 100\n# Subtract half",
      solutionString: "50.0",
      solutionCode: ["value / 2", "print"]
    },
    {
      id: "code-variablen-15",
      step: 15,
      title: "Combine with number",
      description: "Combine text with a number.",
      blocks: [{ type: "code", content: "age = 25\n# Output 'Age: 25'" }],
      showHints: false,
      path: "/drills/variablen/15",
      courseId: "python-drills",
      prompt: "Output 'Age: 25' using the age variable.",
      starterCode: "age = 25\n# Output Age: 25",
      solutionString: "Age: 25",
      solutionCode: ["print", "Age:", "age"]
    }
  ]
};
