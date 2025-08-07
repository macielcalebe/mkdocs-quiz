# Troubleshooting

This guide helps you resolve common issues when using the MkDocs Quiz Plugin and provides solutions for typical problems.

## Installation Issues

### Plugin Not Found

**Problem**: MkDocs reports that the plugin cannot be found.

**Symptoms**:
```
Config value: 'plugins'. Error: The "mkdocs_quiz" plugin is not installed
```

**Solutions**:

1. **Verify Installation**:
   ```bash
   pip list | grep mkdocs-quiz
   ```

2. **Reinstall the Plugin**:
   ```bash
   pip uninstall mkdocs-quiz
   pip install git+https://github.com/macielcalebe/mkdocs-quiz.git
   ```

3. **Check Virtual Environment**:
   ```bash
   which pip
   which mkdocs
   ```

!!! exercise choice "Installation Check"
    
    What's the first step when troubleshooting plugin installation issues?
    
    - [x] Verify the plugin is actually installed
    - [ ] Reinstall MkDocs completely
    - [ ] Clear the browser cache
    - [ ] Restart the computer
    
    !!! answer
        Correct! Always verify the plugin is installed first using `pip list` or `pip show mkdocs-quiz`.

### Import Errors

**Problem**: Python import errors when building the site.

**Symptoms**:
```
ModuleNotFoundError: No module named 'src.plugin'
```

**Solutions**:

1. **Check Entry Points**: Verify `pyproject.toml` has correct entry points
2. **Install in Development Mode**: Use `pip install -e .` for local development
3. **Python Path Issues**: Ensure the plugin is in the Python path

## Configuration Problems

### Plugin Not Activating

**Problem**: Plugin is installed but exercises don't appear interactive.

**Symptoms**:
- Exercises appear as regular admonitions
- No JavaScript functionality
- Missing CSS styling

**Solution**:

1. **Check Plugin Configuration**:
   ```yaml
   plugins:
     - search
     - mkdocs_quiz  # Make sure it's listed
   ```

2. **Verify Markdown Extensions**:
   ```yaml
   markdown_extensions:
     - admonition      # Required
     - pymdownx.details
     - pymdownx.superfences
   ```

!!! exercise text short "Configuration Fix"
    
    What's missing from this mkdocs.yml configuration?
    
    ```yaml
    plugins:
      - search
    
    markdown_extensions:
      - pymdownx.highlight
    ```
    
    !!! answer
        Missing: `- mkdocs_quiz` in plugins and `- admonition` in markdown_extensions. Both are required for the plugin to work properly.

### CSS/JS Not Loading

**Problem**: Exercises appear but without proper styling or functionality.

**Debugging Steps**:

1. **Check Browser Console**: Look for 404 errors
2. **Verify File Paths**: Ensure static files are copied correctly
3. **Clear Cache**: Hard refresh the browser (Ctrl+F5)

**Solution**:
```yaml
# Force plugin reload
plugins:
  - mkdocs_quiz:
      debug_mode: true  # Enable debugging
```

## Content Issues

### Exercises Not Rendering

**Problem**: Exercise blocks appear as regular text or broken admonitions.

**Common Causes**:

1. **Incorrect Syntax**:
   ```markdown
   # Wrong
   !!! exercise choice
   
   # Correct
   !!! exercise choice "Title"
   ```

2. **Missing Answer Block**:
   ```markdown
   !!! exercise choice "Question"
       
       Question text?
       
       - [ ] Option A
       - [x] Option B
       
       # Missing this:
       !!! answer
           Explanation here
   ```

3. **Indentation Problems**:
   ```markdown
   !!! exercise choice "Question"
   
   Question text?  # Wrong - not indented
   
       - [ ] Option A  # Wrong - inconsistent indentation
   ```

!!! exercise choice "Common Syntax Error"
    
    What's wrong with this exercise block?
    
    ```markdown
    !!! exercise choice
        What is 2+2?
        - [ ] 3
        - [x] 4
    ```
    
    - [ ] Missing answer block
    - [ ] Wrong indentation
    - [x] Missing title in quotes
    - [ ] Wrong exercise type
    
    !!! answer
        Correct! The exercise needs a title in quotes: `!!! exercise choice "What is 2+2?"`

### Answer Blocks Not Working

**Problem**: Answer blocks don't expand or show content.

**Check These Issues**:

1. **Proper Nesting**: Answer blocks must be inside exercise blocks
2. **Correct Indentation**: Match the exercise block indentation
3. **Extension Conflicts**: Other extensions might interfere

**Example Fix**:
```markdown
!!! exercise choice "Title"
    
    Question text here
    
    - [ ] Option A
    - [x] Option B
    
    !!! answer
        This is properly indented and nested
```

## JavaScript Issues

### Interactions Not Working

**Problem**: Can't click options or submit buttons don't work.

**Debugging**:

1. **Check Console**: Open browser developer tools
2. **Verify JavaScript Loading**: Look for script errors
3. **Test in Different Browsers**: Rule out browser-specific issues

**Common Solutions**:

```javascript
// Check if quiz functions are available
console.log(typeof window.initializeQuiz);

// Manually initialize if needed
document.addEventListener('DOMContentLoaded', function() {
    if (window.initializeQuiz) {
        window.initializeQuiz();
    }
});
```

!!! exercise text long "Debug Strategy"
    
    What steps would you follow to debug JavaScript issues in the quiz plugin?
    
    !!! answer
        Debugging steps:
        1. Open browser developer tools (F12)
        2. Check Console tab for error messages
        3. Look in Network tab for failed resource loads
        4. Verify Elements tab shows proper HTML structure
        5. Test in different browsers
        6. Enable debug mode in plugin configuration
        7. Check for conflicts with other JavaScript

### Storage Issues

**Problem**: Progress not being saved or restored.

**Causes**:
- localStorage disabled
- Private browsing mode
- Storage quota exceeded
- Browser compatibility

**Solutions**:

1. **Enable Fallback Storage**:
   ```yaml
   plugins:
     - mkdocs_quiz:
         fallback_storage: true
   ```

2. **Test Storage Manually**:
   ```javascript
   // In browser console
   localStorage.setItem('test', 'value');
   console.log(localStorage.getItem('test'));
   ```

## Theme Compatibility

### Styling Issues

**Problem**: Exercises look broken or don't match theme.

**Solutions**:

1. **Check Theme Compatibility**: Some themes may need custom CSS
2. **Add Custom Styles**:
   ```yaml
   extra_css:
     - assets/custom-quiz.css
   ```

3. **Override Specific Styles**:
   ```css
   .admonition.exercise {
       border: 2px solid var(--md-primary-fg-color);
   }
   ```

!!! exercise self "Theme Testing"
    
    Have you tested your exercises with both light and dark theme variants?
    
    !!! answer
        Great! Testing with different theme variants ensures a consistent experience for all users.

### Dark Mode Issues

**Problem**: Poor visibility in dark themes.

**Fix**:
```css
@media (prefers-color-scheme: dark) {
    .quiz-form {
        background-color: var(--md-code-bg-color);
        color: var(--md-default-fg-color);
    }
    
    .quiz-submit-btn {
        background-color: var(--md-primary-fg-color);
        color: var(--md-primary-bg-color);
    }
}
```

## Performance Issues

### Slow Page Loading

**Problem**: Pages with many exercises load slowly.

**Solutions**:

1. **Reduce Exercises Per Page**: Split content across multiple pages
2. **Lazy Loading**: Exercises initialize when visible
3. **Optimize Images**: Compress any images in exercises
4. **Minimize CSS/JS**: Use production builds

### Memory Usage

**Problem**: High memory usage with many exercises.

**Monitoring**:
```javascript
// Check memory usage
console.log(performance.memory);

// Monitor storage usage
console.log(JSON.stringify(localStorage).length);
```

## Build Issues

### Static Files Not Copying

**Problem**: CSS/JS files missing from built site.

**Check**:
1. **File Permissions**: Ensure static files are readable
2. **Build Process**: Check build logs for errors
3. **Plugin Order**: Some plugins may conflict

**Debug**:
```bash
mkdocs build --verbose
```

### Path Issues

**Problem**: Incorrect asset paths in built site.

**Solution**:
```yaml
# In mkdocs.yml
site_url: https://your-domain.com/path/
use_directory_urls: true
```

## Getting Help

### Enable Debug Mode

Always enable debug mode when reporting issues:

```yaml
plugins:
  - mkdocs_quiz:
      debug_mode: true
```

### Information to Include

When seeking help, provide:

1. **MkDocs version**: `mkdocs --version`
2. **Plugin version**: `pip show mkdocs-quiz`
3. **Configuration**: Your `mkdocs.yml` relevant sections
4. **Error messages**: Complete error output
5. **Browser/OS**: Environment details
6. **Minimal example**: Simplified reproduction case

!!! exercise text long "Bug Report"
    
    Write a template for a good bug report for the quiz plugin:
    
    !!! answer
        A good bug report should include:
        
        **Environment:**
        - MkDocs version: X.X.X
        - Plugin version: X.X.X
        - Python version: X.X.X
        - OS: Windows/Mac/Linux
        - Browser: Chrome/Firefox/Safari version
        
        **Configuration:**
        ```yaml
        # Relevant mkdocs.yml sections
        ```
        
        **Expected Behavior:**
        Clear description of what should happen
        
        **Actual Behavior:**
        What actually happens
        
        **Steps to Reproduce:**
        1. Step one
        2. Step two
        3. See error
        
        **Error Output:**
        ```
        Complete error messages
        ```
        
        **Minimal Example:**
        Simplest possible markdown that reproduces the issue

### Community Resources

- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check the README and examples
- **Stack Overflow**: Search for similar issues
- **MkDocs Community**: General MkDocs support

## Prevention Tips

### Best Practices

1. **Test Frequently**: Build and test changes often
2. **Use Version Control**: Track working configurations
3. **Document Changes**: Note what works and what doesn't
4. **Backup Configurations**: Keep working `mkdocs.yml` files
5. **Start Simple**: Begin with basic exercises before advanced features

!!! exercise self "Troubleshooting Confidence"
    
    Do you feel prepared to troubleshoot issues with the MkDocs Quiz Plugin?
    
    !!! answer
        Excellent! With this troubleshooting guide, you should be able to resolve most common issues. Remember to enable debug mode and check the browser console when problems arise.

## Summary

Most issues with the MkDocs Quiz Plugin fall into these categories:

- **Installation**: Usually solved by reinstalling or checking environments
- **Configuration**: Fixed by correcting `mkdocs.yml` settings
- **Content**: Resolved by fixing markdown syntax and indentation
- **JavaScript**: Often browser or theme compatibility issues
- **Performance**: Addressed by optimizing content organization

When in doubt, start with the basics: enable debug mode, check the browser console, and verify your configuration against the working examples.

Happy troubleshooting! 🔧
