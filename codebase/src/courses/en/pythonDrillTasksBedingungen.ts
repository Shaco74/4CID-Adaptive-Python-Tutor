import type { DrillTask } from "@/types/courseTypes";

export const bedingungenDrillsEn: DrillTask = {
  topic: "Bedingungen",
  mcQuestions: [
    {
      id: "mcq-bedingungen-1",
      type: 'multiple-choice',
      question: "Which keyword is used for conditions?",
      options: ["when", "if", "case", "check"],
      correctAnswer: "if"
    },
    {
      id: "mcq-bedingungen-2",
      type: 'multiple-choice',
      question: "Which comparison operator checks for equality?",
      options: ["=", "==", "===", "equals"],
      correctAnswer: "=="
    },
    {
      id: "mcq-bedingungen-3",
      type: "predict-output",
      question: "What does this code output?",
      code: "x = 100\nif x < 50:\n    print('A')\nelif x < 75:\n    print('B')\nelse:\n    print('C')",
      options: ["A", "B", "C", "Nothing"],
      correctAnswer: "C",
      explanation: "100 is not < 50 and not < 75, so else is executed: 'C'"
    },
    {
      id: "mcq-bedingungen-4",
      type: "multiple-choice",
      question: "Which comparison operator checks for 'less than'?",
      options: ["<", ">", "<=", "=="],
      correctAnswer: "<",
      explanation: "< means 'less than', e.g., 5 < 10 is True"
    },
    {
      id: "mcq-bedingungen-5",
      type: "spot-the-error",
      question: "What is missing in this code?",
      code: "if age > 18\n    print('Adult')",
      options: ["The colon after the condition", "The keyword 'then'", "Parentheses around the condition", "A semicolon"],
      correctAnswer: "The colon after the condition",
      explanation: "if statements end with : → if age > 18:"
    },
    {
      id: "mcq-bedingungen-6",
      type: "predict-output",
      question: "What does this code output?",
      code: "x = 15\nif x < 10:\n    print('Small')",
      options: ["Small", "15", "Nothing", "Error"],
      correctAnswer: "Nothing",
      explanation: "The condition x < 10 is False (15 is not < 10), so print() is not executed."
    },
    {
      id: "mcq-bedingungen-7",
      type: "spot-the-error",
      question: "What is wrong?",
      code: "if bmi < 25:\nprint('Normal')",
      options: ["The indentation is missing for print", "The colon is missing", "bmi must be in parentheses", "No error"],
      correctAnswer: "The indentation is missing for print",
      explanation: "Code in the if block must be indented (4 spaces or tab)"
    },
    {
      id: "mcq-bedingungen-8",
      type: "fill-the-blank",
      question: "Complete:",
      code: "if score ___ 50:\n    print('Passed')",
      options: [">=", "<=", "=", "=>"],
      correctAnswer: ">=",
      explanation: ">= means 'greater than or equal to'"
    },
    {
      id: "mcq-bedingungen-9",
      type: "multiple-choice",
      question: "What does elif mean?",
      options: ["else if (otherwise if)", "end if", "error if", "exit if"],
      correctAnswer: "else if (otherwise if)",
      explanation: "elif is short for 'else if' - an alternative to the first condition"
    },
    {
      id: "mcq-bedingungen-10",
      type: "predict-output",
      question: "What does this code output?",
      code: "score = 75\nif score < 50:\n    print('F')\nelif score < 80:\n    print('C')\nelif score < 90:\n    print('B')",
      options: ["F", "C", "B", "Nothing"],
      correctAnswer: "C",
      explanation: "75 is not < 50, but < 80, so 'C' is output. Then Python stops."
    },
    {
      id: "mcq-bedingungen-11",
      type: "spot-the-error",
      question: "What is the error?",
      code: "if x < 10:\n    print('Small')\nelif:\n    print('Large')",
      options: ["elif needs a condition", "else is missing", "The indentation is wrong", "No error"],
      correctAnswer: "elif needs a condition",
      explanation: "elif needs a condition like elif x >= 10: - Without a condition, use else"
    },
    {
      id: "mcq-bedingungen-12",
      type: "multiple-choice",
      question: "How many elif can you have?",
      options: ["Maximum 1", "Maximum 2", "Any number", "Exactly 3"],
      correctAnswer: "Any number",
      explanation: "You can write as many elif blocks as needed"
    },
    {
      id: "mcq-bedingungen-13",
      type: "multiple-choice",
      question: "When is the else block executed?",
      options: ["Always", "Never", "When none of the previous conditions was True", "Only on errors"],
      correctAnswer: "When none of the previous conditions was True",
      explanation: "else catches all cases not covered by if and elif"
    },
    {
      id: "mcq-bedingungen-14",
      type: "spot-the-error",
      question: "What is wrong?",
      code: "if x < 10:\n    print('Small')\nelse x >= 10:\n    print('Large')",
      options: ["else doesn't need a condition", "elif is missing", "The indentation is wrong", "No error"],
      correctAnswer: "else doesn't need a condition",
      explanation: "else stands alone, without a condition: else: (not else x >= 10:)"
    },
    {
      id: "mcq-bedingungen-15",
      type: "multiple-choice",
      question: "Can you have multiple else blocks?",
      options: ["Yes, any number", "Yes, maximum 2", "No, only one else block per if", "Yes, but only with elif"],
      correctAnswer: "No, only one else block per if",
      explanation: "else is the last block, only allowed once per if statement"
    },
    {
      id: "mcq-bedingungen-16",
      type: "spot-the-error",
      question: "What is wrong with this code?",
      code: "if x > 10\n    print('Large')",
      options: ["The colon after the condition is missing", "x must be in parentheses", "print must be capitalized", "No error"],
      correctAnswer: "The colon after the condition is missing",
      explanation: "if statements always end with : (colon)"
    },
    {
      id: "mcq-bedingungen-17",
      type: "predict-output",
      question: "What does this code output?",
      code: "temp = 5\nif temp < 0:\n    print('Freezing')\nelif temp < 15:\n    print('Cool')\nelse:\n    print('Warm')",
      options: ["Freezing", "Cool", "Warm", "Nothing"],
      correctAnswer: "Cool",
      explanation: "5 is not < 0, but < 15, so 'Cool' is output."
    },
    {
      id: "mcq-bedingungen-18",
      type: "fill-the-blank",
      question: "Complete for 'equal':",
      code: "if a ___ b:\n    print('Equal')",
      options: ["=", "==", "===", "equals"],
      correctAnswer: "==",
      explanation: "== checks for equality. = is only for assignment."
    },
    {
      id: "mcq-bedingungen-19",
      type: "multiple-choice",
      question: "What does the operator <= check?",
      options: ["Less than", "Greater than", "Less than or equal", "Assignment"],
      correctAnswer: "Less than or equal",
      explanation: "<= means 'less than or equal', e.g., 5 <= 5 is True."
    },
    {
      id: "mcq-bedingungen-20",
      type: "predict-output",
      question: "What does this code output?",
      code: "num = 7\nif num == 5:\n    print('Five')\nelif num == 7:\n    print('Seven')\nelif num == 7:\n    print('Also Seven')",
      options: ["Five", "Seven", "Also Seven", "Seven\nAlso Seven"],
      correctAnswer: "Seven",
      explanation: "Only the FIRST matching condition is executed. Python stops after 'Seven'."
    },
    {
      id: "mcq-bedingungen-21",
      type: "predict-output",
      question: "What does this code output?",
      code: "value = 50\nif value > 100:\n    print('High')\nprint('Done')",
      options: ["High\nDone", "Done", "High", "Nothing"],
      correctAnswer: "Done",
      explanation: "50 > 100 is False, so 'High' is skipped. 'Done' is outside the if block."
    },
    {
      id: "mcq-bedingungen-22",
      type: "multiple-choice",
      question: "When do you need elif instead of else?",
      options: ["Always", "When you want to check another condition", "When the first if block is empty", "elif and else are the same"],
      correctAnswer: "When you want to check another condition",
      explanation: "elif checks a new condition, else catches everything else."
    },
    {
      id: "mcq-bedingungen-23",
      type: "spot-the-error",
      question: "What is the error?",
      code: "if x = 10:\n    print('Ten')",
      options: ["= should be == (comparison instead of assignment)", "x is not defined", "print is wrong", "No error"],
      correctAnswer: "= should be == (comparison instead of assignment)",
      explanation: "For comparison you need ==, not = (that's assignment)."
    },
    {
      id: "mcq-bedingungen-24",
      type: "predict-output",
      question: "What does this code output?",
      code: "x = 10\ny = 10\nif x == y:\n    print('Equal')\nelse:\n    print('Not equal')",
      options: ["Equal", "Not equal", "True", "10 10"],
      correctAnswer: "Equal",
      explanation: "x == y is True (both are 10), so 'Equal' is output."
    },
    {
      id: "mcq-bedingungen-25",
      type: "fill-the-blank",
      question: "Check if x is greater than 0:",
      code: "if x ___ 0:\n    print('Positive')",
      options: [">", "<", "==", ">="],
      correctAnswer: ">",
      explanation: "> means 'greater than'. x > 0 checks if x is positive."
    },
    {
      id: "mcq-bedingungen-26",
      type: "predict-output",
      question: "What does this code output?",
      code: "n = 0\nif n > 0:\n    print('Plus')\nelif n < 0:\n    print('Minus')\nelse:\n    print('Zero')",
      options: ["Plus", "Minus", "Zero", "Nothing"],
      correctAnswer: "Zero",
      explanation: "0 is neither > 0 nor < 0, so else is executed: 'Zero'"
    },
    {
      id: "mcq-bedingungen-27",
      type: "multiple-choice",
      question: "What is the difference between > and >= ?",
      options: ["No difference", ">= includes the boundary value, > doesn't", "> is for numbers, >= for text", ">= is faster"],
      correctAnswer: ">= includes the boundary value, > doesn't",
      explanation: "5 > 5 is False, but 5 >= 5 is True."
    },
    {
      id: "mcq-bedingungen-28",
      type: "spot-the-error",
      question: "What is wrong?",
      code: "if x > 5\n    print('Large')\nelse:\n    print('Small')",
      options: [": is missing after x > 5", "else needs a condition", "The indentation is wrong", "No error"],
      correctAnswer: ": is missing after x > 5",
      explanation: "Every if, elif, and else ends with a colon: if x > 5:"
    },
    {
      id: "mcq-bedingungen-29",
      type: "predict-output",
      question: "What does this code output?",
      code: "price = 100\nif price >= 100:\n    print('Expensive')\nif price >= 50:\n    print('Medium')",
      options: ["Expensive", "Medium", "Expensive\nMedium", "Nothing"],
      correctAnswer: "Expensive\nMedium",
      explanation: "These are TWO separate if statements. Both conditions are True for 100."
    },
    {
      id: "mcq-bedingungen-30",
      type: "fill-the-blank",
      question: "Complete the else block:",
      code: "if x > 10:\n    print('Large')\n___:\n    print('Small')",
      options: ["else", "elif", "otherwise", "default"],
      correctAnswer: "else",
      explanation: "else catches all cases not covered by if."
    }
  ],
  codeTasks: [
    {
      id: "code-bedingungen-1",
      step: 1,
      title: "Simple if condition",
      description: "Check if a number is greater than 10.",
      blocks: [{ type: "code", content: "number = 15\n# Check if number is greater than 10" }],
      showHints: false,
      path: "/drills/bedingungen/1",
      courseId: "python-drills",
      prompt: "Use an if condition to check if the number is greater than 10. Print 'Greater than 10' if the condition is met.",
      starterCode: "number = 15\n# Check if number is greater than 10",
      solutionString: "Greater than 10",
      solutionCode: ["if ", "> 10", "print("]
    },
    {
      id: "code-bedingungen-2",
      step: 3,
      title: "Multiple conditions",
      description: "Rate a school grade (1-6).",
      blocks: [{ type: "code", content: "grade = 2\n# Rate the grade" }],
      showHints: false,
      path: "/drills/bedingungen/3",
      courseId: "python-drills",
      prompt: "Use if/elif for grade rating: For grade==1 print 'Excellent', for grade==2 print 'Good', for grade==3 print 'Satisfactory'.",
      starterCode: "grade = 2\n# Rate the grade",
      solutionString: "Good",
      solutionCode: ["if ", "elif ", "print("]
    },
    {
      id: "code-bedingungen-3",
      step: 4,
      title: "if statement with comparison",
      description: "Check if x > 10. If yes, print 'Large'. x = 15",
      blocks: [{ type: "code", content: "x = 15\n# Your code here" }],
      showHints: false,
      path: "/drills/bedingungen/4",
      courseId: "python-drills",
      prompt: "Check if x > 10. If yes, print 'Large'. Don't forget the colon and indentation!",
      starterCode: "x = 15\n# Your code here",
      solutionString: "Large",
      solutionCode: ["if ", "x ", "> 10", ":", "print(", "'Large'"]
    },
    {
      id: "code-bedingungen-4",
      step: 5,
      title: "if statement with >= operator",
      description: "Check if age >= 18. If yes, print 'Adult'. age = 20",
      blocks: [{ type: "code", content: "age = 20\n# Your code here" }],
      showHints: false,
      path: "/drills/bedingungen/5",
      courseId: "python-drills",
      prompt: "Check if age >= 18. If yes, print 'Adult'. Don't forget the colon and indentation!",
      starterCode: "age = 20\n# Your code here",
      solutionString: "Adult",
      solutionCode: ["if ", "age ", ">=", "18", ":", "print(", "'Adult'"]
    },
    {
      id: "code-bedingungen-5",
      step: 6,
      title: "if-elif for temperature classification",
      description: "Classify the temperature as Cold, Mild, or Warm.",
      blocks: [{ type: "code", content: "temp = 25\n# Your code here" }],
      showHints: false,
      path: "/drills/bedingungen/6",
      courseId: "python-drills",
      prompt: "Variable temp is 25. Use if/elif/else: If temp < 10 print 'Cold'. If temp <= 25 print 'Mild'. Otherwise print 'Warm'.",
      starterCode: "temp = 25\n# Your code here",
      solutionString: "Mild",
      solutionCode: ["if ", "10", "elif ", "<=", ":", "print(", "'Mild'"]
    },
    {
      id: "code-bedingungen-6",
      step: 7,
      title: "Positive or Negative",
      description: "Check if a number is positive or negative.",
      blocks: [{ type: "code", content: "number = -5\n# Check if positive or negative" }],
      showHints: false,
      path: "/drills/bedingungen/7",
      courseId: "python-drills",
      prompt: "Variable number is -5. If number >= 0, print 'Positive'. Otherwise print 'Negative'.",
      starterCode: "number = -5\n# Check if positive or negative",
      solutionString: "Negative",
      solutionCode: ["if ", "number", ">=", "0", ":", "else", "print(", "'Negative'"]
    },
    {
      id: "code-bedingungen-7",
      step: 8,
      title: "Speed check",
      description: "Rate the speed.",
      blocks: [{ type: "code", content: "speed = 65\n# Rate the speed" }],
      showHints: false,
      path: "/drills/bedingungen/8",
      courseId: "python-drills",
      prompt: "Variable speed is 65. If speed < 50 print 'Slow'. If speed <= 80 print 'Normal'. Otherwise print 'Fast'.",
      starterCode: "speed = 65\n# Rate the speed",
      solutionString: "Normal",
      solutionCode: ["if ", "speed", "<", "50", "elif", "<=", "80", "else", "print(", "'Normal'"]
    },
    {
      id: "code-bedingungen-8",
      step: 9,
      title: "Determine age group",
      description: "Determine the age group.",
      blocks: [{ type: "code", content: "years = 15\n# Determine age group" }],
      showHints: false,
      path: "/drills/bedingungen/9",
      courseId: "python-drills",
      prompt: "Variable years is 15. If years < 13 print 'Child'. If years < 18 print 'Teenager'. Otherwise print 'Adult'.",
      starterCode: "years = 15\n# Determine age group",
      solutionString: "Teenager",
      solutionCode: ["if ", "years", "<", "13", "elif", "<", "18", "else", "print(", "'Teenager'"]
    },
    {
      id: "code-bedingungen-9",
      step: 10,
      title: "Determine discount level",
      description: "Determine the discount level based on quantity.",
      blocks: [{ type: "code", content: "quantity = 25\n# Determine discount level" }],
      showHints: false,
      path: "/drills/bedingungen/10",
      courseId: "python-drills",
      prompt: "Variable quantity is 25. If quantity < 10 print 'No discount'. If quantity < 50 print '5% discount'. Otherwise print '10% discount'.",
      starterCode: "quantity = 25\n# Determine discount level",
      solutionString: "5% discount",
      solutionCode: ["if ", "quantity", "<", "10", "elif", "<", "50", "else", "print(", "'5% discount'"]
    },
    {
      id: "code-bedingungen-10",
      step: 11,
      title: "Check equality",
      description: "Check if two numbers are equal.",
      blocks: [{ type: "code", content: "a = 10\nb = 10\n# Check if a and b are equal" }],
      showHints: false,
      path: "/drills/bedingungen/11",
      courseId: "python-drills",
      prompt: "Variables a and b are both 10. If a == b print 'Equal'. Otherwise print 'Different'.",
      starterCode: "a = 10\nb = 10\n# Check if a and b are equal",
      solutionString: "Equal",
      solutionCode: ["if ", "a", "==", "b", ":", "else", "print(", "'Equal'"]
    },
    {
      id: "code-bedingungen-11",
      step: 12,
      title: "Water temperature",
      description: "Rate the water temperature.",
      blocks: [{ type: "code", content: "water = 85\n# Rate water temperature" }],
      showHints: false,
      path: "/drills/bedingungen/12",
      courseId: "python-drills",
      prompt: "Variable water is 85. If water < 50 print 'Cold'. If water < 80 print 'Warm'. Otherwise print 'Hot'.",
      starterCode: "water = 85\n# Rate water temperature",
      solutionString: "Hot",
      solutionCode: ["if ", "water", "<", "50", "elif", "<", "80", "else", "print(", "'Hot'"]
    },
    {
      id: "code-bedingungen-12",
      step: 13,
      title: "Exam result",
      description: "Rate the exam result.",
      blocks: [{ type: "code", content: "percent = 72\n# Rate the result" }],
      showHints: false,
      path: "/drills/bedingungen/13",
      courseId: "python-drills",
      prompt: "Variable percent is 72. If percent < 50 print 'Failed'. If percent < 70 print 'Passed'. Otherwise print 'Passed with honors'.",
      starterCode: "percent = 72\n# Rate the result",
      solutionString: "Passed with honors",
      solutionCode: ["if ", "percent", "<", "50", "elif", "<", "70", "else", "print(", "'Passed with honors'"]
    },
    {
      id: "code-bedingungen-13",
      step: 14,
      title: "Time of day greeting",
      description: "Print a greeting based on the hour.",
      blocks: [{ type: "code", content: "hour = 14\n# Print a greeting" }],
      showHints: false,
      path: "/drills/bedingungen/14",
      courseId: "python-drills",
      prompt: "Variable hour is 14. If hour < 12 print 'Good morning'. If hour < 18 print 'Good day'. Otherwise print 'Good evening'.",
      starterCode: "hour = 14\n# Print a greeting",
      solutionString: "Good day",
      solutionCode: ["if ", "hour", "<", "12", "elif", "<", "18", "else", "print(", "'Good day'"]
    },
    {
      id: "code-bedingungen-14",
      step: 15,
      title: "Size comparison",
      description: "Compare two numbers.",
      blocks: [{ type: "code", content: "x = 20\ny = 15\n# Compare x and y" }],
      showHints: false,
      path: "/drills/bedingungen/15",
      courseId: "python-drills",
      prompt: "Variable x is 20 and y is 15. If x > y print 'x is larger'. If x < y print 'y is larger'. Otherwise print 'Equal size'.",
      starterCode: "x = 20\ny = 15\n# Compare x and y",
      solutionString: "x is larger",
      solutionCode: ["if ", "x", ">", "y", "elif", "<", "else", "print(", "'x is larger'"]
    },
    {
      id: "code-bedingungen-15",
      step: 16,
      title: "At least 18",
      description: "Check if age is at least 18.",
      blocks: [{ type: "code", content: "years = 21\n# Check age" }],
      showHints: false,
      path: "/drills/bedingungen/16",
      courseId: "python-drills",
      prompt: "Variable years is 21. If years >= 18 print 'Adult'. Otherwise print 'Minor'.",
      starterCode: "years = 21\n# Check age",
      solutionString: "Adult",
      solutionCode: ["if ", "years", ">=", "18", ":", "else", "print(", "'Adult'"]
    }
  ]
};
