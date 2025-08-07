# Getting Started

This guide will help you set up and use the MkDocs Quiz Plugin in your own documentation project.

## Prerequisites

Before you begin, make sure you have:

- Python 3.7 or higher
- MkDocs installed
- Material for MkDocs theme (recommended)

## Installation

### Step 1: Install the Plugin

Install the plugin from the source repository:

```bash
pip install git+https://github.com/macielcalebe/mkdocs-quiz.git
```

Or install from a local development version:

```bash
git clone <repository-url>
cd mkdocs-quiz
pip install -e .
```

### Step 2: Configure MkDocs

Add the plugin to your `mkdocs.yml` configuration file:

```yaml
plugins:
  - search  # Keep your existing plugins
  - mkdocs_quiz  # Add the quiz plugin
```

### Step 3: Required Markdown Extensions

Make sure you have the necessary Markdown extensions enabled:

```yaml
markdown_extensions:
  - admonition
  - pymdownx.details
  - pymdownx.superfences
  - attr_list
  - md_in_html
```

## Basic Usage Test

Let's test if everything is working with a simple exercise:

!!! exercise choice "Installation Check"
    
    Have you successfully installed the MkDocs Quiz Plugin?
    
    - [x] Yes, everything is working!
    - [ ] No, I need help
    - [ ] I'm not sure
    
    !!! answer
        Great! If you can see this exercise and interact with it, the plugin is working correctly. If you're having issues, check the troubleshooting section.

## Configuration Options

The plugin supports several configuration options in your `mkdocs.yml`:

```yaml
plugins:
  - mkdocs_quiz:
      auto_save: true          # Automatically save user progress (default: true)
      debug_mode: false        # Enable debug logging (default: false)
      fallback_storage: true   # Use fallback storage methods (default: true)
```

### Configuration Details

- **auto_save**: When enabled, user responses are automatically saved to browser localStorage
- **debug_mode**: Enables detailed logging for troubleshooting
- **fallback_storage**: Provides backup storage methods if localStorage is unavailable

## Theme Compatibility

The plugin is designed to work with:

- ✅ Material for MkDocs (recommended)
- ✅ ReadTheDocs theme
- ✅ MkDocs default theme
- ✅ Custom themes (with proper CSS)

## Next Steps

Now that you have the plugin installed and configured:

1. Explore the [Multiple Choice Examples](examples/multiple-choice.md)
2. Try [Text Input Exercises](examples/text-input.md)
3. Learn about [Self Assessment](examples/self-assessment.md)
4. Check out [Advanced Features](advanced.md)

!!! exercise self "Setup Complete"
    
    Mark this as complete when you've successfully installed and configured the plugin in your own project.
    
    !!! answer
        Excellent! You're ready to start creating interactive learning content with the MkDocs Quiz Plugin.
