import xml.etree.ElementTree as etree
from mkdocs.plugins import BasePlugin
from mkdocs.config import base
from mkdocs.config import config_options as c
import logging

logger = logging.getLogger(__name__)


# Placeholder for translation function, if needed
def _(text):
    """Translation function placeholder"""
    return text


class ExerciseAdmonition:
    """Base class for exercise admonitions"""

    def __init__(self, md, config, base_class, subclasses) -> None:
        self.md = md
        self.mkdocs_config = config.get("mkdocs_config")
        self.page = config.get("page")
        self.plugin_config = config.get("plugin_config", {})
        self.base_class = base_class
        self.subclasses = subclasses
        self.counter = 0
        self.id = ""

    def __set_element_id(self, el, cls):
        """Set a unique ID for the exercise element"""
        self.counter += 1
        self.id = f"{cls}_{self.counter}"

        # Check for custom ID in classes
        classes = el.attrib.get("class", "").split()
        for c in classes:
            if c.startswith("id_"):
                self.id = c[3:]
                # Remove the id_ class from the element
                el.attrib["class"] = el.attrib["class"].replace(c, "").strip()
                break

        el.set("id", self.id)
        logger.debug(f"Set element ID: {self.id}")

    def __add_exercise_description(self, el, submission_form):
        """Move exercise description to the form"""
        title = el.find('p[@class="admonition-title"]')
        answer = el.find('.//div[@class="admonition answer"]')

        if answer:
            answer_title = answer.find('p[@class="admonition-title"]')
            if answer_title is not None:
                answer_title.text = _("Answer")

        # Move content (except title, answer, and form) to the submission form
        content = []
        for child in el:
            if child == title or child == answer or child == submission_form:
                continue
            content.append(child)

        for par in content:
            el.remove(par)
            submission_form.append(par)

    def __add_exercise_form_elements(self, el, submission_form):
        """Add form elements to the exercise"""
        form_elements = etree.SubElement(submission_form, "div")
        form_elements.set("class", "form-elements")

        # Create the form HTML
        html_elements = self.create_exercise_form(el, submission_form)
        form_elements.text = self.md.htmlStash.store(html_elements)

        # Handle answer block
        answer = el.find('.//div[@class="admonition answer"]')
        if answer:
            el.remove(answer)
            answer.attrib["class"] += " quiz-answer no-indent"
            el.append(answer)
        else:
            answer_content = self.create_answer()
            if answer_content:
                answer = etree.SubElement(el, "div")
                answer.set("class", "admonition quiz-answer no-indent")
                answer.text = self.md.htmlStash.store(answer_content)

    def has_class(self, el, classes):
        """Check if element has any of the specified classes"""
        if isinstance(classes, str):
            classes = [classes]
        el_classes = el.attrib.get("class", "").split()
        return any(c in el_classes for c in classes)

    def __match_class(self, el):
        """Check if element matches the class pattern"""
        cls = self.base_class
        if cls not in el.attrib.get("class", ""):
            return None

        if self.subclasses:
            return cls if self.has_class(el, self.subclasses) else None

        return cls

    def match(self, el):
        """Check if this exercise type matches the element"""
        return bool(self.__match_class(el))

    def visit(self, el):
        """Process the matched element"""
        cls = self.__match_class(el)
        self.__set_element_id(el, cls)
        self.add_extra_classes(el)

        # Create the form
        submission_form = etree.SubElement(el, "form", {"class": "quiz-form"})

        self.__add_exercise_description(el, submission_form)
        self.__add_exercise_form_elements(el, submission_form)

        logger.debug(f"Processed exercise: {self.id}")

    def create_exercise_form(self, el, submission_form):
        """Create the form HTML (to be overridden by subclasses)"""
        return ""

    def add_extra_classes(self, el):
        """Add extra classes to the element (to be overridden by subclasses)"""
        return

    def create_answer(self):
        """Create answer content (to be overridden by subclasses)"""
        return ""


class ChoiceExercise(ExerciseAdmonition):
    """Multiple choice exercise"""

    def __init__(self, md, config) -> None:
        super().__init__(md, config, "exercise", ["choice"])
        self.answer_idx = -1

    def match(self, el):
        """Match choice exercises only"""
        cls = self.base_class
        if cls not in el.attrib.get("class", ""):
            return False

        # Only match if it explicitly has 'choice' class
        return self.has_class(el, "choice")

    def __is_answer(self, stash_key):
        """Check if a stash key represents the correct answer"""
        try:
            key = int(stash_key[stash_key.index(":") + 1 :])
            html_content = self.md.htmlStash.rawHtmlBlocks[key]
            return "checked" in html_content or 'checked="checked"' in html_content
        except (ValueError, IndexError, KeyError):
            return False

    def create_exercise_form(self, el, submission_form):
        """Create the multiple choice form"""
        # Look for any ul element (not just task-list)
        choice_list = submission_form.find(".//ul")
        choices = submission_form.findall(".//ul/li")

        # Also check for task-list class specifically
        if not choice_list:
            choice_list = submission_form.find(".//ul[@class='task-list']")
            choices = submission_form.findall(".//ul[@class='task-list']/li")

        if choice_list is not None:
            submission_form.remove(choice_list)

        if not choices:
            logger.warning(f"No choices found for exercise {self.id}")
            return ""

        html_alternatives = []
        self.answer_idx = -1
        submit_str = _("Submit")

        for i, choice in enumerate(choices):
            try:
                # Check if it has an input element with checked attribute
                input_elem = choice.find(".//input[@type='checkbox']")
                is_answer = False

                if input_elem is not None:
                    is_answer = input_elem.get("checked") is not None

                # Also check text content for [X] marker
                if not is_answer and choice.text:
                    text_content = choice.text.strip()
                    if text_content.startswith("[X]") or text_content.startswith("[x]"):
                        is_answer = True

                # Fallback to stash method
                if not is_answer:
                    end = (
                        choice.text.find("\x03") + 1
                        if choice.text and "\x03" in choice.text
                        else 0
                    )
                    is_answer = (
                        self.__is_answer(choice.text[: end - 1]) if end > 0 else False
                    )

                if is_answer:
                    self.answer_idx = i

                # Extract text content
                if choice.text:
                    text = choice.text
                    # Remove checkbox markers from display text
                    if (
                        text.startswith("[ ]")
                        or text.startswith("[X]")
                        or text.startswith("[x]")
                    ):
                        text = text[3:].strip()

                    # Handle stash references
                    end = text.find("\x03") + 1 if text and "\x03" in text else 0
                    if end > 0:
                        text = text[end:]
                else:
                    text = ""

                content = text + "".join(
                    etree.tostring(e, "unicode") for e in choice if e.tag != "label"
                )

                html_alternatives.append(
                    f"""
<label class="quiz-alternative" data-alt-index="{i}">
  <div class="content">
    <input type="hidden" name="data" value="">
    <span class="choice-text">{content}</span>
  </div>
</label>
"""
                )
            except Exception as e:
                logger.error(f"Error processing choice {i} in exercise {self.id}: {e}")
                continue

        if self.answer_idx == -1:
            logger.warning(f"No correct answer found for choice exercise {self.id}")

        el.set("data-answer-idx", str(self.answer_idx))

        return f"""
<div class="quiz-alternative-set">
  {"".join(html_alternatives)}
</div>
<button class="quiz-submit-button" type="submit">{submit_str}</button>
"""

    def add_extra_classes(self, el):
        """Add choice-specific classes"""
        current_classes = el.attrib.get("class", "")
        if "exercise-choice" not in current_classes:
            el.attrib["class"] = f"{current_classes} exercise-choice".strip()


class TextExercise(ExerciseAdmonition):
    """Text input exercise (short or long)"""

    def __init__(self, md, config) -> None:
        super().__init__(md, config, "exercise", ["short", "long", "text"])

    def match(self, el):
        """Match text exercises"""
        cls = self.base_class
        if cls not in el.attrib.get("class", ""):
            return False

        # Only match if it explicitly has text exercise indicators
        return self.has_class(el, ["short", "long", "text"])

    def create_exercise_form(self, el, submission_form):
        """Create the text input form"""
        submit_str = _("Submit")

        if self.has_class(el, "short"):
            text_widget = """
<input type="text" value="" name="data" class="quiz-text-input" 
       placeholder="Enter your answer..." autocomplete="off"/>
"""
            exercise_type = "short"
        elif self.has_class(el, "long"):
            text_widget = """
<textarea name="data" class="quiz-text-input" 
          placeholder="Enter your detailed answer..." rows="4"></textarea>
"""
            exercise_type = "long"
        elif self.has_class(el, "text"):
            # Default text exercise (no short/long specified)
            text_widget = """
<textarea name="data" class="quiz-text-input" 
          placeholder="Enter your answer..." rows="4"></textarea>
"""
            exercise_type = "text"
        else:
            # Fallback
            text_widget = """
<textarea name="data" class="quiz-text-input" 
          placeholder="Enter your answer..." rows="4"></textarea>
"""
            exercise_type = "text"

        logger.debug(f"Created {exercise_type} text exercise form for {self.id}")

        return f"""
<div class="quiz-text-container">
{text_widget}
</div>
<button class="quiz-submit-button" type="submit">{submit_str}</button>
"""

    def add_extra_classes(self, el):
        """Add text-specific classes"""
        current_classes = el.attrib.get("class", "")

        if self.has_class(el, "short") and "exercise-short" not in current_classes:
            el.attrib["class"] = f"{current_classes} exercise-short".strip()
        elif self.has_class(el, "long") and "exercise-long" not in current_classes:
            el.attrib["class"] = f"{current_classes} exercise-long".strip()
        elif self.has_class(el, "text") and "exercise-text" not in current_classes:
            el.attrib["class"] = f"{current_classes} exercise-text".strip()


class SelfProgressExercise(ExerciseAdmonition):
    """Self-assessment exercise (mark as done)"""

    def __init__(self, md, config) -> None:
        super().__init__(md, config, "exercise", [])

    def match(self, el):
        """Match self-progress exercises"""
        # Only match if it's an 'exercise' admonition and does NOT have specific types
        if "exercise" in el.attrib.get("class", ""):
            # Exclude if it has any specific exercise type classes
            if not self.has_class(el, ["choice", "short", "long", "text"]):
                return True
        return False

    def create_exercise_form(self, el, submission_form):
        """Create the self-progress form"""
        mark_done_str = _("Mark as done")

        return f"""
<div class="quiz-self-progress">
<input type="hidden" name="data" value="done" />
<button class="quiz-submit-button" type="submit">{mark_done_str}</button>
</div>
"""

    def add_extra_classes(self, el):
        """Add self-progress specific classes"""
        current_classes = el.attrib.get("class", "")
        if "exercise-self-progress" not in current_classes:
            el.attrib["class"] = f"{current_classes} exercise-self-progress".strip()


# Markdown Extension Classes
from markdown.extensions import Extension
from markdown.treeprocessors import Treeprocessor


class QuizExtension(Extension):
    """Markdown extension for quiz functionality"""

    def __init__(self, *args, **kwargs):
        self.config = {
            "locale": ["en", "Language for translation"],
            "page": [None, "Current page object"],
            "mkdocs_config": [None, "MkDocs config object"],
            "plugin_config": [{}, "Plugin configuration"],
        }
        super().__init__(*args, **kwargs)

    def extendMarkdown(self, md):
        """Register the tree processor"""
        processor = QuizTreeprocessor(md, self.getConfigs())
        md.treeprocessors.register(processor, "quiz_extension", 0)
        logger.info("Quiz extension registered")


class QuizTreeprocessor(Treeprocessor):
    """Tree processor that converts quiz admonitions"""

    def __init__(self, md, config):
        super().__init__(md)
        self.config = config
        self.md = md
        self.processed_count = 0

    def run(self, root):
        """Process the markdown tree"""
        # Order matters! Process more specific types first
        exercises = [
            ChoiceExercise(self.md, self.config),  # exercise choice
            TextExercise(self.md, self.config),  # exercise text/short/long
            SelfProgressExercise(self.md, self.config),  # exercise (generic)
        ]

        # Process all exercise elements
        for exercise in exercises:
            # Use iter() to avoid modification during iteration issues
            elements = list(root.iter())
            for el in elements:
                try:
                    if exercise.match(el):
                        exercise.visit(el)
                        self.processed_count += 1
                        logger.debug(
                            f"Processed exercise with {exercise.__class__.__name__}"
                        )
                except Exception as e:
                    logger.error(
                        f"Error processing exercise with {exercise.__class__.__name__}: {e}"
                    )
                    continue

        if self.processed_count > 0:
            logger.info(f"Processed {self.processed_count} quiz exercises")

        return root


def makeExtension(*args, **kwargs):
    """Factory function for creating the extension"""
    return QuizExtension(*args, **kwargs)
