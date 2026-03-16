import type { DrillTask } from "@/types/courseTypes";

// English drill tasks for print topic
// Topics use German names for DrillTopic type compatibility

export const printDrillsEn: DrillTask[] = [
  {
    topic: "print",
    mcQuestions: [
      {
        id: "mcq-print-1",
        type: 'multiple-choice',
        question: "What does the print() function do?",
        options: [
          "Saves data to the hard drive",
          "Outputs text to the console",
          "Creates a variable",
          "Calculates numbers"
        ],
        correctAnswer: "Outputs text to the console"
      },
      {
        id: "mcq-print-2",
        type: 'multiple-choice',
        question: "How do you output 'Learn Python'?",
        options: [
          "print(Learn Python)",
          "print('Learn Python')",
          "Print('Learn Python')",
          "console.log('Learn Python')"
        ],
        correctAnswer: "print('Learn Python')"
      },
      {
        id: "mcq-print-3",
        type: "predict-output",
        question: "What does this code output?",
        code: "print('Python')\nprint('Learning')",
        options: [
          "Python Learning",
          "Python\nLearning",
          "PythonLearning",
          "Error"
        ],
        correctAnswer: "Python\nLearning",
        explanation: "Each print() creates a new line. So two lines: Python and Learning."
      },
      {
        id: "mcq-print-4",
        type: "spot-the-error",
        question: "Which code is correct?",
        code: "A: print('Hello')\nB: print(Hello)\nC: Print('Hello')\nD: PRINT('Hello')",
        options: [
          "Only A is correct",
          "A and C are correct",
          "All are correct",
          "B and D are correct"
        ],
        correctAnswer: "Only A is correct",
        explanation: "Python is case-sensitive (print, not Print) and text needs quotation marks."
      },
      {
        id: "mcq-print-6",
        type: "predict-output",
        question: "What does this code output?",
        code: "print('Good')\nprint('Morning')\nprint('!')",
        options: [
          "Good Morning !",
          "Good\nMorning\n!",
          "GoodMorning!",
          "Error"
        ],
        correctAnswer: "Good\nMorning\n!",
        explanation: "Each print() creates a new line. So three separate lines."
      },
      {
        id: "mcq-print-7",
        type: "spot-the-error",
        question: "What's wrong with this code?",
        code: "print('Today is Monday)",
        options: [
          "Missing closing quotation mark",
          "print must be capitalized",
          "Missing semicolon",
          "No error"
        ],
        correctAnswer: "Missing closing quotation mark",
        explanation: "Strings must end with the same quotation mark they started with."
      },
      {
        id: "mcq-print-8",
        type: "multiple-choice",
        question: "Which quotation marks are allowed for strings in Python?",
        options: [
          "Only double: \"...\"",
          "Only single: '...'",
          "Both: \"...\" and '...'",
          "None, Python doesn't need quotation marks"
        ],
        correctAnswer: "Both: \"...\" and '...'"
      },
      {
        id: "mcq-print-9",
        type: "predict-output",
        question: "What does this code output?",
        code: "# print('Secret')\nprint('Visible')",
        options: [
          "Secret\nVisible",
          "Visible",
          "# print('Secret')\nVisible",
          "Error"
        ],
        correctAnswer: "Visible",
        explanation: "The first line is a comment (#) and is ignored by Python."
      },
      {
        id: "mcq-print-10",
        type: "fill-the-blank",
        question: "Complete the code to output 'Done':",
        code: "___('Done')",
        options: ["Print", "print", "PRINT", "output"],
        correctAnswer: "print",
        explanation: "In Python everything is lowercase: print (not Print or PRINT)."
      },
      {
        id: "mcq-print-11",
        type: "spot-the-error",
        question: "Why doesn't this code work?",
        code: "print(Good Morning)",
        options: [
          "Missing quotation marks around the text",
          "print is spelled wrong",
          "Missing colon",
          "Spaces are not allowed"
        ],
        correctAnswer: "Missing quotation marks around the text",
        explanation: "Text must always be in quotation marks: print('Good Morning')"
      },
      {
        id: "mcq-print-12",
        type: "multiple-choice",
        question: "What is a comment in Python?",
        options: [
          "Text that gets executed by the program",
          "A note for humans that Python ignores",
          "A special function",
          "An error in the code"
        ],
        correctAnswer: "A note for humans that Python ignores"
      },
      {
        id: "mcq-print-13",
        type: "predict-output",
        question: "What does this code output?",
        code: "print(\"Number: 42\")",
        options: [
          "Number: 42",
          "\"Number: 42\"",
          "42",
          "Error"
        ],
        correctAnswer: "Number: 42",
        explanation: "The quotation marks only mark the string, they are not printed."
      },
      {
        id: "mcq-print-14",
        type: "spot-the-error",
        question: "What's the error?",
        code: "print['Error']",
        options: [
          "Square brackets instead of round brackets",
          "The word 'Error' is reserved",
          "print must be capitalized",
          "No error"
        ],
        correctAnswer: "Square brackets instead of round brackets",
        explanation: "Functions like print() use round brackets (), not square brackets []."
      },
      {
        id: "mcq-print-15",
        type: "multiple-choice",
        question: "How does a comment start in Python?",
        options: [
          "// (two slashes)",
          "# (hash)",
          "/* ... */",
          "-- (two dashes)"
        ],
        correctAnswer: "# (hash)"
      },
      {
        id: "mcq-print-16",
        type: "predict-output",
        question: "What does this code output?",
        code: "print('A')\n# print('B')\nprint('C')",
        options: ["A\nB\nC", "A\nC", "A B C", "Error"],
        correctAnswer: "A\nC",
        explanation: "The middle line is a comment and gets ignored."
      },
      {
        id: "mcq-print-18",
        type: "multiple-choice",
        question: "How many lines does print('One')\\nprint('Two') output?",
        options: ["1 line", "2 lines", "3 lines", "0 lines"],
        correctAnswer: "2 lines"
      },
      {
        id: "mcq-print-19",
        type: "predict-output",
        question: "What does this code output?",
        code: "print('123')",
        options: ["123", "one hundred twenty-three", "'123'", "Error"],
        correctAnswer: "123",
        explanation: "'123' is a string (text). The quotation marks are not printed."
      },
      {
        id: "mcq-print-21",
        type: "spot-the-error",
        question: "What's wrong?",
        code: "PRINT('Error')",
        options: [
          "PRINT must be lowercase",
          "Missing quotation marks",
          "Brackets are wrong",
          "No error"
        ],
        correctAnswer: "PRINT must be lowercase",
        explanation: "Python is case-sensitive: print (not PRINT or Print)"
      },
      {
        id: "mcq-print-23",
        type: "multiple-choice",
        question: "Which statement is FALSE?",
        options: [
          "print() outputs text to the console",
          "Strings need quotation marks",
          "Comments start with #",
          "print must be capitalized"
        ],
        correctAnswer: "print must be capitalized"
      },
      {
        id: "mcq-print-24",
        type: "predict-output",
        question: "What does this code output?",
        code: "print(\"This is a test\")",
        options: ["This is a test", "\"This is a test\"", "Error", "Nothing"],
        correctAnswer: "This is a test",
        explanation: "Double quotation marks work the same as single ones."
      },
      {
        id: "mcq-print-25",
        type: "spot-the-error",
        question: "What's the syntax error?",
        code: "print 'Hello'",
        options: [
          "Missing brackets around 'Hello'",
          "Hello must be capitalized",
          "Missing semicolon",
          "No error"
        ],
        correctAnswer: "Missing brackets around 'Hello'",
        explanation: "In Python 3, print() always needs brackets: print('Hello')"
      }
    ],
    codeTasks: [
      {
        id: "code-print-1",
        step: 1,
        title: "Output text",
        description: "Output 'Welcome' to the console.",
        blocks: [{ type: "code", content: "# Write your code here" }],
        showHints: false,
        path: "/drills/print/1",
        courseId: "python-drills",
        prompt: "Output 'Welcome' to the console.",
        starterCode: "# Write your code here",
        solutionString: "Welcome",
        solutionCode: ["print(", "Welcome"]
      },
      {
        id: "code-print-2",
        step: 2,
        title: "Output multiple lines",
        description: "Output 'Python' and 'Rocks' on two lines to the console.",
        blocks: [{ type: "code", content: "# Write your code here" }],
        showHints: false,
        path: "/drills/print/2",
        courseId: "python-drills",
        prompt: "Output 'Python' on line 1 and 'Rocks' on line 2 to the console.",
        starterCode: "# Write your code here",
        solutionString: "Python\nRocks",
        solutionCode: ["print(", "Python", "print(", "Rocks"]
      },
      {
        id: "code-print-3",
        step: 3,
        title: "Output greeting",
        description: "Output 'Good Morning' to the console.",
        blocks: [{ type: "code", content: "# Output a greeting to the console" }],
        showHints: false,
        path: "/drills/print/3",
        courseId: "python-drills",
        prompt: "Output the text 'Good Morning' to the console.",
        starterCode: "# Output a greeting to the console",
        solutionString: "Good Morning",
        solutionCode: ["print(", "Good Morning"]
      },
      {
        id: "code-print-4",
        step: 4,
        title: "Output three lines",
        description: "Output 'One', 'Two' and 'Three' each on their own line to the console.",
        blocks: [{ type: "code", content: "# Output three lines to the console" }],
        showHints: false,
        path: "/drills/print/4",
        courseId: "python-drills",
        prompt: "Output 'One', 'Two' and 'Three' on three separate lines to the console. Use three print() calls.",
        starterCode: "# Output three lines to the console",
        solutionString: "One\nTwo\nThree",
        solutionCode: ["print(", "One", "print(", "Two", "print(", "Three"]
      },
      {
        id: "code-print-5",
        step: 5,
        title: "Sentence with punctuation",
        description: "Output 'Done!' with exclamation mark to the console.",
        blocks: [{ type: "code", content: "# Output the text to the console" }],
        showHints: false,
        path: "/drills/print/5",
        courseId: "python-drills",
        prompt: "Output the text 'Done!' (with exclamation mark) to the console.",
        starterCode: "# Output the text to the console",
        solutionString: "Done!",
        solutionCode: ["print(", "Done!"]
      },
      {
        id: "code-print-7",
        step: 7,
        title: "Empty line and text",
        description: "Output an empty line first, then 'End' to the console.",
        blocks: [{ type: "code", content: "# First empty line, then text" }],
        showHints: false,
        path: "/drills/print/7",
        courseId: "python-drills",
        prompt: "Output an empty line first (print() without content), then 'End' on the next line.",
        starterCode: "# First empty line, then text",
        solutionString: "\nEnd",
        solutionCode: ["print()", "print(", "End"]
      },
      {
        id: "code-print-8",
        step: 8,
        title: "Output question",
        description: "Output 'How are you?' to the console.",
        blocks: [{ type: "code", content: "# Output a question to the console" }],
        showHints: false,
        path: "/drills/print/8",
        courseId: "python-drills",
        prompt: "Output the text 'How are you?' to the console.",
        starterCode: "# Output a question to the console",
        solutionString: "How are you?",
        solutionCode: ["print(", "How are you?"]
      },
      {
        id: "code-print-9",
        step: 9,
        title: "Output four lines",
        description: "Output 'A', 'B', 'C', 'D' on four lines to the console.",
        blocks: [{ type: "code", content: "# Output four letters to the console" }],
        showHints: false,
        path: "/drills/print/9",
        courseId: "python-drills",
        prompt: "Output 'A', 'B', 'C' and 'D' each on their own line to the console.",
        starterCode: "# Output four letters to the console",
        solutionString: "A\nB\nC\nD",
        solutionCode: ["print(", "'A'", "print(", "'B'", "print(", "'C'", "print(", "'D'"]
      },
      {
        id: "code-print-10",
        step: 10,
        title: "Sentence with period",
        description: "Output 'This is a sentence.' with period at the end to the console.",
        blocks: [{ type: "code", content: "# Output a complete sentence to the console" }],
        showHints: false,
        path: "/drills/print/10",
        courseId: "python-drills",
        prompt: "Output 'This is a sentence.' (with period at the end) to the console.",
        starterCode: "# Output a complete sentence to the console",
        solutionString: "This is a sentence.",
        solutionCode: ["print(", "This is a sentence."]
      },
      {
        id: "code-print-12",
        step: 12,
        title: "Greeting with name",
        description: "Output 'Hello, I am Python!' to the console.",
        blocks: [{ type: "code", content: "# Greet the user" }],
        showHints: false,
        path: "/drills/print/12",
        courseId: "python-drills",
        prompt: "Output 'Hello, I am Python!' to the console.",
        starterCode: "# Greet the user",
        solutionString: "Hello, I am Python!",
        solutionCode: ["print(", "Hello, I am Python!"]
      },
      {
        id: "code-print-13",
        step: 13,
        title: "Empty line between text",
        description: "Output 'Start', an empty line and 'End' to the console.",
        blocks: [{ type: "code", content: "# Start, empty line, End" }],
        showHints: false,
        path: "/drills/print/13",
        courseId: "python-drills",
        prompt: "Output 'Start', then an empty line (print() without content), then 'End' to the console.",
        starterCode: "# Start, empty line, End",
        solutionString: "Start\n\nEnd",
        solutionCode: ["print(", "'Start'", "print()", "print(", "'End'"]
      },
      {
        id: "code-print-15",
        step: 15,
        title: "Countdown output",
        description: "Output '3', '2', '1', 'Go!' on four lines to the console.",
        blocks: [{ type: "code", content: "# Countdown output" }],
        showHints: false,
        path: "/drills/print/15",
        courseId: "python-drills",
        prompt: "Output '3', '2', '1' and 'Go!' each on their own line to the console.",
        starterCode: "# Countdown output",
        solutionString: "3\n2\n1\nGo!",
        solutionCode: ["print(", "'3'", "print(", "'2'", "print(", "'1'", "print(", "'Go!'"]
      }
    ]
  },
  // Remaining topics will be added in subsequent files
  // For now, we'll import them from a separate file to avoid token limits
];
