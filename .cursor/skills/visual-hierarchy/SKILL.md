---
name: visual-hierarchy
description: >-
  Game Design and the setting reviewer use this before any layout mock or UI
  chrome change is shown. Catches basic visual breaks in small controls:
  bars, chips, keys, labels, and spacing.
---

# Visual hierarchy

Game Design checks this before a mock is shown. The setting reviewer checks it again, and must not review their own mock. A scene pass or an art pass does not cover a bar, a chip, or a key.

Fail it, revise it, and only then show Vero if any of these are true:

- A button, chip, or link contains another button-shaped thing. A keycap, a pill, or a bordered box inside a control is a second button. A shortcut is a letter on the control. Cream keys stay on the command line, where they mean press this key.
- Related lines do not share one edge.
- Related items do not share one gap. Centering a tall control against a short label and calling the leftover space a gap fails.
- Type is clipped. A line-height of 1 on text with a descender fails.
- Phone and desktop use a different size or weight for the same control with no reason.

Return REVISE and name the broken rule. Do not show the failing mock first.
