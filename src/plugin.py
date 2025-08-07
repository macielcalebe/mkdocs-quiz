import xml.etree.ElementTree as etree
from mkdocs.plugins import BasePlugin
from mkdocs.config import base
from mkdocs.config import config_options as c
import logging
import os
import shutil

logger = logging.getLogger(__name__)


# Placeholder for translation function, if needed
def _(text):
    """Translation function placeholder"""
    return text


class QuizPluginConfig(base.Config):
    """Configuration for the Quiz plugin"""

    auto_save = c.Type(bool, default=True)
    debug_mode = c.Type(bool, default=False)
    fallback_storage = c.Type(bool, default=True)


class QuizPlugin(BasePlugin[QuizPluginConfig]):
    """MkDocs plugin for interactive quiz elements"""

    def on_config(self, config):
        """Add the quiz extension to markdown extensions"""
        if "markdown_extensions" not in config:
            config["markdown_extensions"] = []

        # Import and register our extension
        extension_name = "src.extension:QuizExtension"
        if extension_name not in config["markdown_extensions"]:
            config["markdown_extensions"].append(extension_name)

        logger.info("Quiz plugin initialized")
        return config

    def on_post_build(self, config):
        """Copy static files to the site directory"""
        plugin_dir = os.path.dirname(__file__)
        static_dir = os.path.join(plugin_dir, "static")
        site_dir = config["site_dir"]

        target_dir = os.path.join(site_dir, "assets", "stylesheets", "quiz")
        target_js_dir = os.path.join(site_dir, "assets", "javascripts", "quiz")

        os.makedirs(target_dir, exist_ok=True)
        os.makedirs(target_js_dir, exist_ok=True)

        css_source = os.path.join(static_dir, "quiz.css")
        if os.path.exists(css_source):
            css_target = os.path.join(target_dir, "quiz.css")
            shutil.copy2(css_source, css_target)
            logger.info(f"Copied CSS file to {css_target}")

        js_source = os.path.join(static_dir, "quiz.js")
        if os.path.exists(js_source):
            js_target = os.path.join(target_js_dir, "quiz.js")
            shutil.copy2(js_source, js_target)
            logger.info(f"Copied JS file to {js_target}")

        return config

    def on_page_markdown(self, markdown, page, config, files):
        """Pass page and config to the Markdown extension"""
        if "mdx_configs" not in config:
            config["mdx_configs"] = {}

        extension_name = "src.extension:QuizExtension"
        config["mdx_configs"].setdefault(extension_name, {})
        config["mdx_configs"][extension_name]["page"] = page
        config["mdx_configs"][extension_name]["mkdocs_config"] = config
        config["mdx_configs"][extension_name]["plugin_config"] = self.config

        return markdown

    def on_page_content(self, html, page, config, files):
        """Inject CSS and JS into pages that contain quiz content"""

        if "admonition exercise" in html or "quiz-form" in html or "exercise" in html:
            plugin_dir = os.path.dirname(__file__)
            css_path = os.path.join(plugin_dir, "static", "quiz.css")
            js_path = os.path.join(plugin_dir, "static", "quiz.js")

            # Read CSS content
            css_content = ""
            if os.path.exists(css_path):
                with open(css_path, "r", encoding="utf-8") as f:
                    css_content = f.read()

            # Read JS content
            js_content = ""
            if os.path.exists(js_path):
                with open(js_path, "r", encoding="utf-8") as f:
                    js_content = f.read()

            # Inject CSS at the beginning
            if css_content:
                css_tag = f'<style type="text/css">\n{css_content}\n</style>\n'
                html = css_tag + html

            # Inject JS at the end
            if js_content:
                js_tag = f'\n<script type="text/javascript">\n{js_content}\n</script>'
                html = html + js_tag

            logger.info(f"Injected CSS and JS into page: {page.title}")

        return html
