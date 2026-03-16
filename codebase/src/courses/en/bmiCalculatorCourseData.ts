import { CourseData } from "@/types/courseTypes";

export const bmiCalculatorCourseDataEn: CourseData = {
	id: "bmi-calculator",
	title: "BMI Calculator",
	description:
		"Build a Body Mass Index calculator. You'll learn variables, math operations, conditionals, and functions.",
	tasks: [
		{
			id: "bmi-calculator-step-1",
			hasDrill: true,
			step: 1,
			title: "Your First Output - Hello World",
			description: "Learn the print() function and strings.",
			blocks: [
				{
					type: "text",
					content:
						"Welcome to the BMI Calculator project! Before we start building the actual calculator, you'll learn the **print()** function and the difference between **text** and **numbers**.",
				},
				{
					type: "text",
					content:
						"## Strings vs. Numbers\n\nIn Python, there are two basic data types:\n\n- **Strings (Text)** → Always WITH quotation marks\n- **Numbers** → Always WITHOUT quotation marks",
				},
				{
					type: "code",
					title: "The Difference",
					language: "python",
					content: `# STRINGS - Text in quotation marks
"Hello World"      # A string
"42"               # Also a string! (just text, not a number)

# NUMBERS - Without quotation marks
42                 # An integer
3.14               # A float (decimal number)

# Remember: "42" (string) ≠ 42 (number)
# You can't do math with text, but you can with numbers!`,
				},
				{
					type: "text",
					content:
						"## The print() Function\n\nWith `print()` you output text to the console. The text must be a string - so it needs to be in quotation marks.",
				},
				{
					type: "code",
					title: "How print() works",
					language: "python",
					content: `# Output text
print("Welcome!")

# Each print creates a new line
print("First line")
print("Second line")

# Comments start with # and are ignored
print("Visible")  # Comment is ignored`,
				},
				{
					type: "hint",
					severity: "warning",
					content:
						"**Without quotation marks = Error!**\n\nPython needs to know what is code and what is text. Without `\"...\"` Python looks for a command named `Hello` - which doesn't exist!",
				},
				{
					type: "task",
					content:
						"Output the text `Hello World` to the console. Use the `print()` function with a string.",
				},
				{
					type: "hint",
					content:
						"**Structure:** `print(\"Your text\")`\n\n`print` → `(` → `\"...\"` → `)`",
					severity: "info",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/1",
			courseId: "bmi-calculator",
			topics: ["print"],
			solutionString: ["Hello World"],
			solutionCode: ["print("],
			starterCode: `# My BMI Calculator

# Output "Hello World" using print() to the console`,
		},
		{
			id: "bmi-calculator-step-2",
			step: 2,
			title: "Project Title Output",
			description: "Change the output to our project name.",
			blocks: [
				{
					type: "text",
					content:
						"Great! You've made your first output. Now let's adjust the text for our project.",
				},
				{
					type: "text",
					content:
						"## Functions and Arguments\n\n`print()` is a **function** - a predefined command that performs a specific task.\n\nThe text inside the parentheses is the **argument** - the information we pass to the function.",
				},
				{
					type: "code",
					title: "Function and Argument",
					language: "python",
					content: `#       Function
#          ↓
         print("Hello World")
#              ↑___________↑
#              The argument (a string)

# The quotation marks turn the text into a string
# The string is passed to print()
# print() outputs it to the console`,
				},
				{
					type: "text",
					content:
						"**Remember:** The quotation marks `\"...\"` create a string. This string is passed as an argument to `print()`. You can change the text between the quotation marks however you like!",
				},
				{
					type: "task",
					content:
						"Change the argument from `\"Hello World\"` to `\"My BMI Calculator\"`. Keep the comment!",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/2",
			courseId: "bmi-calculator",
			topics: ["print"],
			solutionString: ["My BMI Calculator"],
			solutionCode: ["print("],
			starterCode: `# My BMI Calculator

# Change this text
print("Hello World")`,
			hasDrill: true,
		},
		{
			id: "bmi-calculator-step-3",
			step: 3,
			hasDrill: true,
			title: "Your First Variable - Weight",
			description: "Store the weight in a variable.",
			blocks: [
				{
					type: "text",
					content:
						"Now you'll learn about **variables** - they allow us to store values and reuse them later.",
				},
				{
					type: "text",
					content:
						"## What is a Variable?\n\nThink of a variable like a **labeled box**:\n\n- The **label** is the name (e.g., `age`)\n- The **contents** are the stored value (e.g., `25`)",
				},
				{
					type: "code",
					title: "Creating a Variable",
					language: "python",
					content: `#    Name       Value
#      ↓          ↓
     age    =   25
#            ↑
#    Assignment operator
#    "Store 25 in age"`,
				},
				{
					type: "text",
					content:
						"## Variable as Argument\n\nThe special thing: You can pass a variable as an **argument** to `print()` - just like a string! Python then replaces the variable name with the stored value.",
				},
				{
					type: "code",
					title: "Outputting a Variable",
					language: "python",
					content: `points = 100

# Variable as argument (WITHOUT quotation marks!)
print(points)    # Output: 100

# With quotation marks it would be a string:
print("points")  # Output: points (the text, not the value!)`,
				},
				{
					type: "hint",
					severity: "warning",
					content:
						"**Variables WITHOUT quotation marks!**\n\n`print(points)` → outputs the value `100`\n\n`print(\"points\")` → outputs the text `points`",
				},
				{
					type: "task",
					content:
						"Create a variable `weight` with the value `77`. Then output the variable using `print()` so that `77` appears in the console.",
				},
				{
					type: "hint",
					content: "**Two lines:**\n\n1. Create variable: `name = value`\n2. Output variable: `print(name)` - without quotation marks!",
					severity: "info",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/3",
			courseId: "bmi-calculator",
			topics: ["Variablen"],
			solutionString: ["My BMI Calculator", "77"],
			solutionCode: ["weight=77", "print(weight)"],
			starterCode: `# My BMI Calculator

print("My BMI Calculator")

# Create the variable here

# Output the variable to the console`,
		},
		{
			id: "bmi-calculator-step-4",
			step: 4,
			title: "Second Variable - Height",
			description: "Add body height and learn about decimal numbers.",
			blocks: [
				{
					type: "text",
					content:
						"Well done! Now we need the body height for our BMI calculator.",
				},
				{
					type: "text",
					content:
						"## Two Types of Numbers\n\nSo far you've worked with `77` - an **integer**. The body height `1.79` is a **decimal number**.\n\n- **Integer (int)** → Whole numbers: `77`, `100`, `-5`\n- **Float** → Decimal numbers: `1.79`, `3.14`, `0.5`",
				},
				{
					type: "code",
					title: "Decimal Numbers in Python",
					language: "python",
					content: `# Integer
age = 25

# Float (decimal) - with DOT, not comma!
price = 9.99
temperature = 36.5

#  ✅ Correct: 3.14 (dot)
#  ❌ Wrong:   3,14 (comma doesn't work!)`,
				},
				{
					type: "hint",
					severity: "warning",
					content:
						"**Dot not comma!**\n\nIn some countries we write `1,79` - but Python uses the **dot** as decimal separator.",
				},
				{
					type: "task",
					content:
						"Create a variable `height` with the value `1.79` and output it using `print()`.",
				},
				{
					type: "hint",
					severity: "info",
					content:
						"Same as with `weight` - just with a different name and a decimal number as value.",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/4",
			courseId: "bmi-calculator",
			topics: ["Variablen", "Datentypen"],
			solutionString: ["My BMI Calculator", "77", "1.79"],
			solutionCode: ["height=1.79", "print(height)"],
			starterCode: `# My BMI Calculator

print("My BMI Calculator")

weight = 77
print(weight)

# Create the variable here

# Output the variable to the console`,
			hasDrill: true,
		},
		{
			id: "bmi-calculator-step-5",
			step: 5,
			hasDrill: true,
			title: "Better Output - Text and Variables",
			description: "Combine text with your variables.",
			blocks: [
				{
					type: "text",
					content:
						"The outputs `77` and `1.79` aren't very informative. What do these numbers mean? Let's **combine text and variables**!",
				},
				{
					type: "text",
					content:
						"## The Problem: Different Types\n\nWith `+` you can concatenate strings. But Python can't automatically combine a number with text - these are different data types!",
				},
				{
					type: "code",
					title: "The Problem",
					language: "python",
					content: `points = 42

# This does NOT work:
print("Points: " + points)
#                  ↑
# Error! String + Integer doesn't work`,
				},
				{
					type: "text",
					content:
						"## The Solution: str()\n\nThe function `str()` converts a number into a string. Then we can combine both with `+`.",
				},
				{
					type: "code",
					title: "The Solution with str()",
					language: "python",
					content: `points = 42

# str() converts the number to text
#         ↓
print("Points: " + str(points))
#                  ↑__________↑
#                  42 becomes "42"

# Output: Points: 42`,
				},
				{
					type: "hint",
					severity: "warning",
					content:
						"**str() is also a function!**\n\nJust like `print()`, `str()` takes an argument:\n\n`str(77)` → returns `\"77\"` (as a string)",
				},
				{
					type: "task",
					content:
						"Change the outputs to:\n\n- `Weight: 77`\n- `Height: 1.79`\n\nUse `+` and `str()` to combine text and variable.",
				},
				{
					type: "hint",
					severity: "info",
					content:
						"**Pattern:** `print(\"Text: \" + str(variable))`\n\nPay attention to the space after the colon!",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/5",
			courseId: "bmi-calculator",
			topics: ["Variablen", "Strings"],
			solutionString: ["My BMI Calculator", "Weight: 77", "Height: 1.79"],
			solutionCode: ["str(weight)", "str(height)"],
			starterCode: `# My BMI Calculator

print("My BMI Calculator")

weight = 77
height = 1.79

# Change these lines
print(weight)
print(height)`,
		},
		{
			id: "bmi-calculator-step-6",
			step: 6,
			title: "Calculate BMI - Math Operations",
			description: "Calculate the BMI using the official formula.",
			blocks: [
				{
					type: "text",
					content:
						"Now comes the exciting part! We'll calculate the **BMI** using the official formula.",
				},
				{
					type: "text",
					content:
						"## The BMI Formula\n\n**BMI = Weight ÷ (Height × Height)**\n\nExample for 77 kg and 1.79 m:\n\n1. Square the height: 1.79 × 1.79 = 3.2041\n2. Divide weight: 77 ÷ 3.2041 = **24.03**",
				},
				{
					type: "text",
					content:
						"## Math in Python\n\nPython can calculate! We store the result directly in a variable.",
				},
				{
					type: "code",
					title: "Math Operators",
					language: "python",
					content: `# Basic operations
5 + 3      # Addition = 8
10 - 4     # Subtraction = 6
6 * 7      # Multiplication = 42
20 / 4     # Division = 5.0

# Store result in variable
result = 10 * 5    # result = 50`,
				},
				{
					type: "code",
					title: "Example: Calculate Area",
					language: "python",
					content: `length = 5
width = 3

# Store formula in variable
area = length * width

print(area)  # Output: 15`,
				},
				{
					type: "hint",
					severity: "warning",
					content:
						"**Parentheses are important!**\n\n`a / b * c` calculates left to right\n\n`a / (b * c)` calculates parentheses first\n\nFor BMI, `height * height` must be calculated first!",
				},
				{
					type: "task",
					content:
						"Calculate the BMI: Weight divided by (Height times Height).\n\nStore the result in `bmi` and output it.",
				},
				{
					type: "hint",
					severity: "info",
					content:
						"**Formula:** Weight / (Height * Height)\n\nDon't forget the parentheses!",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/6",
			courseId: "bmi-calculator",
			topics: ["Variablen"],
			solutionString: [
				"My BMI Calculator",
				"Weight: 77",
				"Height: 1.79",
				"24.031709372366656",
			],
			solutionCode: ["bmi=weight/(height*height)", "print(bmi)"],
			starterCode: `# My BMI Calculator

print("My BMI Calculator")

weight = 77
height = 1.79

print("Weight: " + str(weight))
print("Height: " + str(height))

# Calculate the BMI here and output it`,
			hasDrill: true,
		},
		{
			id: "bmi-calculator-step-7",
			step: 7,
			hasDrill: true,
			title: "Output BMI with Text",
			description: "Improve the BMI output.",
			blocks: [
				{
					type: "text",
					content:
						"The output `24.031709...` isn't very user-friendly. Let's add a descriptive text!",
				},
				{
					type: "text",
					content:
						"## Review: Text + Variable\n\nIn Step 5 you learned how to combine text and numbers. Now we'll apply this to the BMI.",
				},
				{
					type: "code",
					title: "Review Pattern",
					language: "python",
					content: `# The pattern from Step 5:
print("Text: " + str(variable))

# Example:
result = 99.5
print("Result: " + str(result))
# Output: Result: 99.5`,
				},
				{
					type: "task",
					content:
						"Change `print(bmi)` so that the output reads `Your BMI: 24.031709372366656`.\n\nCombine the text with the variable.",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/7",
			courseId: "bmi-calculator",
			topics: ["Variablen", "Strings"],
			solutionString: [
				"My BMI Calculator",
				"Weight: 77",
				"Height: 1.79",
				"Your BMI: 24.031709372366656",
			],
			solutionCode: ["str(bmi)"],
			starterCode: `# My BMI Calculator

print("My BMI Calculator")

weight = 77
height = 1.79

print("Weight: " + str(weight))
print("Height: " + str(height))

bmi = weight / (height * height)

# Change this line
print(bmi)`,
		},
		{
			id: "bmi-calculator-step-8",
			step: 8,
			title: "First Condition - Introducing if",
			description: "Check if the BMI is in the normal range.",
			blocks: [
				{
					type: "text",
					content:
						"Now it gets exciting! We'll teach your program to **make decisions**.",
				},
				{
					type: "text",
					content:
						"## What is a Condition?\n\nWith `if` you can execute code only **when** a condition is met.\n\n- Condition **true** → Code is executed\n- Condition **false** → Code is skipped",
				},
				{
					type: "code",
					title: "Structure of an if-Statement",
					language: "python",
					content: `#  Keyword    Condition    Colon
#       ↓            ↓         ↓
       if       age >= 18     :
           print("Adult")
#          ↑
#     INDENTED! (Tab or 4 spaces)`,
				},
				{
					type: "text",
					content:
						"## Comparison Operators\n\nUse these operators to compare values:\n\n- `<` less than\n- `>` greater than\n- `<=` less than or equal\n- `>=` greater than or equal\n- `==` equals (two equal signs!)",
				},
				{
					type: "code",
					title: "Example",
					language: "python",
					content: `temperature = 30

if temperature > 25:
    print("It's warm!")  # Gets executed (30 > 25)

# This line is NOT indented
# It ALWAYS gets executed
print("Done")`,
				},
				{
					type: "hint",
					severity: "warning",
					content:
						"**Don't forget two things:**\n\n1. **Colon** at the end of the if-line\n2. **Indentation** for the code block (Tab key)",
				},
				{
					type: "task",
					content:
						"Write an if-statement: If the BMI is less than 25, output `Normal weight`.",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/8",
			courseId: "bmi-calculator",
			topics: ["Bedingungen"],
			solutionString: [
				"My BMI Calculator",
				"Weight: 77",
				"Height: 1.79",
				"Your BMI: 24.031709372366656",
				"Normal weight",
			],
			solutionCode: ["if bmi"],
			starterCode: `# My BMI Calculator

print("My BMI Calculator")

weight = 77
height = 1.79

print("Weight: " + str(weight))
print("Height: " + str(height))

bmi = weight / (height * height)

print("Your BMI: " + str(bmi))

# Your if-statement here`,
			hasDrill: true,
		},
		{
			id: "bmi-calculator-step-9",
			step: 9,
			hasDrill: true,
			title: "Multiple Conditions - elif",
			description: "Add more BMI categories.",
			blocks: [
				{
					type: "text",
					content:
						"One category isn't enough! We need multiple BMI categories. For that we use `elif`.",
				},
				{
					type: "text",
					content:
						"## BMI Categories (WHO)\n\n- **Underweight:** BMI < 18.5\n- **Normal weight:** BMI 18.5 - 24.9\n- **Overweight:** BMI 25.0 - 29.9\n- **Obese:** BMI ≥ 30",
				},
				{
					type: "text",
					content:
						"## What is elif?\n\n`elif` = **else if** (\"otherwise if\")\n\nPython checks from top to bottom. As soon as a condition is true, all others are **skipped**.",
				},
				{
					type: "code",
					title: "if-elif Chain (Example: Grades)",
					language: "python",
					content: `grade = 85

if grade >= 90:
    print("A")           # False, continue
elif grade >= 80:
    print("B")           # TRUE! → Output, STOP
elif grade >= 70:
    print("C")           # Gets skipped!`,
				},
				{
					type: "hint",
					severity: "warning",
					content:
						"**Order matters!**\n\nThe conditions must be in order because Python stops at the first true condition.",
				},
				{
					type: "task",
					content:
						"Expand to 3 BMI categories:\n\n1. Underweight (< 18.5)\n2. Normal weight (< 25)\n3. Overweight (< 30)\n\nModify the existing `if` and add two `elif`.",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/9",
			courseId: "bmi-calculator",
			topics: ["Bedingungen"],
			solutionString: [
				"My BMI Calculator",
				"Weight: 77",
				"Height: 1.79",
				"Your BMI: 24.031709372366656",
				"Normal weight",
			],
			solutionCode: ["if bmi", "elif bmi"],
			starterCode: `# My BMI Calculator

print("My BMI Calculator")

weight = 77
height = 1.79

print("Weight: " + str(weight))
print("Height: " + str(height))

bmi = weight / (height * height)

print("Your BMI: " + str(bmi))

# Expand this condition for 3 categories
if bmi < 25:
    print("Normal weight")`,
		},
		{
			id: "bmi-calculator-step-10",
			step: 10,
			title: "Improve Code - Variable Instead of Direct Output",
			description: "Refactoring: Store the category in a variable.",
			blocks: [
				{
					type: "text",
					content:
						"The code works, but we can **improve it**! Instead of calling `print()` in each block, we store the category in a variable.",
				},
				{
					type: "text",
					content:
						"## Why is This Better?\n\n**Before:** Each block outputs directly - the category is then \"gone\"\n\n**After:** The category is stored and can be reused",
				},
				{
					type: "code",
					title: "Before vs. After",
					language: "python",
				content: `# BEFORE: Direct output
if age >= 18:
    print("Adult")  # Status is gone

# AFTER: Store in variable
status = None  # Initial value

if age >= 18:
    status = "Adult"  # Stored!

print("Status: " + status)  # One output at the end`,
				},
				{
					type: "text",
					content:
						"## What is None?\n\n`None` is Python's value for \"nothing\" or \"not set yet\". We use it as an initial value before checking the conditions.",
				},
				{
					type: "task",
					content:
						"Refactoring:\n\n1. Create `category = None` before the `if`\n2. Replace all `print(\"...\")` with `category = \"...\"`\n\n**Note:** Outputting the category comes in the next step!",
				},
				{
					type: "hint",
					severity: "info",
					content:
						"**Tip:** The variable `category` is not output yet - we'll do that in the next step when all categories are covered.",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/10",
			courseId: "bmi-calculator",
			topics: ["Bedingungen", "Variablen"],
			solutionString: [],
			solutionCode: ["category=None", "category=\"Underweight\"", "category=\"Normal weight\"", "category=\"Overweight\""],
			starterCode: `# My BMI Calculator

print("My BMI Calculator")

weight = 77
height = 1.79

print("Weight: " + str(weight))
print("Height: " + str(height))

bmi = weight / (height * height)

print("Your BMI: " + str(bmi))

# Create category = None here

# Change print() to category = "..."
if bmi < 18.5:
    print("Underweight")
elif bmi < 25:
    print("Normal weight")
elif bmi < 30:
    print("Overweight")`,
			hasDrill: true,
		},
		{
			id: "bmi-calculator-step-11",
			step: 11,
			hasDrill: true,
			title: "Add Else - Complete Coverage",
			description: "Complete with else for all remaining cases.",
			blocks: [
				{
					type: "text",
					content:
						"Almost done! But what happens with BMI ≥ 30? We need **Obese** as the fourth category.",
				},
				{
					type: "text",
					content:
						"## What is else?\n\n`else` catches **all remaining cases** - without its own condition.\n\nIf none of the previous conditions were true, `else` is executed.",
				},
				{
					type: "code",
					title: "Example: Grade System with else",
					language: "python",
					content: `# Letter grades: A (best) to F (fail)
grade = 55

if grade >= 90:
    result = "A"
elif grade >= 80:
    result = "B"
elif grade >= 70:
    result = "C"
else:
    result = "Fail"  # All others (< 70)
#   ↑
# No condition needed!`,
				},
				{
					type: "hint",
					severity: "warning",
					content:
						"**else has no condition!**\n\nNot `else bmi >= 30:` but simply `else:`\n\nIf BMI is not < 18.5, < 25, or < 30, it must be ≥ 30.",
				},
				{
					type: "task",
					content:
						"1. Add `else:` after the last `elif` and assign `category = \"Obese\"`.\n2. Output the category at the end: `print(\"Category: \" + category)`\n\nTest: With `weight = 100` you should see `Category: Obese`.",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/11",
			courseId: "bmi-calculator",
			topics: ["Bedingungen", "Variablen"],
			solutionString: [
				"My BMI Calculator",
				"Category:",
			],
			solutionCode: ["if bmi", "elif bmi", "else:", "print(\"Category"],
			starterCode: `# My BMI Calculator

print("My BMI Calculator")

weight = 77
height = 1.79

print("Weight: " + str(weight))
print("Height: " + str(height))

bmi = weight / (height * height)

print("Your BMI: " + str(bmi))

category = None

if bmi < 18.5:
    category = "Underweight"
elif bmi < 25:
    category = "Normal weight"
elif bmi < 30:
    category = "Overweight"
# Add else for the fourth category here

# Output category here`,
		},
		{
			id: "bmi-calculator-step-12",
			step: 12,
			title: "Your BMI Calculator is Complete!",
			description: "Test your calculator with different values.",
			blocks: [
				{
					type: "text",
					content:
						"**Congratulations!** Your BMI calculator is complete and working!",
				},
				{
					type: "text",
					content:
						"## Test Your Calculator\n\nChange the values of `weight` and `height` at the beginning of the code. The rest automatically calculates the BMI and shows the correct category.",
				},
				{
					type: "code",
					title: "Example Values to Test",
					language: "python",
					content: `# Try different values!
# BMI = weight / (height * height)

# Example 1: Person with 60kg at 1.70m
weight = 60
height = 1.70  # BMI ≈ 20.8 → Normal weight

# Example 2: Person with 55kg at 1.80m
weight = 55
height = 1.80  # BMI ≈ 17.0 → Underweight

# Which values result in Obese (BMI ≥ 30)?
# Tip: BMI = weight / (height * height)`,
				},
				{
					type: "task",
					content:
						"Change `weight` and `height` so that `Category: Obese` is output (BMI ≥ 30).",
				},
				{
					type: "text",
					content:
						"## What You Learned\n\n- `print()` - Output to the console\n- **Variables** - Storing values\n- **Strings vs. Numbers** - With and without quotation marks\n- `str()` - Converting numbers to text\n- **Math** - Calculating with `+`, `-`, `*`, `/`\n- `if`/`elif`/`else` - Checking conditions",
				},
				{
					type: "hint",
					severity: "success",
					content:
						"**Well done!** These are the building blocks of Python. You can now write your own programs!",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/12",
			courseId: "bmi-calculator",
			topics: ["Variablen", "Bedingungen"],
			solutionString: [
				"My BMI Calculator",
				"Category: Obese",
			],
			solutionCode: ["if bmi", "elif bmi", "else:"],
			starterCode: `# My BMI Calculator

print("My BMI Calculator")

# Change these values to test different BMI categories!
weight = 77
height = 1.79

print("Weight: " + str(weight))
print("Height: " + str(height))

bmi = weight / (height * height)

print("Your BMI: " + str(bmi))

category = None

if bmi < 18.5:
    category = "Underweight"
elif bmi < 25:
    category = "Normal weight"
elif bmi < 30:
    category = "Overweight"
else:
    category = "Obese"

print("Category: " + category)`,
			hasDrill: true,
		},
	],
};

export function getBmiCalculatorCourseTaskEn(step: number) {
	const task = bmiCalculatorCourseDataEn.tasks.find((task) => task.step === step);
	const path = `/pfade/bmi-calculator/${step}`;
	if (task) {
		return {
			...task,
			path,
			courseId: bmiCalculatorCourseDataEn.id,
		};
	}
	return null;
}
