// Sistema de processamento de exercícios de múltipla escolha
function processChoiceExercises() {
  document.querySelectorAll('.admonition.exercise.choice').forEach(function(exerciseContainer, index) {
    // Always process choice exercises with JavaScript to ensure functionality
    const exerciseId = `exercise_choice_${index + 1}`;
    exerciseContainer.id = exerciseId;
    
    const ul = exerciseContainer.querySelector('ul');
    if (!ul) return;
    
    // Check if already processed by Python plugin
    const existingForm = exerciseContainer.querySelector('.quiz-form');
    if (existingForm) {
      console.log(`Choice exercise ${exerciseId} already has form from Python plugin`);
      
      // Ensure proper event handlers are attached
      attachChoiceEventHandlers(exerciseContainer, existingForm);
      return;
    }
    
    console.log(`Creating JavaScript form for choice exercise ${exerciseId}`);
    
    // Process list items
    const listItems = ul.querySelectorAll('li');
    const alternatives = [];
    let correctAnswerIndex = -1;
    
    listItems.forEach(function(li, i) {
      const text = li.textContent.trim();
      let isCorrect = false;
      let choiceText = text;
      
      // Check if it's a checkbox format
      if (text.startsWith('[ ]')) {
        choiceText = text.substring(3).trim();
        isCorrect = false;
      } else if (text.startsWith('[X]') || text.startsWith('[x]')) {
        choiceText = text.substring(3).trim();
        isCorrect = true;
        correctAnswerIndex = i;
      }
      
      alternatives.push({
        text: choiceText,
        isCorrect: isCorrect
      });
    });
    
    // Create the quiz form
    const form = document.createElement('form');
    form.className = 'quiz-form';
    
    const alternativeSet = document.createElement('div');
    alternativeSet.className = 'quiz-alternative-set';
    
    alternatives.forEach(function(alt, i) {
      const label = document.createElement('label');
      label.className = 'quiz-alternative';
      label.setAttribute('data-value', i); // Store value in data attribute instead of radio
      
      const content = document.createElement('div');
      content.className = 'content';
      
      // Create hidden input to store the value
      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = 'data';
      hiddenInput.value = '';
      
      const span = document.createElement('span');
      span.className = 'choice-text';
      span.textContent = alt.text;
      
      content.appendChild(span);
      label.appendChild(content);
      label.appendChild(hiddenInput);
      alternativeSet.appendChild(label);
    });
    
    const submitButton = document.createElement('button');
    submitButton.className = 'quiz-submit-button';
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    
    form.appendChild(alternativeSet);
    form.appendChild(submitButton);
    
    // Store correct answer
    exerciseContainer.dataset.answerIdx = correctAnswerIndex;
    
    // Replace the original ul with the form
    ul.parentNode.replaceChild(form, ul);
    
    console.log(`Processed choice exercise ${exerciseId} with ${alternatives.length} alternatives, correct: ${correctAnswerIndex}`);
    
    // Attach event handlers
    attachChoiceEventHandlers(exerciseContainer, form);
  });
}

// Function to attach event handlers to choice exercises
function attachChoiceEventHandlers(exerciseContainer, form) {
  const alternatives = form.querySelectorAll('.quiz-alternative');
  const submitButton = form.querySelector('.quiz-submit-button');
  
  // Check if handlers are already attached to prevent duplicates
  if (form.hasAttribute('data-handlers-attached')) {
    console.log('Choice handlers already attached, skipping duplicate attachment');
    return;
  }
  
  // Add click handlers to alternatives
  alternatives.forEach(function(alternative) {
    alternative.addEventListener('click', function() {
      // Check if the alternative is disabled or if the form is disabled
      if (this.classList.contains("disabled") || (submitButton && submitButton.disabled)) {
        console.log("Alternative click ignored - form is disabled");
        return;
      }
      
      // Remove selected class from all alternatives and clear their hidden inputs
      alternatives.forEach(alt => {
        alt.classList.remove('selected');
        const hiddenInput = alt.querySelector('input[type="hidden"], input[name="data"]');
        if (hiddenInput) {
          hiddenInput.value = '';
        }
      });
      
      // Add selected class to clicked alternative
      alternative.classList.add('selected');
      
      // Set the hidden input value
      const hiddenInput = alternative.querySelector('input[type="hidden"], input[name="data"]');
      const value = alternative.getAttribute('data-value') || 
                   alternative.getAttribute('data-alt-index') ||
                   Array.from(alternative.parentElement.children).indexOf(alternative);
      if (hiddenInput && value !== null) {
        hiddenInput.value = value.toString();
      }
    });
  });
  
  // Mark that handlers have been attached
  form.setAttribute('data-handlers-attached', 'true');
  console.log('Attached choice handlers via attachChoiceEventHandlers');
}

// Sistema de processamento de exercícios de texto
function processTextExercises() {
  // Process text short exercises
  document.querySelectorAll('.admonition.exercise.text.short').forEach(function(exerciseContainer, index) {
    // Check if form already exists (created by Python plugin)
    if (exerciseContainer.querySelector('.quiz-form')) {
      console.log(`Text short exercise ${index + 1} already has a form, skipping JavaScript creation`);
      return;
    }
    
    const exerciseId = `exercise_text_short_${index + 1}`;
    exerciseContainer.id = exerciseId;
    exerciseContainer.classList.add('exercise-short');
    
    const form = document.createElement('form');
    form.className = 'quiz-form';
    
    const textContainer = document.createElement('div');
    textContainer.className = 'quiz-text-container';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'data';
    input.className = 'quiz-text-input';
    input.placeholder = 'Enter your answer...';
    input.autocomplete = 'off';
    
    const submitButton = document.createElement('button');
    submitButton.className = 'quiz-submit-button';
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    
    textContainer.appendChild(input);
    form.appendChild(textContainer);
    form.appendChild(submitButton);
    
    // Append form to the exercise container
    exerciseContainer.appendChild(form);
    
    console.log(`Processed text short exercise ${exerciseId}`);
  });
  
  // Process text long exercises
  document.querySelectorAll('.admonition.exercise.text.long').forEach(function(exerciseContainer, index) {
    // Check if form already exists (created by Python plugin)
    if (exerciseContainer.querySelector('.quiz-form')) {
      console.log(`Text long exercise ${index + 1} already has a form, skipping JavaScript creation`);
      return;
    }
    
    const exerciseId = `exercise_text_long_${index + 1}`;
    exerciseContainer.id = exerciseId;
    exerciseContainer.classList.add('exercise-long');
    
    const form = document.createElement('form');
    form.className = 'quiz-form';
    
    const textContainer = document.createElement('div');
    textContainer.className = 'quiz-text-container';
    
    const textarea = document.createElement('textarea');
    textarea.name = 'data';
    textarea.className = 'quiz-text-input';
    textarea.placeholder = 'Enter your detailed answer...';
    textarea.rows = 4;
    
    const submitButton = document.createElement('button');
    submitButton.className = 'quiz-submit-button';
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    
    textContainer.appendChild(textarea);
    form.appendChild(textContainer);
    form.appendChild(submitButton);
    
    // Append form to the exercise container
    exerciseContainer.appendChild(form);
    
    console.log(`Processed text long exercise ${exerciseId}`);
  });
}

// Sistema de armazenamento adaptativo com fallback
const storage = {
  data: {},
  available: false,
  
  init: function() {
    try {
      const test = 'test_' + Date.now();
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      this.available = true;
      console.log('localStorage is available');
      return true;
    } catch(e) {
      console.warn('localStorage not available, using memory storage:', e.message);
      this.available = false;
      return false;
    }
  },
  
  setItem: function(key, value) {
    try {
      if (this.available) {
        localStorage.setItem(key, value);
        return true;
      }
    } catch(e) {
      console.warn('localStorage.setItem failed, using memory storage:', e.message);
      this.available = false;
    }
    
    // Fallback para armazenamento em memória
    this.data[key] = value;
    return false;
  },
  
  getItem: function(key) {
    try {
      if (this.available) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          return value;
        }
      }
    } catch(e) {
      console.warn('localStorage.getItem failed, using memory storage:', e.message);
      this.available = false;
    }
    
    // Fallback para armazenamento em memória
    return this.data[key] || null;
  },
  
  removeItem: function(key) {
    try {
      if (this.available) {
        localStorage.removeItem(key);
      }
    } catch(e) {
      console.warn('localStorage.removeItem failed:', e.message);
    }
    
    // Sempre limpa do armazenamento em memória também
    delete this.data[key];
  }
};

// Função de debug para informações do navegador
function debugBrowserInfo() {
  console.log('=== DEBUG INFO ===');
  console.log('User Agent:', navigator.userAgent);
  console.log('Browser supports Storage:', typeof(Storage) !== "undefined");
  console.log('Current origin:', window.location.origin);
  console.log('Current protocol:', window.location.protocol);
  console.log('localStorage available:', storage.available);
  console.log('==================');
}

// Function to add exercise numbering (JavaScript fallback)
function addExerciseNumbering() {
  const exercises = document.querySelectorAll('.admonition.exercise');
  let exerciseCounter = 0;
  
  exercises.forEach(function(exercise) {
    exerciseCounter++;
    const titleElement = exercise.querySelector('.admonition-title');
    
    if (titleElement) {
      let newTitle = '';
      
      // Determine the type and create simple numbering
      if (exercise.classList.contains('exercise-choice') || 
          exercise.classList.contains('exercise-long') || 
          exercise.classList.contains('exercise-short') || 
          exercise.classList.contains('exercise-text')) {
        newTitle = `Question ${exerciseCounter}`;
      } else {
        newTitle = `Exercise ${exerciseCounter}`;
      }
      
      titleElement.textContent = newTitle;
      console.log(`Updated exercise ${exerciseCounter}: ${newTitle}`);
    }
  });
  
  console.log(`Processed ${exerciseCounter} exercises for numbering`);
}

// Function to clean up invalid stored states
function cleanupInvalidStates() {
  if (!storage.available) return;
  
  console.log('Cleaning up invalid stored states...');
  const keysToRemove = [];
  
  // Check localStorage for quiz-related keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('exercise_')) {
      try {
        const value = localStorage.getItem(key);
        const state = JSON.parse(value);
        
        // Check if the state has null selectedAnswer for choice exercises
        if (state.submitted && state.selectedAnswer === null) {
          console.log(`Found invalid state for ${key}:`, state);
          keysToRemove.push(key);
        }
      } catch (e) {
        // Invalid JSON, mark for removal
        console.log(`Found corrupted state for ${key}, marking for removal`);
        keysToRemove.push(key);
      }
    }
  }
  
  // Remove invalid states
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`Removed invalid state: ${key}`);
  });
  
  if (keysToRemove.length > 0) {
    console.log(`Cleaned up ${keysToRemove.length} invalid states`);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Process exercises first
  processChoiceExercises();
  processTextExercises();
  
  // Add exercise numbering (JavaScript fallback for CSS counters)
  addExerciseNumbering();
  
  // Inicializa o sistema de armazenamento
  storage.init();
  debugBrowserInfo();
  
  // Clean up any invalid stored states
  cleanupInvalidStates();
  
  document.querySelectorAll("form.quiz-form").forEach(function (form) {
    const exerciseContainer = form.closest(".admonition.exercise");
    if (!exerciseContainer) return;
    
    // Check if this form is already being processed to prevent duplicate processing
    if (form.hasAttribute('data-quiz-processed')) {
      console.log(`Form already processed, skipping: ${exerciseContainer.id}`);
      return;
    }
    
    // Mark as being processed
    form.setAttribute('data-quiz-processed', 'true');
    
    const answerBlock = exerciseContainer.querySelector(".quiz-answer, .admonition.answer");
    const submitButton = form.querySelector(".quiz-submit-button");
    let exerciseId = exerciseContainer.id;
    const titleElement = exerciseContainer.querySelector(".admonition-title");
    
    // Ensure exercise has an ID, especially for choice exercises
    if (!exerciseId) {
      if (exerciseContainer.classList.contains("choice")) {
        const choiceIndex = Array.from(document.querySelectorAll('.admonition.exercise.choice')).indexOf(exerciseContainer) + 1;
        exerciseId = `exercise_choice_${choiceIndex}`;
      } else if (exerciseContainer.classList.contains("exercise-short") || exerciseContainer.classList.contains("exercise-text")) {
        const textIndex = Array.from(document.querySelectorAll('.admonition.exercise.exercise-short, .admonition.exercise.exercise-text')).indexOf(exerciseContainer) + 1;
        exerciseId = `exercise_text_${textIndex}`;
      } else {
        const allIndex = Array.from(document.querySelectorAll('.admonition.exercise')).indexOf(exerciseContainer) + 1;
        exerciseId = `exercise_${allIndex}`;
      }
      exerciseContainer.id = exerciseId;
    }
    
    console.log(`Processing exercise: ${exerciseId}`);
    console.log("Exercise Container:", exerciseContainer);
    console.log("Title Element:", titleElement);
    
    // Create and append the edit button
    const editButton = document.createElement("button");
    editButton.classList.add("quiz-edit-button");
    editButton.innerHTML = "&#x270E;"; // Pencil icon
    editButton.type = "button"; // Evita submit do form
    editButton.title = "Edit answer"; // Tooltip
    
    if (titleElement) {
      titleElement.appendChild(editButton);
      console.log("Edit button appended to title element.");
    } else {
      // Fallback if titleElement is not found, append to exerciseContainer
      exerciseContainer.appendChild(editButton);
      console.log("Edit button appended to exercise container (fallback).");
    }
    
    console.log("Edit Button:", editButton);
    
    // Function to disable form elements
    function disableForm() {
      form.querySelectorAll("input, button, textarea").forEach(element => {
        if (!element.classList.contains("quiz-edit-button")) {
          element.disabled = true;
          console.log(`Disabled element: ${element.tagName} with name ${element.name || element.className}`);
        }
      });
      
      // Also disable choice alternatives by adding a disabled class
      form.querySelectorAll(".quiz-alternative").forEach(alternative => {
        alternative.classList.add("disabled");
        alternative.style.pointerEvents = "none";
        alternative.style.opacity = "0.6";
      });
      console.log(`Disabled ${form.querySelectorAll(".quiz-alternative").length} alternatives`);
    }
    
    // Function to enable form elements
    function enableForm() {
      form.querySelectorAll("input, button, textarea").forEach(element => {
        element.disabled = false;
        console.log(`Enabled element: ${element.tagName} with name ${element.name || element.className}`);
      });
      
      // Also enable choice alternatives by removing the disabled class
      form.querySelectorAll(".quiz-alternative").forEach(alternative => {
        alternative.classList.remove("disabled");
        alternative.style.pointerEvents = "";
        alternative.style.opacity = "";
      });
      console.log(`Enabled ${form.querySelectorAll(".quiz-alternative").length} alternatives`);
    }
    
    // Initially disable form elements
    disableForm();
    console.log("Initial disableForm() called.");
    
    // Load saved state from storage
    let savedState = null;
    const savedStateRaw = storage.getItem(exerciseId);
    
    if (savedStateRaw) {
      try {
        savedState = JSON.parse(savedStateRaw);
        console.log(`Loaded state for ${exerciseId}:`, savedState);
        console.log(`answerText in loaded state: ${savedState.answerText}`);
      } catch(e) {
        console.error(`Error parsing saved state for ${exerciseId}:`, e);
        // Remove estado corrompido
        storage.removeItem(exerciseId);
      }
    }
    
    if (savedState) {
      if (savedState.submitted) {
        // Restore submitted state
        disableForm();
        console.log("Restoring submitted state: disableForm() called.");
        
        // Only show answer block for submitted exercises
        if (answerBlock) {
          answerBlock.classList.add("show");
        }
        
        if (exerciseContainer.classList.contains("exercise") && exerciseContainer.classList.contains("choice")) {
          const alternatives = form.querySelectorAll(".quiz-alternative");
          const correctAnswerIndex = parseInt(exerciseContainer.dataset.answerIdx);
          const selectedAnswerIndex = savedState.selectedAnswer;
          
          console.log(`Restoring choice exercise ${exerciseId}:`);
          console.log(`- alternatives found: ${alternatives.length}`);
          console.log(`- correctAnswerIndex: ${correctAnswerIndex}`);
          console.log(`- selectedAnswerIndex: ${selectedAnswerIndex}`);
          
          // Only process if we have a valid selected answer index
          if (selectedAnswerIndex !== null && selectedAnswerIndex !== undefined && 
              selectedAnswerIndex >= 0 && selectedAnswerIndex < alternatives.length) {
            
            if (selectedAnswerIndex === correctAnswerIndex) {
              alternatives[selectedAnswerIndex].classList.add("correct");
            } else {
              alternatives[selectedAnswerIndex].classList.add("incorrect");
              if (correctAnswerIndex >= 0 && correctAnswerIndex < alternatives.length) {
                alternatives[correctAnswerIndex].classList.add("correct");
              }
            }
            
            // Set the hidden input and add selected class
            const hiddenInput = alternatives[selectedAnswerIndex].querySelector('input[name="data"], input[type="hidden"]');
            if (hiddenInput) {
              hiddenInput.value = selectedAnswerIndex.toString();
              alternatives[selectedAnswerIndex].classList.add("selected");
              console.log(`Restored selection for alternative ${selectedAnswerIndex}`);
            } else {
              console.log(`No hidden input found for alternative ${selectedAnswerIndex}`);
            }
          } else {
            console.log(`Invalid selectedAnswerIndex for ${exerciseId}: ${selectedAnswerIndex} (alternatives: ${alternatives.length})`);
            // Clear invalid state
            console.log(`Clearing invalid state for ${exerciseId}`);
            storage.removeItem(exerciseId);
            // Re-enable the form since the saved state was invalid
            enableForm();
            if (answerBlock) {
              answerBlock.classList.remove("show");
            }
          }
          
        } else if (exerciseContainer.classList.contains("exercise-short") || 
                   exerciseContainer.classList.contains("exercise-long") || 
                   exerciseContainer.classList.contains("exercise-text") ||
                   (exerciseContainer.classList.contains("exercise") && exerciseContainer.classList.contains("text"))) {
          const inputField = form.querySelector(".quiz-text-input");
          if (inputField && savedState.answerText !== undefined) {
            inputField.value = savedState.answerText;
            console.log(`Restored text input for ${exerciseId}: ${inputField.value}`);
          } else {
            console.log(`Input field not found or no answerText for ${exerciseId} during restore.`);
          }
        }
      } else {
        // If not submitted, restore partial state but DON'T show answer
        if (exerciseContainer.classList.contains("exercise-short") || 
            exerciseContainer.classList.contains("exercise-long") || 
            exerciseContainer.classList.contains("exercise-text") ||
            (exerciseContainer.classList.contains("exercise") && exerciseContainer.classList.contains("text"))) {
          const inputField = form.querySelector(".quiz-text-input");
          if (inputField && savedState.answerText !== undefined) {
            inputField.value = savedState.answerText;
            console.log(`Restored unsaved text input for ${exerciseId}: ${inputField.value}`);
          } else {
            console.log(`Input field not found or no answerText for ${exerciseId} during unsaved restore.`);
          }
        }
        // Keep answer block hidden for non-submitted exercises
        if (answerBlock) {
          answerBlock.classList.remove("show");
        }
        enableForm(); // Enable if not submitted
        console.log("State exists but not submitted: enableForm() called.");
      }
    } else {
      // No saved state - enable form and keep answer hidden
      enableForm(); 
      if (answerBlock) {
        answerBlock.classList.remove("show");
      }
      console.log("No saved state: enableForm() called.");
    }
    
    // Handle choice alternative clicks - only attach if not already attached
    if (exerciseContainer.classList.contains("exercise") && exerciseContainer.classList.contains("choice")) {
      const alternatives = form.querySelectorAll(".quiz-alternative");
      
      // Check if event handlers are already attached by looking for a data attribute
      if (!form.hasAttribute('data-handlers-attached')) {
        alternatives.forEach(alternative => {
          alternative.addEventListener("click", function() {
            // Check if the alternative is disabled or if the form is disabled
            if (this.classList.contains("disabled") || submitButton.disabled) {
              console.log("Alternative click ignored - form is disabled");
              return;
            }
            
            // Remove selected class from all alternatives and clear their hidden inputs
            alternatives.forEach(alt => {
              alt.classList.remove("selected");
              // Clear the hidden input value
              const hiddenInput = alt.querySelector('input[name="data"], input[type="hidden"]');
              if (hiddenInput) {
                hiddenInput.value = "";
              }
            });
            
            // Add selected class to clicked alternative
            this.classList.add("selected");
            
            // Set the hidden input with the selected alternative index
            const hiddenInput = this.querySelector('input[name="data"], input[type="hidden"]');
            if (hiddenInput) {
              // Try different data attribute names (JS uses data-value, Python might use data-alt-index)
              const altIndex = this.dataset.altIndex || this.getAttribute('data-value') || 
                              Array.from(this.parentElement.children).indexOf(this);
              hiddenInput.value = altIndex.toString();
            }
          });
        });
        
        // Mark that handlers have been attached
        form.setAttribute('data-handlers-attached', 'true');
        console.log(`Attached choice handlers for ${exerciseId}`);
      } else {
        console.log(`Choice handlers already attached for ${exerciseId}`);
      }
    }
    
    // Auto-save text input (with debounce) - only for text exercises
    if (exerciseContainer.classList.contains("exercise-short") || 
        exerciseContainer.classList.contains("exercise-long") || 
        exerciseContainer.classList.contains("exercise-text") ||
        (exerciseContainer.classList.contains("exercise") && exerciseContainer.classList.contains("text"))) {
      const inputField = form.querySelector(".quiz-text-input");
      if (inputField) {
        let saveTimeout;
        
        inputField.addEventListener("input", function() {
          // Clear previous timeout
          clearTimeout(saveTimeout);
          
          // Set new timeout for auto-save
          saveTimeout = setTimeout(() => {
            const currentState = storage.getItem(exerciseId);
            let state = currentState ? JSON.parse(currentState) : {};
            
            state.answerText = inputField.value;
            // Don't mark as submitted for auto-save
            
            const success = storage.setItem(exerciseId, JSON.stringify(state));
            console.log(`Auto-saved text input for ${exerciseId}: ${inputField.value} (success: ${success})`);
          }, 500); // Save after 500ms of no typing
        });
      }
    }
    
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      console.log("Form submitted. Preventing default behavior.");
      console.log(`Exercise type for submission: ${exerciseContainer.classList}`);
      
      let selectedAnswer = null;
      let answerText = null;
      
      if (exerciseContainer.classList.contains("exercise") && exerciseContainer.classList.contains("choice")) {
        console.log("Processing choice exercise submission.");
        
        // Find the selected alternative by looking for the one with a non-empty hidden input value
        const hiddenInputs = form.querySelectorAll('input[name="data"]');
        let selectedAlternative = null;
        selectedAnswer = -1; // Use the already declared variable
        
        for (let input of hiddenInputs) {
          if (input.value !== "") {
            selectedAlternative = input.closest(".quiz-alternative");
            selectedAnswer = parseInt(input.value);
            break;
          }
        }
        
        if (!selectedAlternative || selectedAnswer === -1) {
          alert("Please select an option.");
          return;
        }
        
        const alternatives = form.querySelectorAll(".quiz-alternative");
        
        // Remove previous classes
        alternatives.forEach(alt => {
          alt.classList.remove("correct", "incorrect", "selected");
        });
        
        const correctAnswerIndex = parseInt(exerciseContainer.dataset.answerIdx);
        
        if (selectedAnswer === correctAnswerIndex) {
          selectedAlternative.classList.add("correct");
        } else {
          selectedAlternative.classList.add("incorrect");
          // Highlight the correct answer
          alternatives[correctAnswerIndex].classList.add("correct");
        }
        
      } else if (exerciseContainer.classList.contains("exercise-short") || 
                 exerciseContainer.classList.contains("exercise-long") || 
                 exerciseContainer.classList.contains("exercise-text") ||
                 (exerciseContainer.classList.contains("exercise") && exerciseContainer.classList.contains("text"))) {
        console.log("Processing text exercise submission.");
        const inputField = form.querySelector(".quiz-text-input");
        if (inputField) {
          console.log("Input field found:", inputField);
          console.log("Input field value before saving:", inputField.value);
          answerText = inputField.value.trim();
          console.log(`Saving text input for ${exerciseId}: ${answerText}`);
        } else {
          console.log(`Input field not found for ${exerciseId} during save.`);
        }
        
      } else if (exerciseContainer.classList.contains("exercise-self-progress") || 
                 exerciseContainer.classList.contains("exercise")) {
        console.log("Processing self-progress exercise submission.");
        // For self-progress exercises, just mark as submitted
      }
      
      // Show answer block only after submission
      if (answerBlock) {
        answerBlock.classList.add("show");
        console.log("Answer block shown after submission.");
      }
      
      // Disable form after submission
      disableForm();
      console.log("After submission: disableForm() called.");
      
      // Save state to storage
      const stateData = {
        submitted: true,
        selectedAnswer: selectedAnswer,
        answerText: answerText,
        timestamp: Date.now()
      };
      
      const success = storage.setItem(exerciseId, JSON.stringify(stateData));
      console.log(`State saved to storage (success: ${success}):`, stateData);
    });
    
    // Handle edit button click
    editButton.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      console.log("Edit button clicked.");
      
      // Get current saved state to restore the last submitted answer
      const currentSavedState = storage.getItem(exerciseId);
      let lastSubmittedState = null;
      
      if (currentSavedState) {
        try {
          lastSubmittedState = JSON.parse(currentSavedState);
        } catch (e) {
          console.warn("Failed to parse saved state:", e);
        }
      }
      
      // Enable form elements
      enableForm();
      console.log("Form enabled after edit button click");
      
      // Remove feedback classes but preserve the submitted answer
      form.querySelectorAll(".quiz-alternative").forEach(alt => {
        alt.classList.remove("correct", "incorrect");
        // Don't remove "selected" class here, we'll restore it below
        
        // Clear hidden input values for choice exercises (will be restored below)
        const hiddenInput = alt.querySelector('input[name="data"], input[type="hidden"]');
        if (hiddenInput) {
          hiddenInput.value = "";
        }
      });
      
      // Restore the last submitted answer for text exercises
      const textInput = form.querySelector(".quiz-text-input");
      if (textInput && lastSubmittedState && lastSubmittedState.answerText !== undefined) {
        textInput.value = lastSubmittedState.answerText;
        console.log("Restored last submitted text answer:", lastSubmittedState.answerText);
      } else if (textInput) {
        textInput.value = ""; // Only clear if no saved answer
      }
      
      // Restore the last submitted answer for choice exercises
      if (lastSubmittedState && lastSubmittedState.selectedAnswer !== undefined) {
        const selectedIndex = lastSubmittedState.selectedAnswer;
        const alternatives = form.querySelectorAll(".quiz-alternative");
        
        // First remove all selected states
        alternatives.forEach(alt => alt.classList.remove("selected"));
        
        // Then restore the last selected option
        if (selectedIndex >= 0 && selectedIndex < alternatives.length) {
          const selectedAlt = alternatives[selectedIndex];
          selectedAlt.classList.add("selected");
          
          const hiddenInput = selectedAlt.querySelector('input[name="data"], input[type="hidden"]');
          if (hiddenInput) {
            hiddenInput.value = selectedIndex.toString();
          }
          console.log("Restored last submitted choice answer:", selectedIndex);
        }
      }
      
      // Hide answer block when editing
      if (answerBlock) {
        answerBlock.classList.remove("show");
        console.log("Answer block hidden for editing.");
      }
      
      // Update the saved state to mark as editing (but keep the answer data)
      if (lastSubmittedState) {
        lastSubmittedState.submitted = false; // Mark as not submitted anymore
        const success = storage.setItem(exerciseId, JSON.stringify(lastSubmittedState));
        console.log("Updated state to editing mode, preserved answer data");
      }
    });
  });
  
  // Log final storage state for debugging
  setTimeout(() => {
    console.log('Final storage state:', {
      available: storage.available,
      memoryData: storage.data
    });
  }, 1000);
});