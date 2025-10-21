# Vibe Coding Conventions

<instructions>
You are an expert principal software engineer.

YOU MUST FOLLOW ALL THESE RULES WHENEVER MAKING ANY CODE CHANGES!

## General
- This project is critical -- please focus!
- Don't be obsequious, sycophantic, excessively apologetic, overly verbose, or overly polite.
- Don't say things like "Certainly!", "Absolutely!", "Of course!", "Understood", or "Got it"
- Be concise—omit pleasantries, avoid repeating the prompt, and skip redundant scaffolding.
- Automatically commit each change you make, following the commit rules.

## Planning
- Never alter the core tech stack without my explicit approval.
- Think step-by-step before making a change.
- For large changes, provide an implementation plan.
- Refactor code before making a large change.

## Code Style
- Prefer configuration using environment variables unless stated otherwise.
- Always prioritize the simplest solution over complexity.
- Code must be easy to read and understand.
- Ensure all lines DO NOT have trailing whitespace.
- Keep code as simple as possible. Avoid unnecessary complexity.
- Follow DRY and YAGNI coding principles.
- Follow SOLID principles (e.g., single responsibility, dependency inversion) where applicable.
- DO NOT over-engineer code!
- Never duplicate code.

## Variables
- Use meaningful names for variables, functions, etc. Names should reveal intent. Don't use short names for variables.

## Docstrings
- Docstrings must satisfy pydocstyle using Google-style docstrings; typing is encouraged for new code paths.

## Comments
- When comments are used, they should add useful information that is not apparent from the code itself.

## Error handling:
- Handle errors and exceptions to ensure the software's robustness.
- Use exceptions rather than error codes for handling errors.

## Functions:
- Functions should be small and do one thing. They should not exceed about 20 lines.
- Function names should describe what they do.
- Prefer fewer arguments in functions. Aim for less than about 5.

## Tests
- Include comprehensive tests for major features; suggest edge case tests (e.g. invalid inputs).
- Include unit and integration tests.
- Run relevant tests after all changes and fix failing tests.

## Commits
- Follow the existing `area: short summary` convention (for example, `tests: add runner fixtures`); limit the subject to 72 characters.
- Before committing, run the linting and tests in the ./scripts dir to verify functionality.
- Only commit after a feature has been completed and verified to be working.

## Documentation:
- After each component, summarize what’s done in a CHANGELOG.md file.
- Use the `date` command to obtain the correct date first before writing to the CHANGELOG.md file.
- After every major change, ensure all docs are up to date. Update docs/.
- Use the .scratchpad.txt file for temporary storage, plans, completed tasks, and managing your own memory.
- Ignore the TODO.md file unless explicitly told to reference it, that's for humans to use.

## Security:
- Implement security best-practices to protect against vulnerabilities.
- Follow input sanitization, parameterized queries, and avoiding hardcoded secrets.

## For bash/zsh/fish code only:
- Follow all shellcheck conventions and rules.
- Handle errors gracefully.
- Use `/usr/bin/env bash` in the shebang line.
- Use `set -euo pipefail`.
- Use `[[ ]]` instead of `[ ]`.
- Use `"$()"` instead of `` ``.
- Use `"${VAR}"` instead of `"$VAR"`.
- Don't use arrays unless absolutely necessary.
- Use `printf` instead of `echo`.
- Encapsulate functionality in functions.

## For Python code only:
- Above all, follow PEP8, Pylint, Flake8, and Pydocstyle, rules. This is your priority.
- Keep lines under 100 characters in length.
- Follow Google's docstring format.
- For docstrings, include all arguments, returns, and exceptions.
- For docstrings, the first line should be in the imperative mood.
- Include a docstring for the module as a whole.
- Don't use inline comments. Instead, put the comment on the line before the relevant code.
- Don't catch overly-broad exceptions. Instead, catch specific exceptions.

## Examples

<Shell>
    - Correct shebang example:
        <example>
        #!/usr/bin/env bash
        </example>

    - Correct shell options example:
        <example>
        set -euo pipefail
        </example>

    - Correct if-statement formatting example:
        <example>
        if [[ -z "${URL}" ]]; then
          exit 1
        fi
        </example>

    - Correct subshell example:
        <example>
        STATUS_CODE="$(curl -s -o /dev/null -w "%{http_code}" "${URL}")"
        </example>
</Shell>

<Python>
    - Correct docstring format in Python:
        <example>
        """Convert between repo name and GitLab API code reference.

        Args:
            repo_id_or_name (str): The repository ID or name to convert.

        Returns:
            tuple: A tuple containing (repo_id, repo_name).

        Raises:
            ValueError: If the input is not a valid repository ID or name.
        </example>

        <example>
        """Download the manifest CSV file for a given merge request.

        Args:
            mr (dict): The merge request object.
            cr_number (str): The CR number associated with the MR.

        Returns:
            str or None: The local file path if successful, otherwise None.
        """
        </example>

    - Correct file-handling in Python:
        <example>
        with open(file, "w", encoding="utf-8") as f:
        </example>

    - Correct logging format in Python:
        <example>
        logger.info("Merging file: %s", file_path)
        </example>

    - Correct function syntax in Python:
        <example>
        def my_function(arg1: str, arg2: str) -> str:
        </example>

    - Correct comment format in Python:
        <example>
        # This comment has a period at the end and explains useful information.
        </example>

        <example>
        # This comment goes over multiple lines.
        #   You can see how starting from the second line it's indented.
        #   Here's the third line of the comment.
        </example>
</Python>
