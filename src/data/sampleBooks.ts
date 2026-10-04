import { Book, UserStats, Chapter, QuestionItem, Flashcard } from '../types';

// Helper to generate rich Python Chapter 2 Question Bank
const pyCh2Questions: QuestionItem[] = [
  {
    id: 'py2-q1',
    chapterId: 'py-ch-2',
    chapterTitle: 'Variables and Data Types',
    question: 'Which built-in Python data type is used to store arbitrary-precision whole integers?',
    questionType: 'mcq',
    difficulty: 'easy',
    options: ['A. float', 'B. int', 'C. long', 'D. number'],
    correctAnswerIndex: 1,
    explanation: 'Python 3 unified `int` and `long` into a single `int` type with arbitrary precision, meaning it never overflows fixed 32/64-bit bounds (Page 42).',
    topic: 'Data Types',
    sourceSection: 'Section 2.1 — Numeric Primitives',
    pageNumber: 42
  },
  {
    id: 'py2-q2',
    chapterId: 'py-ch-2',
    chapterTitle: 'Variables and Data Types',
    question: 'True or False: In Python, string objects (`str`) are mutable and can be modified in-place using index assignment like `s[0] = "A"`.',
    questionType: 'true-false',
    difficulty: 'easy',
    options: ['A. True', 'B. False'],
    correctAnswerIndex: 1,
    explanation: 'False. Strings in Python are strictly immutable. Any attempt to modify a character in-place raises a `TypeError` (Page 48).',
    topic: 'Mutability',
    sourceSection: 'Section 2.3 — String Immutability',
    pageNumber: 48
  },
  {
    id: 'py2-q3',
    chapterId: 'py-ch-2',
    chapterTitle: 'Variables and Data Types',
    question: 'What is the fundamental difference between the `==` operator and the `is` operator in Python?',
    questionType: 'mcq',
    difficulty: 'medium',
    options: [
      'A. `==` checks value equality, while `is` checks memory address identity (same object)',
      'B. `==` checks identity, while `is` converts types automatically',
      'C. `==` is reserved for numbers, while `is` is for strings and tuples',
      'D. There is no difference; they are exact aliases in CPython'
    ],
    correctAnswerIndex: 0,
    explanation: '`==` invokes `__eq__` to compare logical values, whereas `is` compares memory addresses `id(a) == id(b)` (Page 52).',
    topic: 'Operators & Identity',
    sourceSection: 'Section 2.4 — Memory Identity vs Equality',
    pageNumber: 52
  },
  {
    id: 'py2-q4',
    chapterId: 'py-ch-2',
    chapterTitle: 'Variables and Data Types',
    question: 'Which of the following data structures in Python is MUTABLE?',
    questionType: 'mcq',
    difficulty: 'easy',
    options: ['A. tuple', 'B. frozenset', 'C. list', 'D. str'],
    correctAnswerIndex: 2,
    explanation: 'Lists can be mutated in place via `.append()`, `.extend()`, and slice assignment. Tuples, strings, and frozensets are immutable (Page 56).',
    topic: 'Mutability',
    sourceSection: 'Section 2.5 — Mutable vs Immutable Collections',
    pageNumber: 56
  },
  {
    id: 'py2-q5',
    chapterId: 'py-ch-2',
    chapterTitle: 'Variables and Data Types',
    question: 'What will the expression `bool("False")` evaluate to in Python?',
    questionType: 'mcq',
    difficulty: 'medium',
    options: ['A. False', 'B. True', 'C. None', 'D. Raises ValueError'],
    correctAnswerIndex: 1,
    explanation: 'In Python, all non-empty strings have truthy value `True`. Only the empty string `""` evaluates to `False` in boolean coercion (Page 60).',
    topic: 'Type Coercion',
    sourceSection: 'Section 2.6 — Truth Value Testing',
    pageNumber: 60
  },
  {
    id: 'py2-q6',
    chapterId: 'py-ch-2',
    chapterTitle: 'Variables and Data Types',
    question: 'What singleton object in Python is used to signify the intentional absence of a return value or empty state?',
    questionType: 'fill-blank',
    difficulty: 'easy',
    options: ['A. None', 'B. null', 'C. undefined', 'D. void'],
    correctAnswerIndex: 0,
    correctAnswerText: 'None',
    explanation: '`None` is the sole instance of `NoneType` and is returned by functions that finish without an explicit return statement (Page 64).',
    topic: 'Data Types',
    sourceSection: 'Section 2.7 — The NoneType Singleton',
    pageNumber: 64
  },
  {
    id: 'py2-q7',
    chapterId: 'py-ch-2',
    chapterTitle: 'Variables and Data Types',
    question: 'True or False: Floating point numbers in Python implement standard IEEE 754 double precision (64-bit).',
    questionType: 'true-false',
    difficulty: 'medium',
    options: ['A. True', 'B. False'],
    correctAnswerIndex: 0,
    explanation: 'True. Python `float` is implemented under the hood as C `double` (IEEE 754 64-bit float representation) (Page 44).',
    topic: 'Data Types',
    sourceSection: 'Section 2.1 — Floats and Precision',
    pageNumber: 44
  },
  {
    id: 'py2-q8',
    chapterId: 'py-ch-2',
    chapterTitle: 'Variables and Data Types',
    question: 'What will `type((42,))` return in Python?',
    questionType: 'mcq',
    difficulty: 'hard',
    options: [
      'A. <class \'int\'>',
      'B. <class \'tuple\'>',
      'C. <class \'list\'>',
      'D. <class \'set\'>'
    ],
    correctAnswerIndex: 1,
    explanation: 'The trailing comma creates a single-element tuple `<class \'tuple\'>`. Without the comma, `(42)` is simply a parenthesized integer (Page 68).',
    topic: 'Tuples',
    sourceSection: 'Section 2.8 — Tuple Syntax and Comma Operators',
    pageNumber: 68
  },
  {
    id: 'py2-q9',
    chapterId: 'py-ch-2',
    chapterTitle: 'Variables and Data Types',
    question: 'Which method should be used to test if variable `x` is an instance of `int` or any subclass of `int`?',
    questionType: 'mcq',
    difficulty: 'medium',
    options: [
      'A. type(x) == int',
      'B. isinstance(x, int)',
      'C. x.type() == "int"',
      'D. x.__name__ == "int"'
    ],
    correctAnswerIndex: 1,
    explanation: '`isinstance()` is inheritance-aware and checks subclass relations, making it safer than direct `type()` equality (Page 72).',
    topic: 'Type Checking',
    sourceSection: 'Section 2.9 — Safe Type Inspection',
    pageNumber: 72
  },
  {
    id: 'py2-q10',
    chapterId: 'py-ch-2',
    chapterTitle: 'Variables and Data Types',
    question: 'What is the result of `int(3.99)` in Python?',
    questionType: 'mcq',
    difficulty: 'easy',
    options: ['A. 4', 'B. 3', 'C. 3.0', 'D. Raises TypeError'],
    correctAnswerIndex: 1,
    explanation: '`int()` truncates fractional digits towards zero, discarding `.99` to produce integer `3` (Page 46).',
    topic: 'Type Casting',
    sourceSection: 'Section 2.2 — Type Conversion',
    pageNumber: 46
  },
  {
    id: 'py2-q11',
    chapterId: 'py-ch-2',
    chapterTitle: 'Variables and Data Types',
    question: 'True or False: Python variables store raw binary values directly in memory registers without heap object allocation.',
    questionType: 'true-false',
    difficulty: 'hard',
    options: ['A. True', 'B. False'],
    correctAnswerIndex: 1,
    explanation: 'False. Everything in Python is an object allocated on the heap; variables are pointers/name tags referencing those objects (Page 38).',
    topic: 'Memory Model',
    sourceSection: 'Section 2.0 — Python Memory Model',
    pageNumber: 38
  },
  {
    id: 'py2-q12',
    chapterId: 'py-ch-2',
    chapterTitle: 'Variables and Data Types',
    question: 'In Python 3.6+, what string prefix is used for Formatted String Literals with inline interpolation?',
    questionType: 'fill-blank',
    difficulty: 'easy',
    options: ['A. f', 'B. r', 'C. b', 'D. u'],
    correctAnswerIndex: 0,
    correctAnswerText: 'f',
    explanation: 'F-strings (e.g. `f"Hello {name}"`) allow concise expression evaluation directly inside string literals (Page 50).',
    topic: 'Strings',
    sourceSection: 'Section 2.3 — F-Strings',
    pageNumber: 50
  }
];

// Helper to generate 20+ Python Chapter 2 Flashcards
const pyCh2Flashcards: Flashcard[] = [
  {
    id: 'py2-fc1',
    chapterId: 'py-ch-2',
    question: 'What is a variable in Python?',
    answer: 'A variable is a symbolic reference/label bound to an object allocated in heap memory, rather than a fixed memory register holding raw bytes directly.',
    category: 'Foundations',
    difficulty: 'easy',
    mastery: 'known',
    sourceSection: 'Section 2.0',
    pageNumber: 38
  },
  {
    id: 'py2-fc2',
    chapterId: 'py-ch-2',
    question: 'What is the difference between `==` and `is`?',
    answer: '`==` compares logical values for equality (invoking `__eq__`), while `is` compares memory address identity (`id(a) == id(b)`).',
    category: 'Operators',
    difficulty: 'medium',
    mastery: 'known',
    sourceSection: 'Section 2.4',
    pageNumber: 52
  },
  {
    id: 'py2-fc3',
    chapterId: 'py-ch-2',
    question: 'Which primitive data types in Python are immutable?',
    answer: 'Integers (`int`), Floats (`float`), Strings (`str`), Booleans (`bool`), and Tuples (`tuple`) are immutable.',
    category: 'Data Types',
    difficulty: 'easy',
    mastery: 'known',
    sourceSection: 'Section 2.2',
    pageNumber: 44
  },
  {
    id: 'py2-fc4',
    chapterId: 'py-ch-2',
    question: 'Why are Python strings immutable?',
    answer: 'Immutability allows strings to be cached, safely shared across threads without locks, and used as dictionary keys due to guaranteed stable hash values.',
    category: 'Strings',
    difficulty: 'medium',
    mastery: 'need-review',
    sourceSection: 'Section 2.3',
    pageNumber: 48
  },
  {
    id: 'py2-fc5',
    chapterId: 'py-ch-2',
    question: 'What does the `None` keyword represent?',
    answer: '`None` is a singleton object of type `NoneType` used to indicate the absence of a value or default empty parameter.',
    category: 'Data Types',
    difficulty: 'easy',
    mastery: 'known',
    sourceSection: 'Section 2.7',
    pageNumber: 64
  },
  {
    id: 'py2-fc6',
    chapterId: 'py-ch-2',
    question: 'How do you define a single-element tuple?',
    answer: 'Include a trailing comma: `x = (42,)`. Without the comma, Python parses parentheses as grouping arithmetic.',
    category: 'Tuples',
    difficulty: 'hard',
    mastery: 'need-review',
    sourceSection: 'Section 2.8',
    pageNumber: 68
  },
  {
    id: 'py2-fc7',
    chapterId: 'py-ch-2',
    question: 'What happens when `int("123")` is executed?',
    answer: 'It converts (casts) the string representation of digits into a native base-10 integer `123`.',
    category: 'Type Casting',
    difficulty: 'easy',
    mastery: 'known',
    sourceSection: 'Section 2.2',
    pageNumber: 46
  },
  {
    id: 'py2-fc8',
    chapterId: 'py-ch-2',
    question: 'What is Dynamic Typing in Python?',
    answer: 'Variables do not require explicit type declarations; the interpreter determines and associates types with runtime heap objects dynamically.',
    category: 'Foundations',
    difficulty: 'easy',
    mastery: 'known',
    sourceSection: 'Section 2.0',
    pageNumber: 40
  },
  {
    id: 'py2-fc9',
    chapterId: 'py-ch-2',
    question: 'What is Strong Typing in Python?',
    answer: 'Types are strictly enforced at runtime. Python will not perform unexpected silent coercion (e.g. `"5" + 5` raises `TypeError`).',
    category: 'Foundations',
    difficulty: 'medium',
    mastery: 'need-review',
    sourceSection: 'Section 2.0',
    pageNumber: 40
  },
  {
    id: 'py2-fc10',
    chapterId: 'py-ch-2',
    question: 'What is an F-String in Python?',
    answer: 'A Formatted String Literal prefixed with `f` or `F` that allows embedded Python expressions inside curly braces `{expr}`.',
    category: 'Strings',
    difficulty: 'easy',
    mastery: 'known',
    sourceSection: 'Section 2.3',
    pageNumber: 50
  },
  {
    id: 'py2-fc11',
    chapterId: 'py-ch-2',
    question: 'How does Python handle integer overflow?',
    answer: 'Python 3 integers have arbitrary precision and dynamically allocate memory to hold arbitrarily large numbers without 64-bit overflow.',
    category: 'Data Types',
    difficulty: 'medium',
    mastery: 'known',
    sourceSection: 'Section 2.1',
    pageNumber: 42
  },
  {
    id: 'py2-fc12',
    chapterId: 'py-ch-2',
    question: 'What function is used to inspect an object’s memory address?',
    answer: '`id(obj)` returns the integer representing the identity/memory address of the object in CPython.',
    category: 'Memory Model',
    difficulty: 'hard',
    mastery: 'need-review',
    sourceSection: 'Section 2.4',
    pageNumber: 52
  }
];

export const initialBooks: Book[] = [
  {
    id: 'python-programming',
    title: 'Python Programming: Modern Fundamentals',
    author: 'Prof. David M. Beazley',
    fileType: 'PDF',
    fileSize: '14.2 MB',
    pages: 320,
    chaptersCount: 12,
    topicsCount: 48,
    conceptsCount: 180,
    quizQuestionsCount: 240,
    progress: 68,
    lastStudied: 'Today, 2:15 PM',
    coverGradient: 'bg-slate-900',
    badge: 'Core Computer Science',
    weakTopics: ['Loops & Iterators', 'Functions & Variable Scope'],
    strongTopics: ['Variables and Data Types', 'Operators & Boolean Logic', 'Conditional Logic'],
    chapters: [
      {
        id: 'py-ch-1',
        number: 1,
        title: 'Introduction to Python & Setup',
        readTime: '12 min',
        progress: 100,
        pageRange: 'pp. 1–36',
        learningObjectives: [
          'Understand Python bytecode compilation and CPython Virtual Machine',
          'Configure environment, REPL, and PEP 8 standards',
          'Execute scripts with proper entrypoint boilerplate'
        ],
        summary: {
          whatYouWillLearn: [
            'CPython bytecode generation and PVM architecture',
            'Differences between interactive REPL and script files',
            'PEP 8 naming standards and indentation rules'
          ],
          overview: 'Python is a high-level interpreted programming language designed for readability. CPython compiles .py text into platform-independent bytecode evaluated by the Python Virtual Machine (PVM).',
          sections: [
            {
              heading: '1. Architecture & Execution',
              content: 'Python scripts are parsed into an Abstract Syntax Tree (AST), compiled to bytecode (.pyc), and evaluated inside the PVM runtime.',
              bulletPoints: ['Automatic reference counting with cyclic garbage collection', 'Dynamic type evaluation at runtime']
            }
          ],
          keyTakeaways: [
            'Indentation (4 spaces) defines code blocks instead of braces.',
            'Everything in Python is a first-class object.'
          ],
          snippets: [
            {
              title: 'Standard Entry Point',
              language: 'python',
              code: 'def main():\n    print("EduSphere AI: Environment Verified")\n\nif __name__ == "__main__":\n    main()',
              explanation: 'Guarantees code only executes when run directly as a script.'
            }
          ]
        },
        keyConcepts: [
          {
            id: 'c1-1',
            term: 'CPython & PVM',
            definition: 'The reference implementation of Python that compiles source code to bytecode and executes it on the Python Virtual Machine.',
            importance: 'foundational',
            pageNumber: 12
          }
        ],
        flashcards: [
          {
            id: 'fc-1-1',
            chapterId: 'py-ch-1',
            question: 'What is Python Bytecode (.pyc)?',
            answer: 'An intermediate, platform-independent instruction set that the CPython Virtual Machine executes efficiently without re-parsing source text.',
            category: 'Architecture',
            difficulty: 'easy',
            mastery: 'known',
            sourceSection: 'Section 1.2',
            pageNumber: 14
          }
        ],
        questionBank: [
          {
            id: 'qb-1-1',
            chapterId: 'py-ch-1',
            chapterTitle: 'Introduction to Python & Setup',
            question: 'What happens when a Python script is executed by CPython?',
            questionType: 'mcq',
            difficulty: 'easy',
            options: [
              'A. It is converted directly into x86 machine binary',
              'B. It is compiled to bytecode and evaluated by the PVM',
              'C. It is executed line-by-line without any bytecode step',
              'D. It requires an external JVM runtime'
            ],
            correctAnswerIndex: 1,
            explanation: 'CPython compiles source code into bytecode (.pyc) which is evaluated by the PVM (Page 14).',
            topic: 'Architecture',
            sourceSection: 'Section 1.2',
            pageNumber: 14
          }
        ]
      },
      {
        id: 'py-ch-2',
        number: 2,
        title: 'Variables and Data Types',
        readTime: '18 min',
        progress: 100,
        pageRange: 'pp. 37–76',
        learningObjectives: [
          'Master Python primitive data types: int, float, str, bool, and NoneType',
          'Understand dynamic typing, heap allocation, and pointer references',
          'Distinguish between mutable and immutable memory objects',
          'Perform safe type conversions and string formatting'
        ],
        summary: {
          whatYouWillLearn: [
            'How variables act as symbolic reference pointers to heap-allocated objects (pp. 38–41)',
            'Fundamental differences between immutable types (int, float, str, tuple) and mutable types (list, dict, set)',
            'Memory identity with id() and value equality with == vs is operator',
            'F-strings (formatted string literals) for concise, readable text interpolation'
          ],
          overview: 'In Python, variables do not hold raw binary values directly in memory registers; rather, they are symbolic name tags bound to objects on the heap. Python is dynamically and strongly typed: variables do not require explicit type declarations, but data types are strictly enforced at runtime.',
          sections: [
            {
              heading: '1. Numeric Primitives & Precision',
              content: 'Python integers have arbitrary precision and dynamically grow to prevent overflow. Floating-point numbers follow IEEE 754 double precision (64-bit).',
              bulletPoints: [
                'int: Arbitrary precision whole numbers (e.g. 2**1000 calculates cleanly).',
                'float: 64-bit IEEE 754 double precision with ~15-17 decimal digits of precision.',
                'complex: Built-in support for imaginary numbers (e.g. 3 + 4j).'
              ],
              formulasOrSteps: [
                'Conversion: int(3.99) -> 3 (truncates toward zero)',
                'Division: 7 / 2 -> 3.5 (float division), 7 // 2 -> 3 (floor division)'
              ]
            },
            {
              heading: '2. Immutability & Memory Identity',
              content: 'Immutable objects (strings, integers, tuples) cannot be altered in-place after instantiation. Modifying them creates a new distinct object in heap memory.',
              bulletPoints: [
                'The `==` operator compares logical values by invoking `__eq__`.',
                'The `is` operator verifies object identity by comparing memory addresses `id(a) == id(b)`.'
              ]
            },
            {
              heading: '3. String Formatting & Type Coercion',
              content: 'Modern Python utilizes F-strings for performance and readability. Boolean coercion treats empty collections and zero as False, while all non-empty structures evaluate to True.',
              formulasOrSteps: [
                'F-string syntax: f"User: {name.upper()}, GPA: {gpa:.2f}"',
                'Truth value testing: bool("") is False; bool("False") is True'
              ]
            }
          ],
          keyTakeaways: [
            'Integers in Python 3 have arbitrary precision and will not overflow 32/64-bit limits.',
            'Strings and tuples are immutable; modifying them creates a new object in memory.',
            'The `is` operator tests object identity (same memory address), whereas `==` checks value equality.',
            'Use `isinstance()` rather than direct type comparisons to preserve subclass polymorphism.'
          ],
          snippets: [
            {
              title: 'Dynamic Binding and String Interpolation',
              language: 'python',
              code: 'user_name: str = "Alex"\nstudy_hours: int = 4\ngpa: float = 3.92\n\n# Modern Python F-string with formatting specifiers\nsummary = f"Student {user_name}: {study_hours} hrs studied | GPA: {gpa:.1f}"\nprint(summary)',
              explanation: 'Demonstrating optional type annotations and formatted string literals with rounding.'
            },
            {
              title: 'Identity vs Value Equality',
              language: 'python',
              code: 'a = [1, 2, 3]\nb = [1, 2, 3]\n\nprint(a == b)  # True (identical values)\nprint(a is b)  # False (distinct memory references)',
              explanation: 'Shows why `==` is used for value comparisons and `is` is reserved for singleton checks like `x is None`.'
            }
          ]
        },
        keyConcepts: [
          {
            id: 'c2-1',
            term: 'Variable Reference',
            definition: 'A symbolic identifier that points to a specific object allocated in heap memory rather than storing the value directly inside a memory register.',
            importance: 'foundational',
            pageNumber: 38,
            example: 'x = 42 (x references an integer object on heap)'
          },
          {
            id: 'c2-2',
            term: 'Immutability',
            definition: 'A property of an object whose state cannot be modified after creation. Ints, floats, strings, and tuples are immutable.',
            importance: 'high',
            pageNumber: 44,
            example: 's = "hello"; s += " world" allocates a new string'
          },
          {
            id: 'c2-3',
            term: 'Memory Identity (is vs ==)',
            definition: '`==` verifies logical value equality; `is` verifies whether two variables reference the exact same memory address (id).',
            importance: 'high',
            pageNumber: 52
          }
        ],
        flashcards: pyCh2Flashcards,
        questionBank: pyCh2Questions
      },
      {
        id: 'py-ch-3',
        number: 3,
        title: 'Operators and Boolean Expressions',
        readTime: '15 min',
        progress: 85,
        pageRange: 'pp. 77–104',
        learningObjectives: [
          'Understand arithmetic, relational, and logical operator precedence',
          'Utilize short-circuit evaluation in logical `and` / `or` conditions',
          'Apply bitwise operators and chained comparisons'
        ],
        summary: {
          whatYouWillLearn: [
            'Difference between true division `/` and floor division `//`',
            'How short-circuit boolean evaluation prevents hazardous evaluations',
            'Chaining comparison operators like `10 <= score < 90`'
          ],
          overview: 'Operators in Python provide arithmetic calculations, logical evaluations, bitwise operations, and membership tests.',
          sections: [
            {
              heading: '1. Division and Arithmetic',
              content: '`/` produces float division; `//` produces floor division truncating toward negative infinity. `**` calculates exponentiation.'
            }
          ],
          keyTakeaways: [
            'Logical `and`/`or` return the operand value that satisfied the condition.',
            'Comparison chaining evaluates left-to-right with short-circuiting.'
          ],
          snippets: []
        },
        keyConcepts: [
          {
            id: 'c3-1',
            term: 'Short-Circuit Evaluation',
            definition: 'Halting condition evaluation as soon as the final boolean outcome is guaranteed.',
            importance: 'high',
            pageNumber: 82
          }
        ],
        flashcards: [
          {
            id: 'fc-3-1',
            chapterId: 'py-ch-3',
            question: 'What is the result of `7 // 2` in Python?',
            answer: '3. The `//` operator performs floor division, truncating fractional digits toward negative infinity.',
            category: 'Arithmetic',
            difficulty: 'easy',
            mastery: 'known',
            sourceSection: 'Section 3.1',
            pageNumber: 78
          },
          {
            id: 'fc-3-2',
            chapterId: 'py-ch-3',
            question: 'How does the `or` operator evaluate operands in Python?',
            answer: 'It returns the first truthy operand, or the final operand if none are truthy, short-circuiting immediately.',
            category: 'Logic',
            difficulty: 'medium',
            mastery: 'known',
            sourceSection: 'Section 3.2',
            pageNumber: 82
          }
        ],
        questionBank: [
          {
            id: 'qb-3-1',
            chapterId: 'py-ch-3',
            chapterTitle: 'Operators and Boolean Expressions',
            question: 'What is the result of `2 ** 3` in Python?',
            questionType: 'mcq',
            difficulty: 'easy',
            options: ['A. 6', 'B. 8', 'C. 9', 'D. 5'],
            correctAnswerIndex: 1,
            explanation: 'The `**` operator represents exponentiation in Python: 2^3 = 8 (Page 80).',
            topic: 'Operators',
            sourceSection: 'Section 3.1',
            pageNumber: 80
          }
        ]
      }
    ]
  },
  {
    id: 'os-concepts',
    title: 'Operating System Concepts: Essentials',
    author: 'Abraham Silberschatz & Peter Galvin',
    fileType: 'PDF',
    fileSize: '18.5 MB',
    pages: 450,
    chaptersCount: 10,
    topicsCount: 42,
    conceptsCount: 160,
    quizQuestionsCount: 180,
    progress: 42,
    lastStudied: 'Yesterday, 8:40 PM',
    coverGradient: 'bg-slate-900',
    badge: 'Systems & Architecture',
    weakTopics: ['Deadlock Prevention & Banker\'s Algorithm', 'Virtual Memory Paging'],
    strongTopics: ['Process Lifecycle & PCB', 'CPU Scheduling Algorithms'],
    chapters: [
      {
        id: 'os-ch-1',
        number: 1,
        title: 'Introduction to Operating Systems',
        readTime: '15 min',
        progress: 100,
        pageRange: 'pp. 1–45',
        learningObjectives: ['Dual-mode CPU operation', 'System call mechanics', 'Kernel vs user mode'],
        summary: {
          whatYouWillLearn: ['Role of the OS as resource allocator and control program', 'Dual-mode CPU hardware protection (Mode bit 0/1)'],
          overview: 'An Operating System is system software that manages computer hardware, software resources, and provides common services for computer programs.',
          sections: [
            {
              heading: '1. Dual-Mode Operation',
              content: 'Hardware protection isolates critical kernel instructions from user code via CPU mode bit (0 = Kernel, 1 = User).'
            }
          ],
          keyTakeaways: ['System calls provide the API gateway into privileged kernel operations.'],
          snippets: []
        },
        keyConcepts: [{ id: 'os-c1', term: 'Dual-Mode Operation', definition: 'Hardware mechanism ensuring user code cannot compromise kernel integrity.', importance: 'foundational', pageNumber: 18 }],
        flashcards: [{ id: 'os-fc1', chapterId: 'os-ch-1', question: 'What transitions the CPU from user mode to kernel mode?', answer: 'A hardware interrupt, software trap, or system call transitions the CPU into kernel mode.', category: 'Architecture', difficulty: 'easy', mastery: 'known', sourceSection: 'Section 1.2', pageNumber: 18 }],
        questionBank: [{ id: 'os-q1', chapterId: 'os-ch-1', chapterTitle: 'Introduction to Operating Systems', question: 'What is the primary role of a system call?', questionType: 'mcq', difficulty: 'easy', options: ['A. Compile source code', 'B. Request a service from the operating system kernel', 'C. Encrypt disk partitions', 'D. Optimize GPU clock'], correctAnswerIndex: 1, explanation: 'System calls provide the programmatic interface between a running program and the OS kernel (Page 22).', topic: 'System Calls', sourceSection: 'Section 1.3', pageNumber: 22 }]
      }
    ]
  }
];

export const initialStats: UserStats = {
  booksUploaded: 2,
  topicsCompleted: 38,
  flashcardsReviewed: 142,
  flashcardsNeedingReview: 4,
  averageQuizScore: 84,
  practiceAccuracy: 88,
  practiceCompletedCount: 16,
  overallProgress: 72,
  studyStreakDays: 5,
  strongTopics: ['Variables and Data Types', 'Operators & Boolean Logic', 'Process Lifecycle', 'Dual-Mode Architecture'],
  weakTopics: ['Loops & Iterators', 'Functions & Variable Scope', 'Deadlock Banker\'s Algorithm'],
  weeklyActivity: [
    { day: 'Mon', minutes: 45, cardsCount: 24 },
    { day: 'Tue', minutes: 60, cardsCount: 35 },
    { day: 'Wed', minutes: 30, cardsCount: 18 },
    { day: 'Thu', minutes: 75, cardsCount: 42 },
    { day: 'Fri', minutes: 90, cardsCount: 50 },
    { day: 'Sat', minutes: 40, cardsCount: 20 },
    { day: 'Sun', minutes: 25, cardsCount: 15 }
  ],
  recentScores: [
    {
      id: 'rec-1',
      date: 'Today, 2:30 PM',
      bookTitle: 'Python Programming',
      itemTitle: 'Chapter 2: Variables & Types Quiz',
      score: 10,
      total: 12,
      percentage: 83,
      type: 'quiz'
    },
    {
      id: 'rec-2',
      date: 'Yesterday, 9:15 PM',
      bookTitle: 'Operating System Concepts',
      itemTitle: 'Practice Mode (Mixed Difficulty)',
      score: 18,
      total: 20,
      percentage: 90,
      type: 'practice'
    }
  ]
};
