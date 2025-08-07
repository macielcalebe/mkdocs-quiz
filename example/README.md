# Example Plugin

## Project Structure

```
example/
├── mkdocs.yml              # MkDocs configuration
├── requirements.txt        # Python dependencies
├── README.md              # This file
├── docs/                  # Documentation source
│   ├── index.md           # Home page
│   ├── getting-started.md # Setup guide
│   ├── advanced.md        # Advanced features
│   ├── troubleshooting.md # Problem solving
│   └── examples/          # Exercise examples
│       ├── multiple-choice.md
│       ├── text-input.md
│       ├── self-assessment.md
│       └── mixed-exercise.md
└── site/                  # Built site (generated)
```

## Instructions

1. Install the library:
    ```bash
    pip install -r requirements.txt
    ```

2. Run the development server:
    ```bash
    mkdocs serve
    ```