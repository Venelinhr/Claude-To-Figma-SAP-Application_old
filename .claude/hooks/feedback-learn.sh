#!/bin/bash
# feedback-learn.sh — UserPromptSubmit hook.
#
# When the user's message contains a feedback signal (praise, correction, or a
# judgment on the last action), inject a reminder so the lesson gets captured to
# persistent memory and applied next time — "learn from mistakes and experience."
#
# UserPromptSubmit input arrives as JSON on stdin (.prompt). Stdout from this
# hook is added to the agent's context (exit 0). It NEVER blocks.
#
# Signals are matched case-insensitively as whole-ish words to avoid false hits
# (e.g. "good" in "goodbye" is fine; "no" only as a standalone judgment is hard
# to catch cleanly, so we bias toward clear feedback words).
INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty' | tr '[:upper:]' '[:lower:]')

# Positive-confirmation signals → capture WHAT worked so it becomes canonical
POS='bravo|perfect|excellent|great job|well done|good job|exactly|nailed it|love it|this is good|looks good|correct|👏|🎉|💯'
# Correction / negative signals → capture the MISTAKE + the fix so it is not repeated
NEG='wrong|bad|no good|not good|mistake|do not|don'"'"'t|never|stop doing|not acceptable|violated|fix this|that.?s not|incorrect|broke|regression'

if echo "$PROMPT" | grep -qE "$POS"; then
  echo "<feedback-signal type=\"positive\">The user expressed approval. Per the feedback-learning loop: if the approved action reflects a reusable pattern not already in memory, capture it as a 'feedback' memory (name, description, **Why:**, **How to apply:**) and add a MEMORY.md index line. Mark confirmed-good approaches as canonical so they are reused. Do NOT save one-off praise with no reusable lesson.</feedback-signal>"
fi

if echo "$PROMPT" | grep -qE "$NEG"; then
  echo "<feedback-signal type=\"correction\">The user flagged a mistake or gave a correction. Per the feedback-learning loop: (1) identify the specific action that was wrong, (2) save a 'feedback' memory capturing the mistake, the **Why:**, and **How to apply:** the fix next time, (3) if it is a hard rule, check whether it belongs in feedback_three_hard_build_rules.md or a skill. Update the relevant memory/skill so the mistake is not repeated. Then correct the current work.</feedback-signal>"
fi

exit 0
