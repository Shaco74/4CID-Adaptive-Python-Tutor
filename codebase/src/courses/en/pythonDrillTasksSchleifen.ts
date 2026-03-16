import type { DrillTask } from "@/types/courseTypes";

export const schleifenDrillsEn: DrillTask = {
  topic: "Schleifen",
  mcQuestions: [
    {
      id: "mcq-schleifen-1",
      type: "predict-output",
      question: "How many times does this loop run?",
      code: "for i in range(5):\n    print(i)",
      options: ["4 times", "5 times", "6 times", "Error"],
      correctAnswer: "5 times",
      explanation: "range(5) generates numbers 0, 1, 2, 3, 4 - so 5 iterations."
    },
    {
      id: "mcq-schleifen-2",
      type: "multiple-choice",
      question: "What does range(1, 4) return?",
      options: ["1, 2, 3, 4", "1, 2, 3", "0, 1, 2, 3", "2, 3, 4"],
      correctAnswer: "1, 2, 3",
      explanation: "range(start, stop) - the stop number is NOT included! range(1, 4) → 1, 2, 3"
    },
    {
      id: "mcq-schleifen-3",
      type: "predict-output",
      question: "What does this code output?",
      code: "for i in range(3):\n    print(i)",
      options: ["0\n1\n2", "1\n2\n3", "0\n1\n2\n3", "1\n2"],
      correctAnswer: "0\n1\n2",
      explanation: "range(3) = range(0, 3) → 0, 1, 2"
    },
    {
      id: "mcq-schleifen-4",
      type: "spot-the-error",
      question: "What is the error?",
      code: "for i in range(1, 5)\nprint(i)",
      options: ["The colon after range(1, 5) is missing", "print must be indented", "Both are wrong", "No error"],
      correctAnswer: "Both are wrong",
      explanation: "for loops need : at the end AND indentation in the block"
    },
    {
      id: "mcq-schleifen-5",
      type: "fill-the-blank",
      question: "Complete to output 1 to 5:",
      code: "for i in range(1, ___):\n    print(i)",
      options: ["6", "5", "4", "7"],
      correctAnswer: "6",
      explanation: "For 1-5 you need range(1, 6) - stop number is not included!"
    },
    {
      id: "mcq-schleifen-6",
      type: "predict-output",
      question: "How many times does this loop run?",
      code: "for year in range(1, 4):\n    print('Year')",
      options: ["2 times", "3 times", "4 times", "5 times"],
      correctAnswer: "3 times",
      explanation: "range(1, 4) → 1, 2, 3 = 3 iterations"
    },
    {
      id: "mcq-schleifen-7",
      type: "multiple-choice",
      question: "What does 'x = x + 1' do?",
      options: ["Sets x to 1", "Increases x by 1", "Checks if x equals x + 1", "Error"],
      correctAnswer: "Increases x by 1",
      explanation: "x = x + 1 takes the old value of x, adds 1, stores back in x"
    },
    {
      id: "mcq-schleifen-8",
      type: "predict-output",
      question: "What does this code output?",
      code: "x = 10\nfor i in range(3):\n    x = x + 5\nprint(x)",
      options: ["15", "20", "25", "10"],
      correctAnswer: "25",
      explanation: "Start: 10, +5 → 15, +5 → 20, +5 → 25"
    },
    {
      id: "mcq-schleifen-9",
      type: "spot-the-error",
      question: "Why doesn't compound interest work?",
      code: "amount = 1000\nfor i in range(3):\n    new_amount = amount * 1.05\nprint(new_amount)",
      options: ["amount is never updated", "The formula is wrong", "range(3) is too small", "No error"],
      correctAnswer: "amount is never updated",
      explanation: "Should be: amount = amount * 1.05 (not new_amount)"
    },
    {
      id: "mcq-schleifen-10",
      type: "predict-output",
      question: "What does this code output?",
      code: "for i in range(2, 5):\n    print(i)",
      options: ["2\n3\n4", "2\n3\n4\n5", "1\n2\n3\n4", "3\n4\n5"],
      correctAnswer: "2\n3\n4",
      explanation: "range(2, 5) returns 2, 3, 4. The 5 is exclusive."
    },
    {
      id: "mcq-schleifen-11",
      type: "multiple-choice",
      question: "What does 'exclusive' mean in range()?",
      options: ["The start value is skipped", "The end value is not reached", "Only even numbers are used", "The loop runs backwards"],
      correctAnswer: "The end value is not reached",
      explanation: "In range(1, 5), 5 is exclusive - only 1, 2, 3, 4 are generated."
    },
    {
      id: "mcq-schleifen-12",
      type: "fill-the-blank",
      question: "Complete for 5 iterations (0 to 4):",
      code: "for i in range(___):\n    print('Hello')",
      options: ["4", "5", "6", "0, 4"],
      correctAnswer: "5",
      explanation: "range(5) generates 0, 1, 2, 3, 4 - so 5 iterations."
    },
    {
      id: "mcq-schleifen-13",
      type: "spot-the-error",
      question: "What is missing in this code?",
      code: "for i in range(1, 5)\n    print(i)",
      options: ["The colon after range(1, 5)", "The keyword 'do'", "A loop variable", "No error"],
      correctAnswer: "The colon after range(1, 5)",
      explanation: "for loops must end with : → for i in range(1, 5):"
    },
    {
      id: "mcq-schleifen-14",
      type: "predict-output",
      question: "What does this code output?",
      code: "total = 0\nfor i in range(1, 4):\n    total = total + i\nprint(total)",
      options: ["3", "6", "10", "0"],
      correctAnswer: "6",
      explanation: "total = 0 + 1 + 2 + 3 = 6"
    },
    {
      id: "mcq-schleifen-15",
      type: "multiple-choice",
      question: "What numbers does range(0, 3) return?",
      options: ["0, 1, 2, 3", "0, 1, 2", "1, 2, 3", "1, 2"],
      correctAnswer: "0, 1, 2",
      explanation: "range(0, 3) starts at 0 and ends before 3."
    },
    {
      id: "mcq-schleifen-16",
      type: "spot-the-error",
      question: "What is wrong with this code?",
      code: "for i in range(3):\nprint(i)",
      options: ["print must be indented", "range(3) is invalid", "The variable i is missing", "No error"],
      correctAnswer: "print must be indented",
      explanation: "The loop body must be indented (4 spaces or tab)."
    },
    {
      id: "mcq-schleifen-17",
      type: "predict-output",
      question: "What does this code output?",
      code: "for x in range(3):\n    print('*')",
      options: ["*", "***", "*\n*\n*", "Error"],
      correctAnswer: "*\n*\n*",
      explanation: "The loop runs 3 times and outputs * on a new line each time."
    },
    {
      id: "mcq-schleifen-18",
      type: "fill-the-blank",
      question: "How do you output the numbers 1, 2, 3, 4, 5?",
      code: "for i in range(1, ___):\n    print(i)",
      options: ["5", "6", "4", "0"],
      correctAnswer: "6",
      explanation: "For 1 to 5 you need range(1, 6), since 6 is exclusive."
    },
    {
      id: "mcq-schleifen-19",
      type: "predict-output",
      question: "What does this code output?",
      code: "product = 1\nfor i in range(1, 4):\n    product = product * i\nprint(product)",
      options: ["6", "3", "1", "24"],
      correctAnswer: "6",
      explanation: "product = 1 * 1 * 2 * 3 = 6"
    },
    {
      id: "mcq-schleifen-20",
      type: "multiple-choice",
      question: "What is the difference between range(5) and range(1, 6)?",
      options: ["No difference", "range(5) starts at 0, range(1, 6) starts at 1", "range(5) has 5 elements, range(1, 6) has 6", "range(5) is faster"],
      correctAnswer: "range(5) starts at 0, range(1, 6) starts at 1",
      explanation: "range(5) = 0,1,2,3,4 and range(1,6) = 1,2,3,4,5 - both have 5 elements but different start values."
    },
    {
      id: "mcq-schleifen-21",
      type: "predict-output",
      question: "What does this code output?",
      code: "for i in range(4):\n    print(i * 10)",
      options: ["0\n10\n20\n30", "10\n20\n30\n40", "0\n10\n20\n30\n40", "40"],
      correctAnswer: "0\n10\n20\n30",
      explanation: "range(4) = 0,1,2,3. Each value times 10: 0,10,20,30."
    },
    {
      id: "mcq-schleifen-22",
      type: "multiple-choice",
      question: "What happens to the loop variable after the loop?",
      options: ["It is automatically deleted", "It keeps the last value", "It is set to 0", "It no longer exists"],
      correctAnswer: "It keeps the last value",
      explanation: "After for i in range(3): i has the value 2 (last iteration)."
    },
    {
      id: "mcq-schleifen-23",
      type: "predict-output",
      question: "What does this code output?",
      code: "for i in range(3):\n    print('Line')\nprint('End')",
      options: ["Line\nLine\nLine\nEnd", "Line\nEnd\nLine\nEnd\nLine\nEnd", "Line Line Line End", "Error"],
      correctAnswer: "Line\nLine\nLine\nEnd",
      explanation: "The loop outputs 'Line' 3 times. 'End' comes once after the loop."
    },
    {
      id: "mcq-schleifen-24",
      type: "fill-the-blank",
      question: "How does the loop run 10 times?",
      code: "for i in ___:\n    print('Iteration')",
      options: ["range(10)", "range(1, 10)", "range(0, 9)", "range(11)"],
      correctAnswer: "range(10)",
      explanation: "range(10) generates 0-9, so 10 iterations."
    },
    {
      id: "mcq-schleifen-25",
      type: "spot-the-error",
      question: "What is the error?",
      code: "for i in range(5);\n    print(i)",
      options: ["Semicolon instead of colon", "i is not a valid variable", "range(5) needs two values", "No error"],
      correctAnswer: "Semicolon instead of colon",
      explanation: "for loops end with : (colon), not ; (semicolon)."
    },
    {
      id: "mcq-schleifen-26",
      type: "predict-output",
      question: "What does this code output?",
      code: "total = 10\nfor i in range(3):\n    total = total - 1\nprint(total)",
      options: ["7", "10", "0", "3"],
      correctAnswer: "7",
      explanation: "Start: 10, then 3x -1: 10-1-1-1 = 7"
    },
    {
      id: "mcq-schleifen-27",
      type: "multiple-choice",
      question: "What does range(2, 2) return?",
      options: ["2", "Nothing (empty sequence)", "2, 2", "Error"],
      correctAnswer: "Nothing (empty sequence)",
      explanation: "If Start = Stop, the sequence is empty. The loop runs 0 times."
    },
    {
      id: "mcq-schleifen-28",
      type: "predict-output",
      question: "What does this code output?",
      code: "for i in range(1, 1):\n    print('Hello')\nprint('Done')",
      options: ["Hello\nDone", "Done", "Hello", "Error"],
      correctAnswer: "Done",
      explanation: "range(1, 1) is empty, the loop is skipped. Only 'Done' is output."
    },
    {
      id: "mcq-schleifen-29",
      type: "fill-the-blank",
      question: "Output the numbers 5, 6, 7:",
      code: "for i in range(___, ___):\n    print(i)",
      options: ["5, 8", "5, 7", "4, 7", "5, 9"],
      correctAnswer: "5, 8",
      explanation: "range(5, 8) returns 5, 6, 7. 8 is exclusive."
    },
    {
      id: "mcq-schleifen-30",
      type: "predict-output",
      question: "What does this code output?",
      code: "text = ''\nfor i in range(4):\n    text = text + 'a'\nprint(text)",
      options: ["aaaa", "a", "4", "Error"],
      correctAnswer: "aaaa",
      explanation: "Starts with empty string, adds 'a' 4 times: aaaa"
    }
  ],
  codeTasks: [
    {
      id: "code-schleifen-1",
      step: 1,
      title: "Simple for loop",
      description: "Print the numbers from 0 to 4 with a for loop.",
      blocks: [{ type: "code", content: "# Print numbers from 0 to 4" }],
      showHints: false,
      path: "/drills/schleifen/1",
      courseId: "python-drills",
      prompt: "Use a for loop with range(5) to print the numbers.",
      starterCode: "# Print numbers from 0 to 4",
      solutionString: "0\n1\n2\n3\n4",
      solutionCode: ["for ", "range(5)", "print"]
    },
    {
      id: "code-schleifen-2",
      step: 3,
      title: "Loop through a list",
      description: "Loop through a list of names and print each name.",
      blocks: [{ type: "code", content: "names = ['Anna', 'Bob', 'Charlie']\n# Print each name" }],
      showHints: false,
      path: "/drills/schleifen/3",
      courseId: "python-drills",
      prompt: "Use a for loop to iterate through the list and print each name.",
      starterCode: "names = ['Anna', 'Bob', 'Charlie']\n# Print each name",
      solutionString: "Anna\nBob\nCharlie",
      solutionCode: ["for ", " in ", "print"]
    },
    {
      id: "code-schleifen-3",
      step: 5,
      title: "for loop with range() and f-string",
      description: "Print 'Year 1', 'Year 2', 'Year 3' with a for loop.",
      blocks: [{ type: "code", content: "# Your code here" }],
      showHints: false,
      path: "/drills/schleifen/5",
      courseId: "python-drills",
      prompt: "Print 'Year 1', 'Year 2', 'Year 3' with a for loop. Use range(1, 4) and f-strings. Print each line.",
      starterCode: "# Your code here",
      solutionString: "Year 1\nYear 2\nYear 3",
      solutionCode: ["for ", "range(1, 4)", ":", "print(", "f'", "{"]
    },
    {
      id: "code-schleifen-4",
      step: 6,
      title: "Increase variable in loop",
      description: "x = 0. Increase x by 1 five times in a loop. Print x at the end.",
      blocks: [{ type: "code", content: "x = 0\n# Your code here" }],
      showHints: false,
      path: "/drills/schleifen/6",
      courseId: "python-drills",
      prompt: "Variable x starts at 0. Increase x by 1 five times in a for loop (x = x + 1). Print x at the end.",
      starterCode: "x = 0\n# Your code here",
      solutionString: "5",
      solutionCode: ["for ", "range(5)", "x", "=", "+", "1", "print("]
    },
    {
      id: "code-schleifen-5",
      step: 5,
      title: "Output numbers 1 to 5",
      description: "Print the numbers 1 to 5 with a loop.",
      blocks: [{ type: "code", content: "# Print numbers 1 to 5" }],
      showHints: false,
      path: "/drills/schleifen/5",
      courseId: "python-drills",
      prompt: "Use a for loop with range(1, 6) to print numbers 1 to 5. Each number on a new line.",
      starterCode: "# Print numbers 1 to 5",
      solutionString: "1\n2\n3\n4\n5",
      solutionCode: ["for ", "range(1, 6)", ":", "print("]
    },
    {
      id: "code-schleifen-6",
      step: 6,
      title: "Calculate sum",
      description: "Calculate the sum of numbers 1 to 5.",
      blocks: [{ type: "code", content: "total = 0\n# Add numbers 1 to 5" }],
      showHints: false,
      path: "/drills/schleifen/6",
      courseId: "python-drills",
      prompt: "Variable total starts at 0. Use a for loop with range(1, 6) to add each number to total (total = total + i). Print total at the end.",
      starterCode: "total = 0\n# Add numbers 1 to 5",
      solutionString: "15",
      solutionCode: ["for ", "range(1, 6)", "total", "=", "+", "print("]
    },
    {
      id: "code-schleifen-7",
      step: 7,
      title: "Output stars",
      description: "Print 4 stars (*) below each other.",
      blocks: [{ type: "code", content: "# Print 4 stars" }],
      showHints: false,
      path: "/drills/schleifen/7",
      courseId: "python-drills",
      prompt: "Use a for loop with range(4) to print '*' 4 times. Each star on a new line.",
      starterCode: "# Print 4 stars",
      solutionString: "*\n*\n*\n*",
      solutionCode: ["for ", "range(4)", ":", "print(", "'*'"]
    },
    {
      id: "code-schleifen-8",
      step: 8,
      title: "Count up",
      description: "Count from 10 to 12.",
      blocks: [{ type: "code", content: "# Count from 10 to 12" }],
      showHints: false,
      path: "/drills/schleifen/8",
      courseId: "python-drills",
      prompt: "Use a for loop with range(10, 13) to print the numbers 10, 11, 12.",
      starterCode: "# Count from 10 to 12",
      solutionString: "10\n11\n12",
      solutionCode: ["for ", "range(10, 13)", ":", "print("]
    },
    {
      id: "code-schleifen-9",
      step: 9,
      title: "Multiplication in loop",
      description: "Double a value 3 times.",
      blocks: [{ type: "code", content: "value = 2\n# Double value 3 times" }],
      showHints: false,
      path: "/drills/schleifen/9",
      courseId: "python-drills",
      prompt: "Variable value starts at 2. Use a for loop with range(3) to double value 3 times (value = value * 2). Print value at the end.",
      starterCode: "value = 2\n# Double value 3 times",
      solutionString: "16",
      solutionCode: ["for ", "range(3)", "value", "=", "* 2", "print("]
    },
    {
      id: "code-schleifen-10",
      step: 10,
      title: "Numbered lines",
      description: "Print 'Line 1', 'Line 2', 'Line 3'.",
      blocks: [{ type: "code", content: "# Print numbered lines" }],
      showHints: false,
      path: "/drills/schleifen/10",
      courseId: "python-drills",
      prompt: "Use a for loop with range(1, 4) and f-strings to print 'Line 1', 'Line 2', 'Line 3'.",
      starterCode: "# Print numbered lines",
      solutionString: "Line 1\nLine 2\nLine 3",
      solutionCode: ["for ", "range(1, 4)", ":", "print(", "f'", "{"]
    },
    {
      id: "code-schleifen-11",
      step: 11,
      title: "Countdown from 5",
      description: "Print the numbers 5, 4, 3, 2, 1.",
      blocks: [{ type: "code", content: "# Countdown from 5 to 1" }],
      showHints: false,
      path: "/drills/schleifen/11",
      courseId: "python-drills",
      prompt: "Use a for loop with range(1, 6). In each iteration print (6 - i) to count down from 5.",
      starterCode: "# Countdown from 5 to 1",
      solutionString: "5\n4\n3\n2\n1",
      solutionCode: ["for ", "range(1, 6)", ":", "print(", "6 - "]
    },
    {
      id: "code-schleifen-12",
      step: 12,
      title: "Steps of ten",
      description: "Print 10, 20, 30, 40.",
      blocks: [{ type: "code", content: "# Print steps of ten" }],
      showHints: false,
      path: "/drills/schleifen/12",
      courseId: "python-drills",
      prompt: "Use a for loop with range(1, 5) and print i * 10.",
      starterCode: "# Print steps of ten",
      solutionString: "10\n20\n30\n40",
      solutionCode: ["for ", "range(1, 5)", ":", "print(", "* 10"]
    },
    {
      id: "code-schleifen-13",
      step: 13,
      title: "Repeat text",
      description: "Print 'Hello' 3 times.",
      blocks: [{ type: "code", content: "# Print Hello 3 times" }],
      showHints: false,
      path: "/drills/schleifen/13",
      courseId: "python-drills",
      prompt: "Use a for loop with range(3) to print 'Hello' 3 times.",
      starterCode: "# Print Hello 3 times",
      solutionString: "Hello\nHello\nHello",
      solutionCode: ["for ", "range(3)", ":", "print(", "'Hello'"]
    },
    {
      id: "code-schleifen-14",
      step: 14,
      title: "Calculate product",
      description: "Calculate 1 * 2 * 3 * 4 with a loop.",
      blocks: [{ type: "code", content: "result = 1\n# Multiply with 1, 2, 3, 4" }],
      showHints: false,
      path: "/drills/schleifen/14",
      courseId: "python-drills",
      prompt: "Variable result starts at 1. Use a for loop with range(1, 5) to multiply result by each number (result = result * i). Print result.",
      starterCode: "result = 1\n# Multiply with 1, 2, 3, 4",
      solutionString: "24",
      solutionCode: ["for ", "range(1, 5)", "result", "=", "* ", "print("]
    },
    {
      id: "code-schleifen-15",
      step: 15,
      title: "Build a string",
      description: "Build the string 'XXX' with a loop.",
      blocks: [{ type: "code", content: "text = ''\n# Add 'X' 3 times" }],
      showHints: false,
      path: "/drills/schleifen/15",
      courseId: "python-drills",
      prompt: "Variable text starts as empty string ''. Use a for loop with range(3) to add 'X' 3 times (text = text + 'X'). Print text.",
      starterCode: "text = ''\n# Add 'X' 3 times",
      solutionString: "XXX",
      solutionCode: ["for ", "range(3)", "text", "=", "+ 'X'", "print("]
    }
  ]
};
