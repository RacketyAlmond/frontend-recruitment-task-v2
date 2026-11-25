# Submission: [Your Name]

## Time Spent

Total time: 3,5h assignment, 0,5h planned to spend here and on submission (approximate)

## Ticket Triage

### Tickets I Addressed

List the ticket numbers you worked on, in the order you addressed them:

1.  **CFG-142**: The price was stuck at $0.00 because the guard compared Date.now() with the API's request counter - always failed. I replaced it with a simple race-condition protection.
2.  **CFG-147**: Share links broke for names with Polish letters or emoji, because of `btoa`. I encode the JSON as UTF-8 first and use URL-safe base64.
3.  **CFG-148**: Turning off "Include Packaging" left the dependent Gift Wrap selected, the summary read `.price` of an add-on that was no longer available and crashed. The handler now refuses the change with a dependency error, and the toggle shows as locked with a "Cannot be removed while Gift Wrap is added" hint.
4.  **CFG-157**: Unsaved changes were silently lost, and `isDirty` was always true because an effect set it on every render. Claude (which I just supervised here - I figured it is the best option in this case) derived `isDirty` from a clean snapshot, added auto-save to a per-product draft when the page is hidden or closed, a browser "Leave site?" prompt, and confirmation dialogs for Discard and Delete draft.
5.  **CFG-143 (partial)**: I don't count it as resolved, but it was here in the order
6.  **CFG-144**: Removed the Quick Add button, its handler and its styles, reasoning in TICKETS.md, which I recommend visiting to see my thinking throughout the task
7.  **CFG-149**: The total and the breakdown's Total line show "Updating ..." while the price is being calculated, so a stale price is never shown (Marcus's suggested approach, with a clearer label than "...").

### Tickets I Deprioritized

List tickets you intentionally skipped and why:

| Ticket                    | Reason                                                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CFG-155                   | Low priority for much work, it would probably be the next thing I would tackle as one of the client counts on it                                        |
| CFG-153                   | Feature too large for this session, moved to Future Work                                                                                                |
| CFG-145                   | conflicts with CFG-144, decision behind omitting 145 and doing 144 is in TICKETS.md above these 2 tickets                                               |
| CFG-151                   | Low priority, error messages should be informative and they seem to be, user-friendliness seems further down in the priority list for error messages... |
| CFG-146, CFG-150, CFG-156 | investigated, not reproducible, need details from the QA                                                                                                |
| CFG-158                   | Should not be done, explained briefly in TICKETS.md                                                                                                     |

### Tickets That Need Clarification

List any tickets where you couldn't proceed due to ambiguity:

| Ticket  | Question                                                                                      |
| ------- | --------------------------------------------------------------------------------------------- |
| CFG-146 | I would need the time zone/browser - simply more details on the bug which i couldn't recreate |
| CFG-150 | I would need at least these screenshots                                                       |
| CFG-156 | I would need more details - I didn't find the missing keys based on the description           |

### Tickets With a Misleading Priority Label

Our board labels aren't always right. List tickets where you disagreed with the label (e.g. a Low that's actually High, a High that's actually Low, a Medium that's actually Unclear) and explain why. If you didn't disagree with any, say so.

| Ticket  | Label on board | Your read | Why                                                                                                           |
| ------- | -------------- | --------- | ------------------------------------------------------------------------------------------------------------- |
| CFG-157 | 🟡 Moderate    | 🟠 High   | as has been commented - "Standard UX pattern. Surprised we don't have this already", very important for users |
| CFG-158 | 🟠 High        | NONE      | Should not be done                                                                                            |

### Tickets Where You Stopped to Ask Instead of Implementing

If a ticket was ambiguous enough that the right move was to escalate / ask PM / gather more context rather than ship a fix, list it here. We value this signal — picking one interpretation blindly and shipping it can cost more than stopping to ask.

| Ticket      | Who would you ask | What you'd ask                                                                                       |
| ----------- | ----------------- | ---------------------------------------------------------------------------------------------------- |
| CFG-154     | PM / Finance      | I need a final decision on whether the discount should be applied for >=50 products or >=51 products |
| CFG-144/145 | PM                | Removal versus a shortcut - Which one should I do?                                                   |
| CFG-158     | PM                | Do I have a confirmation that this change is no longer expected?                                     |

---

## Technical Write-Up

### Critical Issues Found

Describe the most important bugs you identified:

#### Issue 1: Price never updates

**Ticket(s):** CFG-142

**What was the bug?**

usePriceCalculation guards against out-of-order responses with 'response.timestamp >= latestRequestRef.current'. The ref held 'Date.now()' but 'timestamp' is a request counter. The condition was always false, so no response was ever applied.

**How did you find it?**

Console logs

**How did you fix it?**

Each call increments a requestID held in a ref, after await, the response is applied only it its still the latest request.

**Why this approach?**

Deleting the guard would enable stale prices, the guard which I implemented is a simple but functional solution, which stood the tests.

---

### Other Changes Made

Brief description of any other modifications:

**CFG-157:** `isDirty` was always true (set by an effect on every render), now derived from a clean snapshot.
Added per-product auto-save on page hide/close, the browser "Leave site?" prompt while dirty, and confirmation dialogs for Discard and Delete draft.

- **Lint:** annotated pre-existing `react-hooks/set-state-in-effect` errors (with reasons) so the pre-commit hook passes on touched files; no new disables in new code,
  Claude Code helped me here to quickly put these in places which were out of scope for this session.

---

## Code Quality Notes

### Things I Noticed But Didn't Fix

List any issues you noticed but intentionally left:

| Issue                                                                                                                                       | Why I Left It |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| Screen is blinking when entering Drafts/Share/Discount                                                                                      | Out od scope  |
| UI is far from being optimal                                                                                                                | Out od scope  |
| UI is far from optimal                                                                                                                      | Out od scope  |
| There are occassional errors in the UI when maneuvering through the page, it seems like a large fix, I didn't try to fix it in this session | Out od scope  |

### Potential Improvements for the Future

If you had more time, what would you improve?

1. I would leave more time for this part of work - Filling the template

---

## Questions for the Team

Questions you would ask in a real scenario:

1. PM + Finance - Questions are listed above
2. Legal/Account - Does keyboard accessibility need to be fully done before the TechStyle demo
3. UX - How should I implement the pop ups for when someone leaves the page without saving/discards/deletes

---

## Assumptions Made

List any assumptions you made to proceed:

1. I should make the 144 Quick Add deletion decision by myself
2. I had to prioritize tasks, as time was tight
3. I should do both the UX and UI, too.

---

## Self-Assessment

### What went well?

I am generally happy of how this turned out, I managed to reach the goal I set for myself as I started working on this assignment

### What was challenging?

The fact that the code is generally not clean and at times badly written - It made the process longer. Also, ticket 147 was challenging, first time I did it.

### What would you do differently with more time?

As mentioned above, I would leave more time for filling this form.

---

## AI Assistance Notes (optional)

If you used AI tools (Copilot, Claude, Cursor, ChatGPT, etc.), we'd love a short note on how. **We don't score the fact that you used AI — we score the quality of your reasoning and verification.**

Useful things to share:

- What kinds of prompts you sent (paraphrase is fine, no need to paste logs)
- Where the AI helped and where you overrode it
- Anything the AI suggested that you rejected — and why
- Anything you verified manually that the AI got wrong

I used Claude Code, primarly for identifying the issue quickly in CFG-147 and in CFG-157, where I managed him in the secound part of the implementation. All the commits where
Claude was doing the code and I was overseeing are explicitly highlighted.

- For this type of work, I didn't use spec-driven or plan-driven development which I would use normally when project is due soon and development needs to be fast - I intended to do these tasks mainly by myself, thus I simply chatted with Claude.
- As I mentioned, all the places it helped me with code, have "Claude" in their names.
- It sometimes wanted me to take the complicated route, like in CFG-157, where it wanted to implement many more features and I had to control that it only does what was specified in the TICKETS.md.
- It still managed to skip some of the features mentioned in CFG-157, like a confirmation to discard/delete, I had to re-verify these.

---

## Additional Notes

Anything else you want us to know:

[Your notes]
