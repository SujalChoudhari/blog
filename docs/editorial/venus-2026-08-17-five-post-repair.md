# Five-post editorial repair pipeline

This document scopes one bounded batch: narrow, evidence-led edits to `post24.mdx`, `post30.mdx`, `post31.mdx`, `post41.mdx`, and `post49.mdx`, based on the private style audit. Frontmatter, links, code fences, factual content, and the author's voice remain in scope for preservation. Posts 22, 23, 27, 28, 32, 33, 35, and 36 are explicitly out of scope.

The workflow is editorial review, not software architecture:

```mermaid
classDiagram
    class SourceAudit {
        +readPrivateAudit()
        +identifyEvidence()
        +boundTargets()
    }
    class EditorialBoundary {
        <<interface>>
        +preserveProtectedContent()
        +rejectOutOfScopeFiles()
    }
    class EditorialRepair {
        +removeSafeFiller()
        +narrowOverbroadClaims()
        +preserveFactsAndVoice()
    }
    class Validation {
        +buildSite()
        +validateMDX()
        +checkDiff()
        +verifyScope()
    }
    class PRReview {
        +inspectDiff()
        +confirmBoundaries()
    }
    SourceAudit --> EditorialBoundary : enforce scope
    SourceAudit --> EditorialRepair : evidence and scope
    EditorialBoundary --> EditorialRepair : protected content
    EditorialRepair --> Validation : bounded edits
    Validation --> PRReview : verified batch
```

```mermaid
sequenceDiagram
    participant A as Source audit
    participant E as Editor
    participant V as Validation
    participant R as PR review
    A->>E: Provide findings for five named posts
    E->>E: Make narrow edits only where justified
    E->>V: Submit five posts and one design doc
    V->>V: Build, parse MDX, check whitespace and scope
    V-->>E: Pass or actionable failure
    E->>R: Present committed local batch
    R->>R: Compare diff with audit and boundaries
```

## Editorial HLD

```mermaid
flowchart LR
    Audit[Private style audit] --> Scope[Five-post bounded scope]
    Scope --> Posts[Target MDX posts]
    Scope --> Doc[This editorial design doc]
    Posts --> Edit[Narrow editorial edit]
    Edit --> Validate[Build and diff validation]
    Doc --> Validate
    Validate --> Review[Local PR review readiness]
```

## Editorial LLD

```mermaid
flowchart TD
    Read[Read audit and all targets] --> Classify{Finding type}
    Classify -->|wrapper or filler| Trim[Remove or smooth only safe prose]
    Classify -->|"broad technical/process claim"| Qualify["Narrow claim; retain teaching point"]
    Classify -->|already repaired| Minimal[Make no churn; record rationale]
    Trim --> Preserve["Check frontmatter, links, fences, facts, voice"]
    Qualify --> Preserve
    Minimal --> Preserve
    Preserve --> Commands[Run documented build and checks]
    Commands --> ScopeCheck[Confirm exactly five posts plus one doc]
```
