# Advanced Features

Discover advanced configuration options and customization features of the MkDocs Quiz Plugin to create sophisticated learning experiences.

## Plugin Configuration

The quiz plugin offers several configuration options to customize behavior:

```yaml
plugins:
  - mkdocs_quiz:
      auto_save: true          # Automatically save user progress
      debug_mode: false        # Enable debug logging
      fallback_storage: true   # Use fallback storage methods
```

### Configuration Options Explained

#### Auto Save
When enabled (default), user responses are automatically saved to browser localStorage:

!!! exercise choice "Auto Save Benefits"
    
    What is the main benefit of the auto_save feature?
    
    - [ ] Faster page loading
    - [x] Progress is preserved across sessions
    - [ ] Better quiz performance
    - [ ] Reduced server load
    
    !!! answer
        Correct! Auto save ensures that learners don't lose their progress if they close the browser or navigate away from the page.

#### Debug Mode
Enables detailed logging for troubleshooting and development:

```yaml
plugins:
  - mkdocs_quiz:
      debug_mode: true
```

When enabled, you'll see detailed console output about:
- Plugin initialization
- Exercise processing
- JavaScript events
- Storage operations

#### Fallback Storage
Provides backup storage methods if localStorage is unavailable:

!!! exercise text long "Storage Scenarios"
    
    In what situations might fallback storage be necessary?
    
    !!! answer
        Fallback storage is useful when:
        - Browser localStorage is disabled
        - Private/incognito browsing mode
        - Very old browsers
        - Corporate environments with restricted storage
        - Mobile browsers with limited storage

## Custom Styling

The plugin includes comprehensive CSS that you can customize or extend.

### CSS Classes Available

The plugin generates these CSS classes that you can style:

```css
/* Exercise containers */
.admonition.exercise { }
.exercise.choice { }
.exercise.text { }
.exercise.self { }

/* Form elements */
.quiz-form { }
.quiz-option { }
.quiz-submit-btn { }
.quiz-edit-btn { }

/* States */
.quiz-submitted { }
.quiz-correct { }
.quiz-incorrect { }

/* Text inputs */
.quiz-text-input { }
.quiz-text-short { }
.quiz-text-long { }
```

### Custom Theme Integration

To integrate with your custom theme, add CSS overrides:

```css
/* Custom colors for your brand */
.admonition.exercise {
    border-color: #your-brand-color;
}

.quiz-submit-btn {
    background-color: #your-button-color;
    color: #your-text-color;
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
    .quiz-form {
        background-color: #your-dark-background;
        color: #your-dark-text;
    }
}
```

## Advanced Exercise Types

### Complex Multiple Choice

Create more sophisticated multiple choice questions with detailed feedback:

!!! exercise choice "Advanced Programming Concepts"
    
    Which design pattern is best suited for creating a single instance of a class that can be accessed globally?
    
    - [ ] Factory Pattern - Creates objects without specifying exact classes
    - [ ] Observer Pattern - Defines one-to-many dependency between objects
    - [x] Singleton Pattern - Ensures only one instance exists
    - [ ] Strategy Pattern - Defines family of algorithms
    
    !!! answer
        The Singleton pattern is correct! It ensures that a class has only one instance and provides global access to it. This is useful for configurations, logging, database connections, etc. The other patterns serve different purposes:
        
        - **Factory**: Creates objects without specifying their concrete classes
        - **Observer**: Notifies multiple objects when state changes
        - **Strategy**: Allows algorithms to be selected at runtime

### Structured Text Exercises

Use text exercises for code review and analysis:

!!! exercise text long "Code Review"
    
    Review this Python function and suggest improvements:
    
    ```python
    def calc(x, y, op):
        if op == "+":
            return x + y
        elif op == "-":
            return x - y
        elif op == "*":
            return x * y
        elif op == "/":
            return x / y
    ```
    
    !!! answer
        Good improvements might include:
        
        1. **Better naming**: `calculate` instead of `calc`
        2. **Type hints**: `def calculate(x: float, y: float, op: str) -> float:`
        3. **Error handling**: Check for division by zero
        4. **Documentation**: Add docstring
        5. **Validation**: Validate operator input
        6. **Constants**: Use enum for operators
        
        ```python
        from enum import Enum
        from typing import Union
        
        class Operation(Enum):
            ADD = "+"
            SUBTRACT = "-"
            MULTIPLY = "*"
            DIVIDE = "/"
        
        def calculate(x: float, y: float, operation: str) -> float:
            """Perform basic arithmetic operations."""
            if operation == Operation.DIVIDE.value and y == 0:
                raise ValueError("Cannot divide by zero")
            # ... rest of implementation
        ```

## JavaScript API

The plugin exposes JavaScript events and methods for advanced integration:

### Available Events

```javascript
// Listen for quiz completion events
document.addEventListener('quizCompleted', function(event) {
    console.log('Quiz completed:', event.detail);
});

// Listen for progress updates
document.addEventListener('quizProgress', function(event) {
    console.log('Progress updated:', event.detail);
});
```

### Custom Integration Example

!!! exercise text long "JavaScript Integration"
    
    How would you use the JavaScript API to track learning analytics?
    
    !!! answer
        You could track analytics like this:
        
        ```javascript
        // Track quiz completions
        document.addEventListener('quizCompleted', function(event) {
            // Send to analytics service
            analytics.track('Quiz Completed', {
                quizId: event.detail.quizId,
                score: event.detail.score,
                timeSpent: event.detail.duration
            });
        });
        
        // Track page engagement
        document.addEventListener('quizProgress', function(event) {
            analytics.track('Learning Progress', {
                section: event.detail.section,
                completion: event.detail.percentage
            });
        });
        ```

## Accessibility Features

The plugin includes comprehensive accessibility support:

### Keyboard Navigation
- Tab through options with keyboard
- Enter/Space to select
- Arrow keys for navigation

### Screen Reader Support
- Proper ARIA labels
- Semantic HTML structure
- Clear role definitions

### High Contrast Mode
- Compatible with high contrast themes
- Clear visual indicators
- Sufficient color contrast ratios

### Test Accessibility

!!! exercise self "Accessibility Check"
    
    Have you tested the exercises using only keyboard navigation?
    
    !!! answer
        Great! Accessibility testing ensures your content is usable by everyone. Try navigating with Tab, Enter, and arrow keys.

## Performance Optimization

### Best Practices

1. **Efficient Loading**: Plugin assets are loaded only when needed
2. **Local Storage**: Minimal data stored locally
3. **Lazy Loading**: Exercises initialize when visible
4. **Optimized CSS**: Minimal styles for fast rendering

### Performance Monitoring

!!! exercise text short "Performance Metric"
    
    What's the most important performance metric for interactive learning content?
    
    !!! answer
        Response time to user interactions is crucial. Learners should see immediate feedback when they submit answers or make selections.

## Content Management

### Large Scale Deployments

For sites with many exercises:

```yaml
# mkdocs.yml
plugins:
  - mkdocs_quiz:
      auto_save: true
      debug_mode: false  # Disable in production
      fallback_storage: true
      
# Additional optimization
extra_css:
  - assets/custom-quiz.css
  
extra_javascript:
  - assets/quiz-analytics.js
```

### Content Organization

Structure your content for maintainability:

```
docs/
├── courses/
│   ├── python-basics/
│   │   ├── index.md
│   │   ├── functions.md
│   │   └── exercises.md
│   └── web-dev/
│       ├── html.md
│       ├── css.md
│       └── projects.md
└── assessments/
    ├── midterm.md
    └── final.md
```

## Integration with Learning Management Systems

The plugin can integrate with LMS platforms:

!!! exercise text long "LMS Integration"
    
    Describe how you might integrate quiz results with a Learning Management System:
    
    !!! answer
        LMS integration approaches:
        
        1. **xAPI (Tin Can API)**: Send standardized learning records
        2. **SCORM**: Package content as SCORM modules
        3. **Custom API**: Direct integration with LMS REST APIs
        4. **Grade Passback**: Use LTI for grade synchronization
        5. **Data Export**: Bulk export of completion data
        
        Example xAPI integration:
        ```javascript
        // Send completion to LMS
        function sendToLMS(statement) {
            ADL.XAPIWrapper.sendStatement(statement);
        }
        ```

## Troubleshooting Advanced Issues

### Common Advanced Problems

1. **Storage Conflicts**: Multiple plugins using localStorage
2. **Theme Compatibility**: Custom themes breaking styles
3. **JavaScript Conflicts**: Other scripts interfering
4. **Performance Issues**: Too many exercises on one page

### Debugging Tools

Enable debug mode and check browser console:

```javascript
// Check localStorage usage
console.log(localStorage.getItem('mkdocs_quiz_progress'));

// Monitor exercise events
window.addEventListener('load', function() {
    console.log('Quiz plugin loaded');
});
```

## Future Development

Areas for potential enhancement:

!!! exercise self "Feature Ideas"
    
    Have you thought about additional features that would be useful for your use case?
    
    !!! answer
        Common feature requests include:
        - Timer functionality for timed quizzes
        - Question banks with random selection
        - Advanced scoring algorithms
        - Collaborative exercises
        - Integration with video content
        - Adaptive difficulty based on performance

## Next Steps

Now that you understand the advanced features:

- Check the [Troubleshooting](troubleshooting.md) guide for common issues
- Start implementing advanced features in your own content
- Consider contributing to the plugin's development
- Share your use cases and feedback with the community

!!! exercise self "Advanced Features Mastery"
    
    Do you feel confident using the advanced features of the MkDocs Quiz Plugin?
    
    !!! answer
        Excellent! You're now equipped to create sophisticated, interactive learning experiences. Keep experimenting and building amazing educational content!
