# How the citation check works, and how it was measured

AI Assistant for Zotero does not ask you to trust the AI. Every answer is checked against the text of your PDFs, and
each citation shows what was confirmed. This page explains what the marks mean, what the check can and cannot prove,
and the numbers behind it.

## What you see

Every claim in an answer cites a page of the PDF. Next to each citation there is a mark:

| Mark | Meaning |
|---|---|
| ✓ | Confirmed in the PDF. A direct quote was found word for word on that page, or a second reading confirmed that the sentence says what the cited passage says |
| ≈ | To confirm. The cited passage exists on that page, but the sentence only partly matches it |
| ✗ | To review. The quote is not in the PDF, the words were changed, or the sentence contradicts the passage |
| no mark | Not checked. Click the citation to open the PDF on that page |

Click any marked citation to see the passage from the PDF, highlighted, under the sentence. When something does not
match, the card shows the answer and the PDF side by side, with the differences marked.

## How it works

1. **The AI must point to the source.** Each citation carries a short excerpt (5 to 15 words) copied from the PDF.
   You never see it, but the add-on uses it to find the exact passage.
2. **The add-on finds the passage itself.** It searches the PDF text for the excerpt, without asking the AI. Broken
   spaces, line-end hyphens, ligatures and in-text references are handled, so PDF quirks do not cause false alarms.
3. **Direct quotes must match word for word.** One changed word, a missing "not" or a different number is enough to
   mark it ✗.
4. **Numbers are checked against the cited article.** Percentages and decimals must appear in the article the sentence
   cites, not just anywhere.
5. **A second reading checks the meaning.** A short extra request shows the AI each sentence next to the passage it
   cites (with the surrounding paragraph) and asks: does it say the same? Yes, partly, no, or a correct interpretation.

## What the check cannot prove

- A ✓ means the sentence matches the cited passage. It does not mean the article's own claims are true.
- The second reading is done by an AI. It is a strong filter, not a proof. That is why "partly" stays ≈ and never
  turns green.
- Sentences without a citation are not checked. The add-on tells you how many there were.

## How it was measured

Measured on real research articles, without and with deliberately planted errors.

**The text search (no AI involved), 3 real articles:**
- 0 false alarms in 120 correct quotes, 64 quotes with an in-text reference removed and 94 numbers.
- Caught 100% of changed words, removed negations, wrong pages (3 pages away) and quotes from the wrong article.

**The second reading, 2 recent articles, 126 correct sentences and 30 broken ones:**

| | Confirmed | Interpretation (correct) | Partly | Contradicts |
|---|---|---|---|---|
| 126 correct sentences | 92 | 14 | 19 | 1 |
| 30 sentences with a planted error | 1 | 0 | 3 | 26 |

- Of the 30 planted errors, 26 were flagged as contradicting the source and 3 as only partly matching. 1 passed: a
  planted fact that the PDF almost says.
- Of the 126 correct sentences, 1 was wrongly flagged. 19 stayed ≈ for you to confirm.

**How to read these numbers.** The 1 in 30 is not an error rate of the answers. It is how many deliberately planted
errors got past the check. The errors were planted by us, of seven kinds: changed number (6), reversed meaning (6), swapped
term (5), removed or added negation (4), invented fact (4), exaggeration (3) and wrong subject (2).

## Your data

The add-on has no server. Your PDFs go only to the AI service you choose in the settings, with your own account. The
check runs on your computer.
