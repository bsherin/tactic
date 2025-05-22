import os
import re
from qworker import task_worthy
from openai import OpenAI
import openai

openai_api_key = os.environ.get("OPENAI_API_KEY")
print(f"got openai_api_key: {openai_api_key}")

class CopilotMixin(object):

    def extract_context(self, code_str, cursor_pos,
                        before_lines=40, after_lines=0):
        lines = code_str.splitlines()
        running_len = 0
        line_idx = 0
        for i, line in enumerate(lines):
            running_len += len(line) + 1  # +1 for '\n'
            if running_len > cursor_pos:
                line_idx = i
                break

        start_idx = max(0, line_idx - before_lines)
        end_idx = min(len(lines), line_idx + after_lines + 1)
        context_lines = lines[start_idx:end_idx]
        return "\n".join(context_lines)

    def clean_openai_completion(self, text):
        text = re.sub(r'^\s*```[a-z]*\s*', '', text, flags=re.IGNORECASE)
        text = re.sub(r'```\s*$', '', text)
        return text

    @task_worthy
    def update_ai_complete(self, data_dict):
        if not hasattr(self, "client"):
            if openai_api_key is not None:
                print("got openai_api_key")
                self.client = OpenAI(
                    api_key=openai_api_key
                )
            else:
                print("no openai_api_key")
                self.client = None
                return {"success": False, "message": "OpenAI API key not set"}

        if self.client is None:
            return {"success": False, "message": "OpenAI API key not set"}
        code_str = data_dict["code_str"]

        cursor_position = data_dict["cursor_position"]
        mode  = data_dict["mode"]
        context_code = self.extract_context(code_str, cursor_position)
        instructions = "You're a helpful coding assistant. "
        instructions += "Your job is to provide code completions. Just provide the code immediately following the provided user code. "
        instructions += f"The text you respond with should be valid {mode} code that can immdiately just be pasted into the code exactly as it is. "
        instructions += "That means you should not include any comments or explanations. "
        instructions += "Also be careful not to include the code that appears at the end of the code you are completing. "
        response = self.client.responses.create(
            model="gpt-4o",
            instructions=instructions,
            input=f"Here is the code to complete:\n\n{context_code}"
        )
        suggestion = self.clean_openai_completion(response.output_text)
        if len(suggestion) == 0:
            return {"success": False, "message": "No suggestion returned from OpenAI"}
        return {"success": True, "suggestion": suggestion, "change_counter": data_dict["change_counter"], "display_label": suggestion.splitlines()[0]}