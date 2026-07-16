#!/bin/bash
# validate-lesson.sh — PostToolUse(Write|Edit) hook.
#
# When a feedback_*.md memory is written/edited, check it follows the lesson
# template (skill/references/lesson-template.md): the required body fields must be
# present so a lesson is teachable + recall-matchable, not a sticky note.
# Non-blocking — emits a warning into context (same pattern as manifest-sync-check).
#
# PostToolUse input arrives as JSON on stdin (.tool_input.file_path). exit 0 never blocks.
INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only act on feedback_*.md memory files
case "$FILE" in
  *memory/feedback_*.md) : ;;
  *) exit 0 ;;
esac
[ -f "$FILE" ] || exit 0

MISSING=""
grep -qiE 'Applies-to:'         "$FILE" || MISSING="$MISSING Applies-to"
grep -qiE 'Signal:'             "$FILE" || MISSING="$MISSING Signal"
grep -qiE 'Mistake|What-worked' "$FILE" || MISSING="$MISSING Mistake/What-worked"
grep -qiE '\*\*Why'             "$FILE" || MISSING="$MISSING Why"
grep -qiE 'How.to.apply'        "$FILE" || MISSING="$MISSING How-to-apply"
grep -qiE 'Evidence:'           "$FILE" || MISSING="$MISSING Evidence"

if [ -n "$MISSING" ]; then
  echo "<lesson-schema-warning file=\"$(basename "$FILE")\">This feedback memory is missing required lesson fields:${MISSING}. Per skill/references/lesson-template.md, a lesson needs Applies-to (for recall matching), Signal, Mistake/What-worked, Why (root cause), and How-to-apply. Add the missing field(s) so the lesson is teachable and surfaces correctly via recall-lessons.sh. A lesson without Why is a symptom note, not a lesson.</lesson-schema-warning>"
fi

exit 0
