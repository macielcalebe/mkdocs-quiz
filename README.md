# MkDocs Quiz Plugin

A MkDocs plugin that adds interactive quiz and exercise functionality to your documentation. Create engaging learning experiences with multiple choice questions, text input exercises, and self-assessment activities.

## Features

- **Multiple Choice Questions**: Create interactive multiple choice exercises with automatic feedback
- **Text Input Exercises**: Support for both short and long text input exercises
- **Self-Assessment**: Allow users to mark exercises as completed for self-paced learning
- **Persistent State**: User progress is saved using localStorage with fallback support
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Accessibility**: Built with keyboard navigation and screen reader support
- **Dark Theme Support**: Compatible with Material for MkDocs dark themes

## Installation

Install the plugin using pip:

```bash
pip install git+https://github.com/macielcalebe/mkdocs-quiz.git
```

Or install from source:

```bash
git clone <repository-url>
cd mkdocs-quiz
pip install -e .
```

## Configuration

Add the plugin to your `mkdocs.yml` configuration:

```yaml
plugins:
  - mkdocs_quiz
```

## Usage

### Multiple Choice Questions

Create multiple choice exercises using admonition blocks with the `exercise choice` classes:

```markdown
!!! exercise choice "Question Title"
    
    What is the correct answer?
    
    - [ ] Option A (incorrect)
    - [x] Option B (correct)
    - [ ] Option C (incorrect)
    
    !!! answer
        Option B is correct because...
```

### Text Input Exercises

#### Short Text Input

```markdown
!!! exercise text short "Short Answer Question"
    
    What is your name?
    
    !!! answer
        Any valid name is acceptable.
```

#### Long Text Input

```markdown
!!! exercise text long "Essay Question"
    
    Explain the concept in detail.
    
    !!! answer
        A good answer should include...
```

### Self-Assessment Exercises

```markdown
!!! exercise self "Self-Check"
    
    Review the material and mark as complete when ready.
    
    !!! answer
        Great! You've completed this section.
```

## Example MkDocs Configuration

You can find example usage in the [example/](https://github.com/macielcalebe/mkdocs-quiz/tree/main/example) folder of this repository.

## Exercise Types

### Choice Exercises
- **Class**: `exercise choice`
- **Functionality**: Interactive multiple choice with single selection
- **Feedback**: Immediate visual feedback showing correct/incorrect answers
- **Features**: 
  - Click to select alternatives
  - Submit button to check answers
  - Edit button to modify answers after submission
  - Automatic answer revelation

### Text Exercises
- **Short Text**: `exercise text short` - Single line input field
- **Long Text**: `exercise text long` - Multi-line textarea
- **Features**:
  - Auto-resize for long text areas
  - Save/restore functionality
  - Edit capability after submission

### Self-Progress Exercises
- **Class**: `exercise self`
- **Functionality**: Simple completion marking
- **Use Case**: Self-paced learning milestones

## Styling and Theming

The plugin includes CSS styling that integrates with Material for MkDocs themes:

- Hover effects and smooth transitions
- Color-coded feedback (green for correct, red for incorrect)
- Responsive design for mobile devices
- Dark theme compatibility
- High contrast mode support

## Development

### Project Structure

```
./
├── __init__.py          # Package initialization
├── plugin.py            # Main MkDocs plugin
├── extension.py         # Markdown extension for processing
└── static/
    ├── quiz.css         # Styling for quiz elements
    └── quiz.js          # JavaScript functionality
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation

## Credits

- Inspired by [active-handout-plugins-py](https://github.com/insper-education/active-handout-plugins-py.git).
- Built for MkDocs with Material theme compatibility.