import type { DrillTask } from "@/types/courseTypes";

export const listenDrillsEn: DrillTask = {
  topic: "Listen",
  mcQuestions: [
    {
      id: "mcq-listen-2",
      type: 'multiple-choice',
      question: "How do you remove the last element from a list?",
      options: ["list.remove()", "list.pop()", "list.delete()", "list.clear()"],
      correctAnswer: "list.pop()"
    },
    {
      id: "mcq-listen-5",
      type: "multiple-choice",
      question: "How do you create an empty list?",
      options: ["list = ()", "list = []", "list = {}", "list = ''"],
      correctAnswer: "list = []",
      explanation: "Empty list with square brackets: list = []"
    },
    {
      id: "mcq-listen-6",
      type: "multiple-choice",
      question: "How do you add an element to the end of a list?",
      options: ["list.add(element)", "list.append(element)", "list.push(element)", "list.insert(element)"],
      correctAnswer: "list.append(element)",
      explanation: ".append() adds elements at the end of the list"
    },
    {
      id: "mcq-listen-7",
      type: "predict-output",
      question: "What does this code output?",
      code: "numbers = []\nnumbers.append(10)\nnumbers.append(20)\nprint(numbers)",
      options: ["[10, 20]", "10 20", "[10] [20]", "Error"],
      correctAnswer: "[10, 20]",
      explanation: "The list contains two elements: [10, 20]"
    },
    {
      id: "mcq-listen-8",
      type: "spot-the-error",
      question: "What is the error?",
      code: "list = []\nlist.add(5)\nprint(list)",
      options: ["It should be .append() instead of .add()", "List needs parentheses: list()", "print is wrong", "No error"],
      correctAnswer: "It should be .append() instead of .add()",
      explanation: "Python lists use .append(), not .add()"
    },
    {
      id: "mcq-listen-9",
      type: "predict-output",
      question: "What does this code output?",
      code: "history = []\nfor i in range(1, 4):\n    history.append(i * 10)\nprint(history)",
      options: ["[10, 20, 30]", "[1, 2, 3]", "[0, 10, 20, 30]", "10 20 30"],
      correctAnswer: "[10, 20, 30]",
      explanation: "The loop adds 10, 20, 30 to the list"
    },
    {
      id: "mcq-listen-10",
      type: "multiple-choice",
      question: "What does a list store in Python?",
      options: ["Only a single value", "Multiple values in a collection", "Only text values", "Only number values"],
      correctAnswer: "Multiple values in a collection"
    },
    {
      id: "mcq-listen-11",
      type: "predict-output",
      question: "What does this code output?",
      code: "animals = []\nanimals.append('Dog')\nanimals.append('Cat')\nprint(animals)",
      options: ["['Dog', 'Cat']", "Dog Cat", "['Cat', 'Dog']", "Error"],
      correctAnswer: "['Dog', 'Cat']",
      explanation: ".append() adds elements in the order they are called."
    },
    {
      id: "mcq-listen-12",
      type: "fill-the-blank",
      question: "Complete the code to add 'Milk' to the list:",
      code: "shopping = []\nshopping.___(\"Milk\")",
      options: ["add", "append", "push", "insert"],
      correctAnswer: "append",
      explanation: ".append() is the Python method for adding elements at the end of a list."
    },
    {
      id: "mcq-listen-13",
      type: "spot-the-error",
      question: "What is the error in this code?",
      code: "colors = ()\ncolors.append('Red')\nprint(colors)",
      options: ["Empty list must be created with [], not ()", "append is misspelled", "print needs parentheses around colors", "No error"],
      correctAnswer: "Empty list must be created with [], not ()",
      explanation: "() creates a tuple, not a list. Lists need square brackets: []"
    },
    {
      id: "mcq-listen-14",
      type: "predict-output",
      question: "What does this code output?",
      code: "nums = []\nfor i in range(1, 4):\n    nums.append(i * 2)\nprint(nums)",
      options: ["[2, 4, 6]", "[0, 2, 4, 6]", "[1, 2, 3]", "2 4 6"],
      correctAnswer: "[2, 4, 6]",
      explanation: "range(1, 4) = 1, 2, 3. Each value is doubled: 2, 4, 6."
    },
    {
      id: "mcq-listen-15",
      type: "multiple-choice",
      question: "What happens when you use print() on a list?",
      options: ["It gives an error", "Only the first element is shown", "The whole list is shown with square brackets", "Each element is shown on a new line"],
      correctAnswer: "The whole list is shown with square brackets",
      explanation: "print(list) shows: [Element1, Element2, ...]"
    },
    {
      id: "mcq-listen-16",
      type: "predict-output",
      question: "What does this code output?",
      code: "values = []\nvalues.append(5)\nvalues.append(5)\nvalues.append(5)\nprint(values)",
      options: ["[5]", "[5, 5, 5]", "[15]", "Error - same values not allowed"],
      correctAnswer: "[5, 5, 5]",
      explanation: "Lists can contain the same value multiple times."
    },
    {
      id: "mcq-listen-17",
      type: "spot-the-error",
      question: "What is wrong with this code?",
      code: "texts = []\ntexts.append(Hello)\nprint(texts)",
      options: ["'Hello' needs quotes", "The list is empty", "print is wrong", "No error"],
      correctAnswer: "'Hello' needs quotes",
      explanation: "Text must be in quotes: texts.append('Hello')"
    },
    {
      id: "mcq-listen-18",
      type: "fill-the-blank",
      question: "How do you create an empty list?",
      code: "my_list = ___",
      options: ["()", "[]", "{}", "''"],
      correctAnswer: "[]",
      explanation: "Square brackets [] create an empty list."
    },
    {
      id: "mcq-listen-19",
      type: "predict-output",
      question: "What does this code output?",
      code: "data = []\nprint(data)",
      options: ["[]", "None", "Error", "(empty)"],
      correctAnswer: "[]",
      explanation: "An empty list is displayed as []."
    },
    {
      id: "mcq-listen-20",
      type: "multiple-choice",
      question: "Which statement about .append() is correct?",
      options: ["Adds an element at the beginning of the list", "Adds an element at the end of the list", "Replaces the last element", "Deletes an element"],
      correctAnswer: "Adds an element at the end of the list",
      explanation: ".append() always adds at the end of the list."
    },
    {
      id: "mcq-listen-21",
      type: "predict-output",
      question: "What does this code output?",
      code: "list = []\nlist.append('A')\nlist.append('B')\nlist.append('C')\nprint(list)",
      options: ["['A', 'B', 'C']", "['C', 'B', 'A']", "A B C", "ABC"],
      correctAnswer: "['A', 'B', 'C']",
      explanation: "Elements are stored in the order they are added."
    },
    {
      id: "mcq-listen-22",
      type: "multiple-choice",
      question: "Can a list contain different data types?",
      options: ["No, only same types", "Yes, numbers and text mixed", "Only if you convert them", "Only with special syntax"],
      correctAnswer: "Yes, numbers and text mixed",
      explanation: "Python lists can store different types: [1, 'Text', 3.14]"
    },
    {
      id: "mcq-listen-23",
      type: "predict-output",
      question: "What does this code output?",
      code: "mix = []\nmix.append(1)\nmix.append('Two')\nmix.append(3.0)\nprint(mix)",
      options: ["[1, 'Two', 3.0]", "Error - different types", "[1, Two, 3.0]", "1 Two 3.0"],
      correctAnswer: "[1, 'Two', 3.0]",
      explanation: "Lists can store integers, strings, and floats mixed."
    },
    {
      id: "mcq-listen-24",
      type: "spot-the-error",
      question: "What is the error?",
      code: "todo = []\ntodo.append['Shopping']\nprint(todo)",
      options: [".append() needs round parentheses, not square", "'Shopping' is too long", "todo is a reserved word", "No error"],
      correctAnswer: ".append() needs round parentheses, not square",
      explanation: "Correct: todo.append('Shopping') with round parentheses ()"
    },
    {
      id: "mcq-listen-25",
      type: "fill-the-blank",
      question: "Add 100 to the list:",
      code: "points = []\npoints.___(___))",
      options: ["append, 100", "add, 100", "push, 100", "insert, 100"],
      correctAnswer: "append, 100",
      explanation: ".append(100) adds the number 100 to the list."
    },
    {
      id: "mcq-listen-26",
      type: "predict-output",
      question: "What does this code output?",
      code: "letters = []\nfor i in range(3):\n    letters.append('X')\nprint(letters)",
      options: ["['X', 'X', 'X']", "['X']", "XXX", "[0, 1, 2]"],
      correctAnswer: "['X', 'X', 'X']",
      explanation: "The loop runs 3 times and adds 'X' each time."
    },
    {
      id: "mcq-listen-27",
      type: "multiple-choice",
      question: "What is the advantage of a list over individual variables?",
      options: ["Lists are faster", "You can store any number of values", "Lists use less memory", "Lists have no advantages"],
      correctAnswer: "You can store any number of values",
      explanation: "Instead of x1, x2, x3... you can collect all values in one list."
    },
    {
      id: "mcq-listen-28",
      type: "predict-output",
      question: "What does this code output?",
      code: "nums = []\nfor n in range(1, 3):\n    nums.append(n)\n    nums.append(n)\nprint(nums)",
      options: ["[1, 1, 2, 2]", "[1, 2, 1, 2]", "[1, 2]", "[2, 2]"],
      correctAnswer: "[1, 1, 2, 2]",
      explanation: "Each value (1 and 2) is added twice in succession."
    },
    {
      id: "mcq-listen-29",
      type: "spot-the-error",
      question: "What is wrong?",
      code: "names = []\nnames.append('Max')\nnames.append('Lisa')\nprint[names]",
      options: ["print needs round parentheses: print(names)", "The list is incorrectly defined", "'Max' and 'Lisa' are not valid names", "No error"],
      correctAnswer: "print needs round parentheses: print(names)",
      explanation: "Function calls need round parentheses: print(names)"
    },
    {
      id: "mcq-listen-30",
      type: "predict-output",
      question: "What does this code output?",
      code: "a = []\nb = []\na.append(1)\nb.append(2)\nprint(a)\nprint(b)",
      options: ["[1]\n[2]", "[1, 2]", "[2]\n[1]", "Error"],
      correctAnswer: "[1]\n[2]",
      explanation: "a and b are separate lists. Each has its own element."
    }
  ],
  codeTasks: [
    {
      id: "code-listen-1",
      step: 0,
      title: "Create a simple list",
      description: "Create a list with the values 1, 2, 3 and print it.",
      blocks: [{ type: "code", content: "# Create a list with values 1, 2, 3" }],
      showHints: false,
      path: "/drills/listen/0",
      courseId: "python-drills",
      prompt: "Create a list with the values 1, 2, 3 and print it.",
      starterCode: "# Create a list with values 1, 2, 3",
      solutionString: "[1, 2, 3]",
      solutionCode: ["[1", "2", "3]", "print("]
    },
    {
      id: "code-listen-2",
      step: 1,
      title: "Create a list",
      description: "Create a list with the numbers 4, 5, 6 and print it.",
      blocks: [{ type: "code", content: "# Create a list with 4, 5, 6" }],
      showHints: false,
      path: "/drills/listen/1",
      courseId: "python-drills",
      prompt: "Create a list with the numbers 4, 5, 6 and print it.",
      starterCode: "# Create a list with 4, 5, 6",
      solutionString: "[4, 5, 6]",
      solutionCode: ["[4", "5", "6", "print("]
    },
    {
      id: "code-listen-3",
      step: 2,
      title: "Extend a list",
      description: "Add the number 4 to the list.",
      blocks: [{ type: "code", content: "numbers = [1, 2, 3]\n# Add 4" }],
      showHints: false,
      path: "/drills/listen/2",
      courseId: "python-drills",
      prompt: "Use the append method to add the number 4 to the list. Print the extended list.",
      starterCode: "numbers = [1, 2, 3]\n# Add 4",
      solutionString: "[1, 2, 3, 4]",
      solutionCode: [".append(", "print("]
    },
    {
      id: "code-listen-4",
      step: 3,
      title: "Search a list",
      description: "Check if the number 3 is in the list.",
      blocks: [{ type: "code", content: "numbers = [1, 2, 3, 4, 5]\n# Check if 3 is in the list" }],
      showHints: false,
      path: "/drills/listen/3",
      courseId: "python-drills",
      prompt: "Use the in operator (e.g., '3 in numbers') to check if 3 is in the list. Print the result directly.",
      starterCode: "numbers = [1, 2, 3, 4, 5]\n# Check if 3 is in the list",
      solutionString: "True",
      solutionCode: [" in ", "numbers", "print("]
    },
    {
      id: "code-listen-5",
      step: 5,
      title: "Create a shopping list",
      description: "Create a shopping list with 3 items.",
      blocks: [{ type: "code", content: "# Create a shopping list" }],
      showHints: false,
      path: "/drills/listen/5",
      courseId: "python-drills",
      prompt: "Create an empty list 'shopping'. Add 'Milk', 'Bread', and 'Eggs' (in this order). Print the list.",
      starterCode: "# Create a shopping list",
      solutionString: "['Milk', 'Bread', 'Eggs']",
      solutionCode: ["shopping", "= []", ".append(", "'Milk'", "'Bread'", "'Eggs'", "print("]
    },
    {
      id: "code-listen-6",
      step: 6,
      title: "Collect numbers",
      description: "Collect the numbers 10, 20, and 30 in a list.",
      blocks: [{ type: "code", content: "# Collect numbers in a list" }],
      showHints: false,
      path: "/drills/listen/6",
      courseId: "python-drills",
      prompt: "Create an empty list 'values'. Add the numbers 10, 20, and 30. Print the list.",
      starterCode: "# Collect numbers in a list",
      solutionString: "[10, 20, 30]",
      solutionCode: ["values", "= []", ".append(", "10", "20", "30", "print("]
    },
    {
      id: "code-listen-7",
      step: 7,
      title: "Fill list with loop",
      description: "Fill a list with numbers 1 to 5 using a loop.",
      blocks: [{ type: "code", content: "# Fill the list with a loop" }],
      showHints: false,
      path: "/drills/listen/7",
      courseId: "python-drills",
      prompt: "Create an empty list 'numbers'. Use a for loop with range(1, 6) to add numbers 1 to 5. Print the list at the end.",
      starterCode: "# Fill the list with a loop",
      solutionString: "[1, 2, 3, 4, 5]",
      solutionCode: ["numbers", "= []", "for ", "range(1, 6)", ".append(", "print("]
    },
    {
      id: "code-listen-8",
      step: 8,
      title: "Doubled values",
      description: "Create a list with the doubled values 2, 4, 6.",
      blocks: [{ type: "code", content: "# Create a list with doubled values" }],
      showHints: false,
      path: "/drills/listen/8",
      courseId: "python-drills",
      prompt: "Create an empty list 'doubled'. Use a for loop with range(1, 4) and add each value times 2 (i * 2). Print the list.",
      starterCode: "# Create a list with doubled values",
      solutionString: "[2, 4, 6]",
      solutionCode: ["doubled", "= []", "for ", "range(1, 4)", ".append(", "* 2", "print("]
    },
    {
      id: "code-listen-9",
      step: 9,
      title: "Cities list",
      description: "Create a list with 3 city names.",
      blocks: [{ type: "code", content: "# Create a cities list" }],
      showHints: false,
      path: "/drills/listen/9",
      courseId: "python-drills",
      prompt: "Create an empty list 'cities'. Add 'Berlin', 'Hamburg', and 'Munich'. Print the list.",
      starterCode: "# Create a cities list",
      solutionString: "['Berlin', 'Hamburg', 'Munich']",
      solutionCode: ["cities", "= []", ".append(", "'Berlin'", "'Hamburg'", "'Munich'", "print("]
    },
    {
      id: "code-listen-10",
      step: 10,
      title: "Collect square numbers",
      description: "Collect the square numbers 1, 4, 9 in a list.",
      blocks: [{ type: "code", content: "# Collect square numbers" }],
      showHints: false,
      path: "/drills/listen/10",
      courseId: "python-drills",
      prompt: "Create an empty list 'squares'. Use a for loop with range(1, 4) and add i * i (square of i). Print the list.",
      starterCode: "# Collect square numbers",
      solutionString: "[1, 4, 9]",
      solutionCode: ["squares", "= []", "for ", "range(1, 4)", ".append(", "* ", "print("]
    },
    {
      id: "code-listen-11",
      step: 11,
      title: "Collect colors",
      description: "Create a color list with 4 colors.",
      blocks: [{ type: "code", content: "# Create a color list" }],
      showHints: false,
      path: "/drills/listen/11",
      courseId: "python-drills",
      prompt: "Create an empty list 'colors'. Add 'Red', 'Green', 'Blue', and 'Yellow'. Print the list.",
      starterCode: "# Create a color list",
      solutionString: "['Red', 'Green', 'Blue', 'Yellow']",
      solutionCode: ["colors", "= []", ".append(", "'Red'", "'Green'", "'Blue'", "'Yellow'", "print("]
    },
    {
      id: "code-listen-12",
      step: 12,
      title: "Even numbers",
      description: "Collect the even numbers 2, 4, 6, 8 in a list.",
      blocks: [{ type: "code", content: "# Collect even numbers" }],
      showHints: false,
      path: "/drills/listen/12",
      courseId: "python-drills",
      prompt: "Create an empty list 'even'. Use a for loop with range(1, 5) and add i * 2. Print the list.",
      starterCode: "# Collect even numbers",
      solutionString: "[2, 4, 6, 8]",
      solutionCode: ["even", "= []", "for ", "range(1, 5)", ".append(", "* 2", "print("]
    },
    {
      id: "code-listen-13",
      step: 13,
      title: "Weekdays",
      description: "Create a list with 3 weekdays.",
      blocks: [{ type: "code", content: "# Create a weekday list" }],
      showHints: false,
      path: "/drills/listen/13",
      courseId: "python-drills",
      prompt: "Create an empty list 'days'. Add 'Monday', 'Tuesday', and 'Wednesday'. Print the list.",
      starterCode: "# Create a weekday list",
      solutionString: "['Monday', 'Tuesday', 'Wednesday']",
      solutionCode: ["days", "= []", ".append(", "'Monday'", "'Tuesday'", "'Wednesday'", "print("]
    },
    {
      id: "code-listen-14",
      step: 14,
      title: "Steps of five",
      description: "Create a list with 5, 10, 15, 20.",
      blocks: [{ type: "code", content: "# Create a list with steps of five" }],
      showHints: false,
      path: "/drills/listen/14",
      courseId: "python-drills",
      prompt: "Create an empty list 'fives'. Use a for loop with range(1, 5) and add i * 5. Print the list.",
      starterCode: "# Create a list with steps of five",
      solutionString: "[5, 10, 15, 20]",
      solutionCode: ["fives", "= []", "for ", "range(1, 5)", ".append(", "* 5", "print("]
    },
    {
      id: "code-listen-15",
      step: 15,
      title: "Mixed list",
      description: "Create a list with numbers and text mixed.",
      blocks: [{ type: "code", content: "# Create a mixed list" }],
      showHints: false,
      path: "/drills/listen/15",
      courseId: "python-drills",
      prompt: "Create an empty list 'mix'. Add the number 1, the text 'Two', and the number 3. Print the list.",
      starterCode: "# Create a mixed list",
      solutionString: "[1, 'Two', 3]",
      solutionCode: ["mix", "= []", ".append(", "1", "'Two'", "3", "print("]
    }
  ]
};
