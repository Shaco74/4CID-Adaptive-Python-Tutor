import { CourseData } from '@/types/courseTypes';

export const interestCalculatorCourseDataEn: CourseData = {
  id: "interest-calculator",
  title: "Interest Calculator",
  description: "Build a compound interest calculator for savings plans. You'll learn loops and lists for your programs.",
  tasks: [
    {
      id: "interest-calculator-step-1",
      step: 1,
      hasDrill: true,
      title: "f-Strings - The Modern Way to Output",
      description: "Learn f-strings - better than str() + \"+\".",
      blocks: [
        {
          type: "text",
          content: "Welcome to the Interest Calculator project! Here you'll develop a program that calculates how your money grows over multiple years with interest.\n\n**In this course you'll learn:**\n\n📌 **f-Strings** - Output variables more easily than with `str() + \"+\"`\n\n📌 **for-loops** - Automatically repeat code\n\n📌 **Lists** - Store multiple values\n\nWe'll start with f-strings. You already know `print()`, variables and `str() + \"+\"` from the BMI calculator. f-Strings are a simpler alternative that you can use from now on."
        },
        {
          type: "hint",
          severity: "success",
          content: "**💡 Why f-strings are better:**\n\n✅ **With f-strings (modern):**\n```python\nprint(f\"BMI: {bmi}\")\n```\n\n❌ **With str() + \"+\" (cumbersome):**\n```python\nprint(\"BMI: \" + str(bmi))\n```\n\nf-Strings are **shorter, more readable** and you **don't need str()** anymore!"
        },
        {
          type: "code",
          title: "f-Strings Syntax",
          language: "python",
          content: `# f before the string, variables in curly braces {}
amount = 1000
print(f"Money: {amount}€")  # Money: 1000€

# Insert multiple variables
name = "Max"
age = 25
print(f"{name} is {age} years old")  # Max is 25 years old`
        },
        {
          type: "hint",
          severity: "warning",
          content: "**⚠️ Common mistake:**\n\n❌ **Don't forget the `f`!**\n```python\nprint(\"Amount: {amount}€\")  # Wrong - outputs {amount}€\n```\n\n✅ **With f it works:**\n```python\nprint(f\"Amount: {amount}€\")  # Correct - outputs 1000€\n```"
        },
        {
          type: "task",
          content: "Create variables for `initial` (starting capital: 1000) and `rate` (interest rate: 5). Output both with f-strings:\n\n- `Starting capital: 1000€`\n- `Interest rate: 5%`"
        },
        {
          type: "hint",
          severity: "info",
          content: "**Tip:** Write the € and % symbols directly in the string, e.g. `f\"Value: {variable}€\"`"
        }
      ],
      showHints: true,
      path: "/pfade/interest-calculator/1",
      courseId: "interest-calculator",
      topics: ["Strings", "Variablen"],
      solutionString: ["My Interest Calculator", "Starting capital: 1000€", "Interest rate: 5%"],
      starterCode: `# My Interest Calculator

print("My Interest Calculator")

# Create the variables initial and rate here

# Output them with f-strings to the console`
    },
    {
      id: "interest-calculator-step-2",
      hasDrill: true,
      step: 2,
      title: "Percentage Calculation - Calculate Interest for 1 Year",
      description: "Calculate how much money you have after one year.",
      blocks: [
        {
          type: "text",
          content: "Now we calculate the interest! If you invest 1000€ with 5% interest, you get **50€ interest** added after one year. That makes **1050€** in total."
        },
        {
          type: "hint",
          severity: "info",
          content: "**📐 The interest formula:**\n\n```python\nnew_amount = old_amount * (1 + interest_rate/100)\n```\n\n**Example:** 1000€ with 5% interest\n```python\nnew_amount = 1000 * (1 + 5/100)\n           = 1000 * (1 + 0.05)\n           = 1000 * 1.05\n           = 1050€\n```"
        },
        {
          type: "code",
          title: "Percentage Calculation in Python",
          language: "python",
          content: `# Percentages in Python
price = 100
discount = 20  # 20% discount

# 20% discount = price × (1 - 20/100)
new_price = price * (1 - discount/100)
print(f"Price after discount: {new_price}€")  # 80€

# For interest we add instead of subtract:
# 5% interest = amount × (1 + 5/100)`
        },
        {
          type: "task",
          content: "Calculate the amount after one year:\n\n1. Create a variable `amount_after_1_year` with the interest formula\n2. Output the result: `After 1 year: 1050.0€`"
        },
        {
          type: "hint",
          severity: "info",
          content: "**Tip:** The formula is `initial * (1 + rate/100)`. The result should be 1050.0."
        }
      ],
      showHints: true,
      path: "/pfade/interest-calculator/2",
      courseId: "interest-calculator",
      topics: ["Variablen", "Datentypen"],
      solutionString: ["My Interest Calculator", "Starting capital: 1000€", "Interest rate: 5%", "After 1 year: 1050.0€"],
      starterCode: `# My Interest Calculator

print("My Interest Calculator")

initial = 1000
rate = 5

print(f"Starting capital: {initial}€")
print(f"Interest rate: {rate}%")

# Calculate the amount after 1 year here

# Output the result to the console`
    },
    {
      id: "interest-calculator-step-3",
      step: 3,
      hasDrill: true,
      title: "for-Loops - Automatically Repeat Code",
      description: "NEW CONCEPT: Repeat code automatically with for-loops!",
      blocks: [
        {
          type: "text",
          content: "**NEW CONCEPT: for-loops**\n\nfor-loops are a core concept of programming. They allow you to automatically repeat code blocks (\"iterate\")."
        },
        {
          type: "hint",
          severity: "info",
          content: "**The problem:** You want to output 100 numbers.\n\n```python\n# Without loop (extremely tedious)\nprint(\"Number: 1\")\nprint(\"Number: 2\")\nprint(\"Number: 3\")\n# ...up to 100...\n```\n\nYou don't have time for 100 lines! There must be a better way..."
        },
        {
          type: "text",
          content: "**The solution: for-loop**\n\nWith a for-loop you write the code only once and let Python repeat it automatically:"
        },
        {
          type: "code",
          title: "for-loop Example",
          language: "python",
          content: `# With loop (efficient)
for number in range(1, 101):
    print(f"Number: {number}")

# That's it! Python now outputs all numbers from 1-100.`
        },
        {
          type: "text",
          content: "**The for-loop syntax**\n\nA for-loop has a **header** (how many times?) and a **body** (what?)."
        },
        {
          type: "code",
          title: "Syntax Explained",
          language: "python",
          content: `#   HEADER (Defines the repetition)
#   |-----------------------------|
for loop_variable in range(1, 4):
    # BODY (must be indented)
    print(f"Current value: {loop_variable}")

# Output:
# Current value: 1
# Current value: 2
# Current value: 3`
        },
        {
          type: "text",
          content: "**The components explained:**"
        },
        {
          type: "hint",
          severity: "info",
          content: "**loop_variable**\n\nA name you choose. It changes its value in each iteration.\n\nExamples: `number`, `i`, `year`"
        },
        {
          type: "hint",
          severity: "info",
          content: "**range(1, 4)**\n\nProvides the sequence of numbers to iterate over."
        },
        {
          type: "hint",
          severity: "info",
          content: "**: (colon)**\n\nEnds the loop header."
        },
        {
          type: "hint",
          severity: "info",
          content: "**Indentation (body)**\n\nThe code to be repeated must be indented (4 spaces or 1 TAB)."
        },
        {
          type: "code",
          title: "Indentation is important!",
          language: "python",
          content: `for i in range(1, 3):
    print(f"Iteration {i}")  # Indented: Repeats

print("Done.")  # Not indented: Runs only once after

# Output:
# Iteration 1
# Iteration 2
# Done.`
        },
        {
          type: "hint",
          severity: "warning",
          content: "**⚠️ IMPORTANT: The stop value is exclusive!**\n\n`range()` counts **up to the stop number, but does NOT include it.**\n\n- `range(1, 4)` yields: **1, 2, 3** (Stops BEFORE 4)\n- `range(0, 3)` yields: **0, 1, 2** (Stops BEFORE 3)\n\n**Mnemonic:** If you want to count up to and including 3, you need `range(1, 4)`."
        },
        {
          type: "code",
          title: "range() Examples",
          language: "python",
          content: `# Different range() uses
for i in range(1, 4):
    print(i)  # 1, 2, 3

for i in range(1, 6):
    print(i)  # 1, 2, 3, 4, 5

for i in range(0, 3):
    print(i)  # 0, 1, 2`
        },
        {
          type: "text",
          content: "**🚀 Your task**\n\nWrite a for-loop that outputs `Year 1`, `Year 2` and `Year 3`.\n\n- Use a meaningfully named loop variable (think: what's it about?)\n- You already have the variable `years = 3` in the starter code"
        },
        {
          type: "hint",
          severity: "info",
          content: "**💡 Flexible code with variables**\n\nYou can also feed `range()` with variables:\n\n```python\nyears = 3\n# Your code here:\n# How do you use \"years\" in range()\n# to get the numbers 1, 2 and 3?\n# Remember: range(1, 4) gives 1, 2, 3.\n```\n\nWhat number must be in `range(1, ?)` if `years = 3`?"
        }
      ],
      showHints: true,
      path: "/pfade/interest-calculator/3",
      courseId: "interest-calculator",
      topics: ["Schleifen"],
      solutionString: ["My Interest Calculator", "Starting capital: 1000€", "Interest rate: 5%", "Year 1", "Year 2", "Year 3"],
      starterCode: `# My Interest Calculator

print("My Interest Calculator")

initial = 1000
rate = 5
years = 3

print(f"Starting capital: {initial}€")
print(f"Interest rate: {rate}%")

# This was the solution for Step 2 (for 1 year):
amount_after_1_year = initial * (1 + rate/100)
print(f"After 1 year: {amount_after_1_year}€")

# Now we extend this with a for-loop for multiple years:
# Use a for-loop here`
    },
    {
      id: "interest-calculator-step-4",
      hasDrill: true,
      step: 4,
      title: "Compound Interest Effect - Using Loops for Calculations",
      description: "Calculate interest for multiple years automatically!",
      blocks: [
        {
          type: "text",
          content: "Now we combine for-loops with interest calculation! This way we can automatically calculate for 3, 10 or 100 years. This is the **compound interest effect**: interest is calculated on interest!"
        },
        {
          type: "hint",
          severity: "info",
          content: "**💰 Compound Interest Effect:**\n\n- **Year 1:** 1000€ + 5% = **1050€**\n- **Year 2:** 1050€ + 5% = **1102.50€** (Interest on the 1050€!)\n- **Year 3:** 1102.50€ + 5% = **1157.63€**\n\nThe interest is calculated each year **on the new amount**, not on the original amount!"
        },
        {
          type: "code",
          title: "Compound Interest in a Loop",
          language: "python",
          content: `# Example: 1000€ with 10% interest over 3 years
capital = 1000

for year in range(1, 4):
    capital = capital * 1.10  # +10% on current capital
    print(f\"Year {year}: {capital}€\")

# Year 1: 1100€
# Year 2: 1210€ (10% of 1100€)
# Year 3: 1331€ (10% of 1210€)`
        },
        {
          type: "hint",
          severity: "warning",
          content: "**⚠️ Important: Update the variable!**\n\n```python\ncapital = capital * 1.10\n```\n\nThis means: **Take the old value**, multiply it, **store the result back in capital**.\n\nThis way the amount grows each year!"
        },
        {
          type: "task",
          content: "Calculate the compound interest for 3 years:\n\n1. Create a variable `amount` with the value of `initial`\n2. Use a for-loop for 3 years\n3. In the loop: Multiply `amount` by `(1 + rate/100)` and store it back in `amount`\n4. Output each year: `Year 1: 1050.0€`, `Year 2: 1102.5€`, `Year 3: 1157.625€`"
        }
      ],
      showHints: true,
      path: "/pfade/interest-calculator/4",
      courseId: "interest-calculator",
      topics: ["Schleifen", "Variablen"],
      solutionString: ["My Interest Calculator", "Starting capital: 1000€", "Interest rate: 5%", "Year 1: 1050.0€", "Year 2: 1102.5€", "Year 3: 1157.625€"],
      starterCode: `# My Interest Calculator

print("My Interest Calculator")

initial = 1000
rate = 5
years = 3

print(f"Starting capital: {initial}€")
print(f"Interest rate: {rate}%")

# This was the solution for Step 3 (output years):
# for year in range(1, years + 1):
#     print(f"Year {year}")

# Now we extend it: Calculate compound interest in the loop!
# Create amount variable here

# Use for-loop for compound interest calculation`
    },
    {
      id: "interest-calculator-step-5",
      step: 5,
      hasDrill: true,
      title: "Lists - Store Multiple Values",
      description: "NEW CONCEPT: Store multiple values in a list!",
      blocks: [
        {
          type: "text",
          content: "**NEW CONCEPT:** Lists! Until now variables stored only **one value**. Lists can store **many values** - perfect for our interest history!"
        },
        {
          type: "hint",
          severity: "success",
          content: "**💡 Why Lists?**\n\n❌ **Without lists (3 years):**\n```python\nyear1 = 1050.0\nyear2 = 1102.5\nyear3 = 1157.625\n```\nFor 100 years? Impossible!\n\n✅ **With lists:**\n```python\nhistory = [1050.0, 1102.5, 1157.625]\n```\nAll values in one place!"
        },
        {
          type: "code",
          title: "List Basics",
          language: "python",
          content: `# Create an empty list
my_list = []
print(my_list)  # []

# Add values with .append()
my_list.append(10)
print(my_list)  # [10]

my_list.append(20)
print(my_list)  # [10, 20]

my_list.append(30)
print(my_list)  # [10, 20, 30]`
        },
        {
          type: "hint",
          severity: "info",
          content: "**📝 .append() method:**\n\n```python\nlist.append(value)\n```\n\n- Adds `value` **at the end** of the list\n- The list grows automatically\n- You can add as many values as you want"
        },
        {
          type: "code",
          title: "Lists with Different Data",
          language: "python",
          content: `# Lists can also store text
fruits = []
fruits.append(\"Apple\")
fruits.append(\"Banana\")
print(fruits)  # [\"Apple\", \"Banana\"]

# Or numbers
numbers = []
numbers.append(5)
numbers.append(10)
numbers.append(15)
print(numbers)  # [5, 10, 15]`
        },
        {
          type: "text",
          content: "**🚀 Your task**\n\nCreate an empty list `amount` and manually add three money amounts:\n\n1. 1050.0 (Year 1)\n2. 1102.5 (Year 2)\n3. 1157.625 (Year 3)\n\nOutput the list after each `.append()` with the following format:\n- `After Year 1: [1050.0]`\n- `After Year 2: [1050.0, 1102.5]`\n- `After Year 3: [1050.0, 1102.5, 1157.625]`"
        },
        {
          type: "hint",
          severity: "info",
          content: "**💡 Tip for output:**\n\n```python\namount.append(1050.0)\nprint(f\"After Year 1: {amount}\")\n```\n\nThe f-string with `{amount}` outputs the complete list!"
        }
      ],
      showHints: true,
      path: "/pfade/interest-calculator/5",
      courseId: "interest-calculator",
      topics: ["Listen"],
      solutionString: ["My Interest Calculator", "After Year 1: [1050.0]", "After Year 2: [1050.0, 1102.5]", "After Year 3: [1050.0, 1102.5, 1157.625]"],
      starterCode: `# My Interest Calculator

print("My Interest Calculator")

# This was your solution from Step 4 (compound interest calculation):
# initial = 1000
# rate = 5
# years = 3
# amount = initial
# for year in range(1, years + 1):
#     amount = amount * (1 + rate/100)
#     print(f"Year {year}: {amount}€")

# Now you learn lists - store the amounts!
# Create an empty list amount

# Add the three amounts MANUALLY (1050.0, 1102.5, 1157.625)
# Output to console after each .append(): "After Year 1: [...]", "After Year 2: [...]", etc.`
    },
    {
      id: "interest-calculator-step-6",
      hasDrill: true,
      step: 6,
      title: "Loops + Lists - Automatically Save History",
      description: "Combine for-loops with lists!",
      blocks: [
        {
          type: "text",
          content: "Now we combine for-loops with lists! Instead of manually adding each amount, the loop does it automatically."
        },
        {
          type: "code",
          title: "Filling Lists in Loops",
          language: "python",
          content: `# Fill list in loop
results = []

for i in range(1, 4):
    value = i * 10  # 10, 20, 30
    results.append(value)
    print(f\"Year {i}: {value}\")

print(f\"All values: {results}\")
# All values: [10, 20, 30]`
        },
        {
          type: "hint",
          severity: "info",
          content: "**Process:**\n\n1. Loop runs through years 1, 2, 3\n2. **In each iteration:**\n   - Calculate new amount\n   - Add it to the list with `.append()`\n   - Output it\n3. At the end you have all values in the list!"
        },
        {
          type: "text",
          content: "**🚀 Your task**\n\nExtend your compound interest calculation with a `history` list:\n\n1. Create an empty list `history = []` BEFORE the loop\n2. In the loop: After the calculation add `amount` to the list with `history.append(amount)`\n3. After the loop: Output the complete `history` with `print(history)`\n\n**Expected output:**\n```\nMy Interest Calculator\nStarting capital: 1000€\nInterest rate: 5%\n[1050.0, 1102.5, 1157.625]\n```"
        },
        {
          type: "hint",
          severity: "info",
          content: "**💡 Tip:** The `.append()` line must be **inside the loop**, directly after `amount` is calculated."
        }
      ],
      showHints: true,
      path: "/pfade/interest-calculator/6",
      courseId: "interest-calculator",
      topics: ["Schleifen", "Listen"],
      solutionString: ["My Interest Calculator", "Starting capital: 1000€", "Interest rate: 5%", "[1050.0, 1102.5, 1157.625]"],
      starterCode: `# My Interest Calculator

print("My Interest Calculator")

initial = 1000
rate = 5
years = 3

print(f"Starting capital: {initial}€")
print(f"Interest rate: {rate}%")

# TODO: Create an empty list "history" here

# This is your working solution from Step 4:
amount = initial
for year in range(1, years + 1):
    amount = amount * (1 + rate/100)
    # TODO: Add "amount" to the "history" list here

# TODO: Output the "history" list`
    },
    {
      id: "interest-calculator-step-7",
      step: 7,
      hasDrill: true,
      title: "if/elif - Categorize Profit",
      description: "Review: Use if/elif for categories!",
      blocks: [
        {
          type: "text",
          content: "**Review: if/elif Categorization**\n\nYou already know if/elif from the BMI calculator! There you classified BMI values into categories. Now we use the same concept for profit categories."
        },
        {
          type: "hint",
          severity: "info",
          content: "**🔄 Known Concept - New Application:**\n\nBMI Calculator:\n```python\nif bmi < 18.5:\n    category = \"Underweight\"\nelif bmi < 25:\n    category = \"Normal weight\"\n````"
        },
        {
          type: "text",
          content: "**The Profit Categories:**\n\n- **< 10%** → Low Profit\n- **10% - 20%** → Medium Profit  \n- **> 20%** → High Profit\n\nWith 5% interest over 3 years you achieve about 15.8% profit → That would be **Medium Profit**!"
        },
        {
          type: "text",
          content: "**Step 1: Calculate Profit**\n\nFirst you need two values:\n- `profit` = absolute profit in euros (final amount minus starting capital)\n- `percent_gain` = percentage profit"
        },
        {
          type: "hint",
          severity: "info",
          content: "**💡 The formula for percentage profit:**\n\n```python\npercent_gain = (profit / initial) * 100\n```\n\nExample: 157.63€ profit from 1000€ starting capital:\n```python\npercent_gain = (157.63 / 1000) * 100  # = 15.763%\n```"
        },
        {
          type: "text",
          content: "**Step 2: Format Numbers**\n\nWant nicely formatted output? Use f-string formatting:\n- `{amount:.2f}` → Rounds to 2 decimal places (e.g. 1157.63)\n- `{percent_gain:.1f}` → Rounds to 1 decimal place (e.g. 15.8)"
        },
        {
          type: "code",
          title: "Formatting Numbers",
          language: "python",
          content: `# Example: Rounding numbers in f-strings
amount = 1157.625
percent = 15.763

print(f"Amount: {amount:.2f}€")      # Amount: 1157.63€
print(f"Percent: {percent:.1f}%")    # Percent: 15.8%

# General: {variable:.Xf} where X = number of decimal places`
        },
        {
          type: "text",
          content: "**🚀 Your task**\n\n1. Calculate `profit` (Tip: final amount minus starting capital)\n2. Calculate `percent_gain` with the formula above\n3. Use if/elif/else to set a `rating` variable (just like in the BMI calculator!)\n4. Output the following:\n\n```\nFinal amount: 1157.62€\nProfit: 157.62€ (15.8%)\nRating: Medium Profit\n```\n\n**Note:** Use `.2f` for euro amounts and `.1f` for percentages!"
        },
      ],
      showHints: true,
      path: "/pfade/interest-calculator/7",
      courseId: "interest-calculator",
      topics: ["Bedingungen", "Variablen"],
      solutionString: ["My Interest Calculator", "Starting capital: 1000€", "Interest rate: 5%", "Final amount: 1157.62€", "Profit: 157.62€ (15.8%)", "Rating: Medium Profit"],
      starterCode: `# My Interest Calculator

print("My Interest Calculator")

initial = 1000
rate = 5
years = 3

print(f"Starting capital: {initial}€")
print(f"Interest rate: {rate}%")

# This is your working solution from Step 6:
amount = initial
history = []

for year in range(1, years + 1):
    amount = amount * (1 + rate/100)
    history.append(amount)

# Calculate profit and percent_gain

# Use if/elif/else for the rating

# Output final amount, profit and rating to the console
`
    },
    {
      id: "interest-calculator-step-8",
      hasDrill: true,
      step: 8,
      title: "Free Experimentation - Simulate Different Scenarios",
      description: "Use your complete program for your own calculations!",
      blocks: [
        {
          type: "text",
          content: "**🎉 Congratulations!** You've learned all the important concepts:\n\n✅ **f-Strings** - Modern output\n✅ **for-loops** - Automatically repeat code\n✅ **Lists** - Store multiple values\n✅ **if/elif** - Check conditions\n\nNow you can use your program for real calculations!"
        },
        {
          type: "text",
          content: "**🚀 Your task: Simulate a larger savings plan!**\n\nImagine: You save **10,000€** with **10% interest** over **12 years**.\n\nChange the values in the code and find out:\n- How high is the final amount?\n- How high is the percentage profit?\n- What rating do you get? (High Profit!)"
        },
        {
          type: "hint",
          severity: "success",
          content: "**💡 Experimentation ideas:**\n\nTry different scenarios:\n- 🏦 Long-term saving: 5000€, 3%, 20 years\n- 📈 High risk: 2000€, 15%, 5 years\n- 💰 Conservative: 10000€, 2%, 10 years\n\nJust change the values `initial`, `rate` and `years`!"
        },
        {
          type: "hint",
          severity: "info",
          content: "**📊 Observe the compound interest effect:**\n\nWatch how the profit grows over the years!\n\nWith 10% interest over 12 years your money almost triples - that's the power of compound interest!"
        }
      ],
      showHints: true,
      path: "/pfade/interest-calculator/8",
      courseId: "interest-calculator",
      topics: ["Variablen", "Schleifen", "Listen", "Bedingungen"],
      solutionString: ["My Interest Calculator", "Starting capital: 10000€", "Interest rate: 10%", "Final amount: 31384.28€", "Profit: 21384.28€ (213.8%)", "Rating: High Profit"],
      starterCode: `# My Interest Calculator

print("My Interest Calculator")

# TODO: Change these values for your simulation!
initial = 1000
rate = 5
years = 3

print(f"Starting capital: {initial}€")
print(f"Interest rate: {rate}%")

# Your complete working code:
amount = initial
history = []

for year in range(1, years + 1):
    amount = amount * (1 + rate/100)
    history.append(amount)

profit = amount - initial
percent_gain = (profit / initial) * 100

rating = ""
if percent_gain < 10:
    rating = "Low Profit"
elif percent_gain <= 20:
    rating = "Medium Profit"
else:
    rating = "High Profit"

print(f"Final amount: {amount:.2f}€")
print(f"Profit: {profit:.2f}€ ({percent_gain:.1f}%)")
print(f"Rating: {rating}")
`    }
  ]
};

export function getInterestCalculatorCourseTaskEn(step: number) {
  const task = interestCalculatorCourseDataEn.tasks.find(task => task.step === step);
  const path = `/pfade/interest-calculator/${step}`;
  if (task) {
    return {
      ...task,
      path,
      courseId: interestCalculatorCourseDataEn.id
    };
  }
  return null;
}
